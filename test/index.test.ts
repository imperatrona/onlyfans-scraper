import Scrapy from "../src/index";

test("get user by username", async () => {
  const client = new Scrapy();
  const user = await client.getUser("onlyfans");
  expect(user.username).toBe("onlyfans");
});
