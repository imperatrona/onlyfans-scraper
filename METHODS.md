# Methods


## User

### Get user

```typescript
const user = await client.getUser("onlyfans")
```
You can also use numeric id of user:
```typescript
const user = await client.getUser(15585607)
```

### Get me
```typescript
const user = await client.getMe()
```

### Get user list
```typescript
const users = await client.getUserList([40433103, 50338022])
```

Will return:
```json
{
  "40433103": {},
  "50338022": {}
}
```

### Get social buttons

```typescript
const socials = await client.getUserSocialButtons(23441554)
```

### Get user posts
```typescript
  // Make sure to set delay to prevent getting banned
  client.delay = 5000;

  for await (const value of client.getUserPosts(26371184)) {
    console.log(value);
  }
```

