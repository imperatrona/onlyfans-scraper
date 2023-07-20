# Onlyfans Scraper
This lib created for easy access to onlyfans profiles. For analytics only. Dynamic rules fetched from [deviint/onlyfans-dynamic-rules](https://github.com/deviint/onlyfans-dynamic-rules) on client initialization.


## Installation

```shell
npm i @imperatrona/onlyfans-scraper
```

## Usage

```typescript
import Scrapy from "@imperatrona/onlyfans-scraper";

const client = new Scrapy();

try {
	const user = await client.getUser("teddytorresxxx");
	console.log(user);
} catch (err) {
	if (err instanceof Error) {
		console.error(err.message);
	}
}
```

### Set Proxy

You can add proxy agent after initialization.
```typescript
import Scrapy from "@imperatrona/onlyfans-scraper";
import { HttpsProxyAgent } from "hpagent";

const client = new Scrapy();
const agent = new HttpsProxyAgent({ proxy: "http://0.0.0.0:0000" });

client.setProxy(agent);
```

### Auth with your credentials

By default client generate anon credentials, but you can use your personal account. 

```typescript
import Scrapy from "@imperatrona/onlyfans-scraper";

const client = new Scrapy({
  userId: "",
  userAgent: "",
  xBc: "",
  cookie: ""
});
```

### Get credentials

```typescript
const client = new Scrapy();
const auth = client.GetSession();
```
