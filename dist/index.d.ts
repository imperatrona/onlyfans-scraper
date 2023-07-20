import type { HttpsProxyAgent } from "hpagent";
import type { User } from "./types/onlyfans.js";
interface Auth {
    userId: string;
    userAgent: string;
    xBc?: string;
    cookie?: string;
}
declare class Scrapy {
    #private;
    auth: Auth;
    agent: HttpsProxyAgent | undefined;
    constructor(data?: Auth);
    setProxy(agents: HttpsProxyAgent): void;
    getUser(username: string): Promise<User>;
    GetSession(): Auth;
}
export default Scrapy;
