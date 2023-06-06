var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Scrapy_instances, _Scrapy_rules, _Scrapy_generateXBc, _Scrapy_init, _Scrapy_createHeaders;
import { createHash } from "crypto";
import got, { HTTPError } from "got";
function sha1(value) {
    return createHash("sha1").update(value).digest("hex");
}
class Scrapy {
    constructor(data) {
        _Scrapy_instances.add(this);
        _Scrapy_rules.set(this, {
            appToken: "33d57ade8c02dbc5a333db99ff9ae26a",
            staticParam: "QAIvost4f5b29nagfmKtMqEXjDgRptq0",
            prefix: "7865",
            suffix: "6436c06b",
            checksum: {
                constant: 72,
                indexes: [
                    0, 0, 2, 2, 2, 3, 3, 4, 9, 10, 10, 13, 14, 16, 17, 19, 20, 21, 22, 24,
                    25, 26, 26, 27, 31, 32, 32, 33, 35, 36, 37, 39,
                ],
            },
        });
        this.auth = {
            userId: "0",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
        };
        this.agent = undefined;
        this.auth = Object.assign(Object.assign(Object.assign({}, this.auth), { xBc: __classPrivateFieldGet(this, _Scrapy_instances, "m", _Scrapy_generateXBc).call(this) }), data);
    }
    setProxy(agents) {
        this.agent = agents;
    }
    getUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.auth.cookie) {
                try {
                    yield __classPrivateFieldGet(this, _Scrapy_instances, "m", _Scrapy_init).call(this);
                }
                catch (error) {
                    if (error instanceof HTTPError) {
                        console.error(error.message);
                    }
                }
            }
            const PATH = `/api2/v2/users/${username}`;
            const data = yield got
                .get(`https://onlyfans.com${PATH}`, {
                headers: __classPrivateFieldGet(this, _Scrapy_instances, "m", _Scrapy_createHeaders).call(this, PATH),
                agent: this.agent,
            })
                .json();
            return data;
        });
    }
    GetSession() {
        return this.auth;
    }
}
_Scrapy_rules = new WeakMap(), _Scrapy_instances = new WeakSet(), _Scrapy_generateXBc = function _Scrapy_generateXBc() {
    const parts = [
        new Date().getTime(),
        1e12 * Math.random(),
        1e12 * Math.random(),
        this.auth.userAgent,
    ];
    const msg = parts
        .map((value) => Buffer.from(value.toString()).toString("base64"))
        .join(".");
    const token = sha1(msg);
    return token;
}, _Scrapy_init = function _Scrapy_init() {
    return __awaiter(this, void 0, void 0, function* () {
        const PATH = "/api2/v2/init";
        const data = yield got.get(`https://onlyfans.com${PATH}`, {
            headers: __classPrivateFieldGet(this, _Scrapy_instances, "m", _Scrapy_createHeaders).call(this, PATH),
            agent: this.agent,
        });
        if (data.ok) {
            const cookies = data.headers["set-cookie"];
            if (cookies) {
                this.auth.cookie = cookies
                    .map((entry) => {
                    const parts = entry.split(";");
                    const cookiePart = parts[0];
                    return cookiePart;
                })
                    .join("; ");
            }
        }
        return data;
    });
}, _Scrapy_createHeaders = function _Scrapy_createHeaders(path) {
    const time = Date.now().toString();
    const hash = sha1([__classPrivateFieldGet(this, _Scrapy_rules, "f").staticParam, time, path, this.auth.userId].join("\n"));
    const checksum = __classPrivateFieldGet(this, _Scrapy_rules, "f").checksum.indexes.reduce((total, current) => total + hash[current].charCodeAt(0), 0) + __classPrivateFieldGet(this, _Scrapy_rules, "f").checksum.constant;
    const sign = [
        __classPrivateFieldGet(this, _Scrapy_rules, "f").prefix,
        hash,
        checksum.toString(16),
        __classPrivateFieldGet(this, _Scrapy_rules, "f").suffix,
    ].join(":");
    if (!this.auth.xBc)
        throw new Error("Unauthorized: xbc not generated");
    const headers = {
        accept: "application/json, text/plain, */*",
        "app-token": __classPrivateFieldGet(this, _Scrapy_rules, "f").appToken,
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
};
export default Scrapy;
