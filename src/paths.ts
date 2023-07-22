const BASE = "https://onlyfans.com";
export const paths = {
  init: () => new URL(`${BASE}/api2/v2/init`),
  me: () => new URL(`${BASE}/api2/v2/users/me`),
  user: (username: string | number) =>
    new URL(`${BASE}/api2/v2/users/${username}`),
  userSocialButtons: (id: number) =>
    new URL(`${BASE}/api2/v2/users/${id}/social/buttons`),
  userPosts: (id: number, cursor: string | null = null) =>
    new URL(
      `${BASE}/api2/v2/users/${id}/posts?limit=10&order=publish_date_desc&skip_users=all&format=infinite&pinned=0&counters=0` +
        (cursor ? `&beforePublishTime=${cursor}` : "")
    ),
  userList: (ids: number[]) => {
    const url = new URL(`${BASE}/api2/v2/users/list`);
    ids.forEach((id) => url.searchParams.append("r[]", id.toString()));
    return url;
  },
};
