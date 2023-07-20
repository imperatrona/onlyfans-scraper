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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Scrapy_instances, _Scrapy_rules, _Scrapy_getDynamicRules, _Scrapy_generateXBc, _Scrapy_init, _Scrapy_createHeaders;
import { createHash } from "crypto";
import axios from "axios";
function sha1(value) {
    return createHash("sha1").update(value).digest("hex");
}
class Scrapy {
    constructor(data) {
        _Scrapy_instances.add(this);
        _Scrapy_rules.set(this, void 0);
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
                    if (error instanceof Error) {
                        console.error(error.message);
                    }
                }
            }
            const PATH = `/api2/v2/users/${username}`;
            const req = yield axios.get(`https://onlyfans.com${PATH}`, {
                headers: __classPrivateFieldGet(this, _Scrapy_instances, "m", _Scrapy_createHeaders).call(this, PATH),
                httpsAgent: this.agent,
            });
            if (req.status !== 200) {
                throw new Error(`recieve some error on init \n${JSON.stringify(req.data)}`);
            }
            return req.data;
        });
    }
    GetSession() {
        return this.auth;
    }
}
_Scrapy_rules = new WeakMap(), _Scrapy_instances = new WeakSet(), _Scrapy_getDynamicRules = function _Scrapy_getDynamicRules() {
    return __awaiter(this, void 0, void 0, function* () {
        const req = yield axios.get("https://raw.githubusercontent.com/deviint/onlyfans-dynamic-rules/main/dynamicRules.json");
        if (req.status !== 200)
            throw new Error(`can't recieve dynamic rules.\nStatus: ${req.status}\nBody: ${req.data}`);
        return req.data;
    });
}, _Scrapy_generateXBc = function _Scrapy_generateXBc() {
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
        __classPrivateFieldSet(this, _Scrapy_rules, yield __classPrivateFieldGet(this, _Scrapy_instances, "m", _Scrapy_getDynamicRules).call(this), "f");
        if (!__classPrivateFieldGet(this, _Scrapy_rules, "f"))
            throw new Error("no dynamic rules");
        const PATH = "/api2/v2/init";
        const req = yield axios.get(`https://onlyfans.com${PATH}`, {
            headers: __classPrivateFieldGet(this, _Scrapy_instances, "m", _Scrapy_createHeaders).call(this, PATH),
            httpsAgent: this.agent,
        });
        if (req.status !== 200) {
            throw new Error(`recieve some error on init \n${JSON.stringify(req.data)}`);
        }
        const cookies = req.headers["Set-Cookie"];
        if (cookies) {
            this.auth.cookie = cookies.map((entry) => entry.split(";")[0]).join("; ");
        }
        return req;
    });
}, _Scrapy_createHeaders = function _Scrapy_createHeaders(path) {
    if (!__classPrivateFieldGet(this, _Scrapy_rules, "f"))
        throw new Error("no dynamic rules provided");
    const time = Date.now().toString();
    const hash = sha1([__classPrivateFieldGet(this, _Scrapy_rules, "f").static_param, time, path, this.auth.userId].join("\n"));
    const hashAscii = Buffer.from(hash, "ascii");
    const checksum = __classPrivateFieldGet(this, _Scrapy_rules, "f").checksum_indexes.reduce((total, current) => total + hashAscii[current], 0) + __classPrivateFieldGet(this, _Scrapy_rules, "f").checksum_constant;
    const sign = [
        __classPrivateFieldGet(this, _Scrapy_rules, "f").prefix,
        hash,
        Math.abs(checksum).toString(16),
        __classPrivateFieldGet(this, _Scrapy_rules, "f").suffix,
    ].join(":");
    if (!this.auth.xBc)
        throw new Error("Unauthorized: xbc not generated");
    const headers = {
        accept: "application/json, text/plain, */*",
        "app-token": __classPrivateFieldGet(this, _Scrapy_rules, "f").app_token,
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
