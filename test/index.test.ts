import Scrapy from "../src/index";
import { paths } from "../src/paths";

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

  test("get user posts", async () => {
    const posts = client.getUserPosts(15585607);
    const a = await posts.next();
    expect(a.value.list.length).toBe(10);
  });

  test("create list link", () => {
    const link = paths.userList([40433103, 50338022]);
    expect(decodeURI(link.search)).toBe("?r[]=40433103&r[]=50338022");
  });

  test("get user lists", async () => {
    const list = await client.getUserList([40433103, 50338022]);
    expect(Object.keys(list).length).toBe(2);
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
