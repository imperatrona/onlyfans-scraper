import Scrapy from "../src/index";

describe("public methods", () => {
  const client = new Scrapy();

  test("get user by username", async () => {
    const user = await client.getUser("onlyfans");
    expect(user.username).toBe("onlyfans");
  });

  test("get user by id", async () => {
    const user = await client.getUser(332255887);
    expect(user.username).toBe("sjayscloset");
  });
});

describe("auth methods", () => {
  const client = new Scrapy({
    userId: 0,
    userAgent: "",
    // cookie: "",
    // xBc: ""
  });

  test("get user social buttons", async () => {
    const buttons = await client.getUserSocialButtons(23441554);
    expect(buttons.length).toBe(3);
  });

  test("get me", async () => {
    const me = await client.getMe();
    expect(me.id).toBe(client.GetSession().userId);
  });
});
