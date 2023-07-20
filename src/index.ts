import { createHash } from "crypto";
import axios from "axios";

import type { HttpsProxyAgent } from "https-proxy-agent";
import type { Rules, User } from "./types/onlyfans.js";

interface Auth {
  userId: string;
  userAgent: string;
  xBc?: string;
  cookie?: string;
}

function sha1(value: string) {
  return createHash("sha1").update(value).digest("hex");
}

class Scrapy {
  #rules: Rules | undefined;

  auth: Auth = {
    userId: "0",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
  };

  agent: HttpsProxyAgent<string> | undefined = undefined;

  constructor(data?: Auth) {
    this.auth = {
      ...this.auth,
      xBc: this.#generateXBc(),
      ...data,
    };
  }

  setProxy(agents: HttpsProxyAgent<string>) {
    this.agent = agents;
  }

  async #getDynamicRules(): Promise<Rules> {
    const req = await axios.get(
      "https://raw.githubusercontent.com/deviint/onlyfans-dynamic-rules/main/dynamicRules.json"
    );

    if (req.status !== 200)
      throw new Error(
        `can't recieve dynamic rules.\nStatus: ${req.status}\nBody: ${req.data}`
      );

    return req.data as Rules;
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
   * Get cookies if not defined, used for anonymous client
   * @private
   */
  async #init() {
    this.#rules = await this.#getDynamicRules();
    if (!this.#rules) throw new Error("no dynamic rules");

    const PATH = "/api2/v2/init";

    const req = await axios.get(`https://onlyfans.com${PATH}`, {
      headers: this.#createHeaders(PATH),
      httpsAgent: this.agent,
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
    if (this.auth.userId && this.auth.userId !== "0") {
      headers["user-id"] = this.auth.userId;
    }

    return headers;
  }

  async getUser(username: string) {
    if (!this.auth.cookie) {
      try {
        await this.#init();
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }

    const PATH = `/api2/v2/users/${username}`;

    const req = await axios.get(`https://onlyfans.com${PATH}`, {
      headers: this.#createHeaders(PATH),
      httpsAgent: this.agent,
    });

    if (req.status !== 200) {
      throw new Error(
        `recieve some error on init \n${JSON.stringify(req.data)}`
      );
    }

    return req.data as User;
  }

  GetSession() {
    return this.auth;
  }
}

export default Scrapy;
