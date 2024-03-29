import { createHash } from "crypto";
import { URL } from "url";
import axios from "axios";

import type { HttpsProxyAgent } from "hpagent";
import { paths } from "./paths";
import { Rules, getDynamicRules } from "./getDynamicRules";
import type { User, SocialButtons, PostsResponse } from "./types";

interface Auth {
  userId: number;
  userAgent: string;
  xBc?: string;
  cookie?: string;
}

function sha1(value: string) {
  return createHash("sha1").update(value).digest("hex");
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class Scrapy {
  delay = 0;
  #latestRequest = 0;
  #rules: Rules | undefined;
  #agent: HttpsProxyAgent | undefined = undefined;
  auth: Auth = {
    userId: 0,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
  };

  constructor(data?: Auth) {
    this.auth = {
      ...this.auth,
      xBc: this.#generateXBc(),
      ...data,
    };
  }

  setProxy(agents: HttpsProxyAgent) {
    this.#agent = agents;
  }

  #generateXBc(): string {
    const parts = [
      new Date().getTime(),
      1e12 * Math.random(),
      1e12 * Math.random(),
      this.auth.userAgent,
    ];
    const msg = parts
      .map((value) => Buffer.from(value.toString()).toString("base64"))
      .join(".");
    const token: string = sha1(msg);

    return token;
  }

  /**
   * Make sure actual rules is fetched
   * @private
   */
  async #getRules() {
    if (!this.#rules) {
      try {
        this.#rules = await getDynamicRules();
      } catch (err) {
        throw new Error("no dynamic rules");
      }
    }
  }

  /**
   * Get cookies if not defined, used for anonymous client
   * @private
   */
  async #init() {
    await this.#getRules();
    const PATH = paths.init();

    const req = await axios.get(PATH.toString(), {
      headers: this.#createHeaders(PATH.pathname + PATH.search),
      httpsAgent: this.#agent,
    });

    if (req.status !== 200) {
      throw new Error(
        `recieve some error on init \n${JSON.stringify(req.data)}`
      );
    }

    const cookies: string[] = req.headers["Set-Cookie"];

    if (cookies) {
      this.auth.cookie = cookies.map((entry) => entry.split(";")[0]).join("; ");
    }

    return req;
  }

  #createHeaders(path: string) {
    if (!this.#rules) throw new Error("no dynamic rules provided");
    const time = Date.now().toString();
    const hash = sha1(
      [this.#rules.static_param, time, path, this.auth.userId].join("\n")
    );
    const hashAscii = Buffer.from(hash, "ascii");

    const checksum =
      this.#rules.checksum_indexes.reduce(
        (total: number, current: number) => total + hashAscii[current],
        0
      ) + this.#rules.checksum_constant;

    const sign = [
      this.#rules.prefix,
      hash,
      Math.abs(checksum).toString(16),
      this.#rules.suffix,
    ].join(":");

    if (!this.auth.xBc) throw new Error("Unauthorized: xbc not generated");

    const headers: { [key: string]: string } = {
      accept: "application/json, text/plain, */*",
      "app-token": this.#rules.app_token,
      sign: sign,
      time: time,
      "user-agent": this.auth.userAgent,
      "x-bc": this.auth.xBc,
    };

    if (this.auth.cookie) {
      headers["cookie"] = this.auth.cookie;
    }
    if (this.auth.userId && this.auth.userId !== 0) {
      headers["user-id"] = this.auth.userId.toString();
    }

    return headers;
  }

  async #getRequest<Type>(path: URL): Promise<Type> {
    await this.#getRules();

    if (this.delay > 0) {
      if (this.#latestRequest !== 0) {
        const toWait = this.#latestRequest + this.delay - +new Date();
        if (toWait > 0) await delay(toWait);
      }

      this.#latestRequest = +new Date();
    }

    const req = await axios.get(path.toString(), {
      headers: this.#createHeaders(path.pathname + path.search),
      httpsAgent: this.#agent,
    });

    if (req.status !== 200) {
      throw new Error(
        `recieve some error on init \n${JSON.stringify(req.data)}`
      );
    }

    return req.data;
  }

  /**
   * Returns user by username or id
   */
  async getUser(username: string | number) {
    if (!this.auth.cookie) await this.#init();
    return this.#getRequest<User>(paths.user(username));
  }

  /**
   * Returns user list by ids
   */
  async getUserList(ids: number[]) {
    if (!this.auth.cookie) await this.#init();
    if (ids.length > 10) throw new Error("too much ids, limit 10");
    return this.#getRequest<{ [key: string]: User }>(paths.userList(ids));
  }

  /**
   * Returns currently authorized user
   */
  async getMe() {
    if (!this.auth.cookie && this.auth.userId === 0) {
      throw new Error("client need to be authorized to use this method");
    }
    return this.#getRequest<User>(paths.me());
  }

  /**
   * Get social buttons of user.
   */
  async getUserSocialButtons(id: number) {
    if (!this.auth.cookie && this.auth.userId === 0) {
      throw new Error("client need to be authorized to use this method");
    }
    return this.#getRequest<SocialButtons[]>(paths.userSocialButtons(id));
  }

  /**
   * Get posts of user
   */
  async *getUserPosts(
    id: number,
    cursor: string | null = null
  ): AsyncGenerator<PostsResponse> {
    let latestPage = cursor;
    while (true) {
      const req = await this.#getRequest<PostsResponse>(
        paths.userPosts(id, latestPage)
      );
      latestPage = req.tailMarker;
      yield req;
      if (!req.hasMore) break;
    }
  }

  GetSession() {
    return this.auth;
  }
}

export = Scrapy;
