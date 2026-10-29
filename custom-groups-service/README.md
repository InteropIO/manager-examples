# Introduction

An example that demonstrates how to provide a custom Groups service to **io.Manager**.

# Custom Groups service

By default **io.Manager** stores groups and resolves the groups a user belongs to using its internal Groups Service implementation. Providing a custom Groups service through the `groups_service` configuration property replaces that with your own implementation.

A custom Groups service implements the `GroupsService` interface exported from `@interopio/manager`. Its `getSupportedFeatures()` method declares which operations the implementation supports - **io.Manager** invokes a group management operation only when the corresponding capability flag is `true`, so an implementation that only reads groups can report `false` for the write operations and leave those methods as stubs.

This example implements [MyGroupsService](./src/MyGroupsService.ts) as a thin adapter over the in-memory stores in [data.ts](./src/data.ts) that stand in for an external system.

`getAllGroups()` receives a `DataRequest` holding the filtering, sorting, and paging the caller asked for. This example ignores it and returns every group, so `total` is always the full count. An implementation backed by a real system applies the request and returns the matching page.

For an example that combines a custom Groups service with a custom authenticator, see the [auth-custom](../auth-custom) example.

# Group expansion

A group can include the groups of another group through its `expandsTo` property. When **io.Manager** authorizes a request, it takes the groups the user belongs to, expands each one through `expandsTo`, and authorizes against the result. Expansion is transitive, and the groups it started from stay in the result.

This example declares two groups in [data.ts](./src/data.ts):

| Group                      | `expandsTo`                                |
| -------------------------- | ------------------------------------------ |
| `Apps Manager`             | `IO_MANAGER:APPS:WRITE`                    |
| `Apps and Layouts Manager` | `Apps Manager`, `IO_MANAGER:LAYOUTS:WRITE` |

`number.two@company.xyz` belongs to `Apps and Layouts Manager` alone, so `getUserGroups()` returns `["Apps and Layouts Manager"]`. **io.Manager** expands that to:

- `Apps and Layouts Manager`
- `Apps Manager`, from `Apps and Layouts Manager`
- `IO_MANAGER:APPS:WRITE`, from `Apps Manager`
- `IO_MANAGER:LAYOUTS:WRITE`, from `Apps and Layouts Manager`
- `IO_MANAGER:APPS:READ`, `IO_MANAGER:LAYOUTS:READ`, and `IO_MANAGER:SCHEMAS:READ`, from the built-in expansion of the two write groups

Only the first two entries come from this service. The read groups and `IO_MANAGER:SCHEMAS:READ` arrive because **io.Manager** expands its own write groups, which is why a custom service does not need to list them.

Two points follow from this:

- `getUserGroups()` returns the groups the user belongs to directly. There's no need to expand them in the custom service, because **io.Manager** expands them again afterwards.
- **io.Manager** reads the `expandsTo` values from `getAllGroups()`, so `canGetAllGroups` must be `true` for this service's groups to take part in expansion.

The `IO_MANAGER:*` groups and `GLUE42_SERVER_ADMIN` are built into **io.Manager**. A group can expand into them without this service declaring them, and a custom service cannot change what they expand into.

### Checking the expansion

**io.Manager** exposes the resolved set through `POST /api/v2/groups/expand`. The endpoint takes a list of group names and returns every group reachable from them, which is the set authorization runs against. Use it to confirm that the groups a custom service returns expand the way you expect.

The endpoint requires `IO_MANAGER:GROUPS:READ`. This example sets `auth_exclusive_users: ['admin']`, which places `admin` in `GLUE42_SERVER_ADMIN`, and `auth_method: 'none'` takes the caller from the `user` header:

```sh
curl -X POST http://localhost:4356/api/v2/groups/expand \
  -H "user: admin" \
  -H "Content-Type: application/json" \
  -d '["Apps and Layouts Manager"]'
```

```json
[
  "Apps and Layouts Manager",
  "IO_MANAGER:APPS:READ",
  "IO_MANAGER:SCHEMAS:READ",
  "IO_MANAGER:APPS:WRITE",
  "IO_MANAGER:LAYOUTS:READ",
  "Apps Manager",
  "IO_MANAGER:LAYOUTS:WRITE"
]
```

The order of the returned names carries no meaning. A caller without `IO_MANAGER:GROUPS:READ` receives an HTTP 403 status code.

The endpoint is also in the Swagger UI at `http://localhost:4356/api/swagger`, under **Groups V2**.

# Prerequisites

### Database

io.Manager requires a database to connect to - this example uses MongoDB, but you can use any other of the supported databases. You will need to either have a local instance or setup a remote database to connect to. For more information visit our Documentation page on the subject: https://docs.interop.io/manager/databases/overview/index.html

### License

**io.Manager** requires a license key to operate. To acquire a license key, contact us at `sales@interop.io`.

# How to run

- Install npm packages

```sh

npm install

npm audit fix

```

- Start the server

```sh

npm run start

```
