# Onlyfans Scraper
This lib created for easy access to onlyfans profiles. For analytics only.


## Installation

```shell
npm i @imperatrona/onlyfans-scraper
```

## Usage

```typescript
import Scrapy from "@imperatrona/onlyfans-scraper";
import { HTTPError } from "got";

const client = new Scrapy();

try {
	const user = await client.getUser("teddytorresxxx");
	console.log(user);
} catch (err) {
	if (err instanceof HTTPError) {
		console.error(err.code, err.message);
	}
}
```

### Set Proxy

You can add proxy agent after initialization.
```typescript
import Scrapy from "@imperatrona/onlyfans-scraper";
import { HttpsProxyAgent } from "hpagent";

const client = new Scrapy();

client.setProxy({
	http: new HttpsProxyAgent({ proxy: "http://0.0.0.0:0000" }),
});
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
