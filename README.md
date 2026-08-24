# Social Feed — Auth & UI Build

Take-home project built for a Software Engineer I application at Ruggable.

The brief was to reproduce a well-known social feed UI closely enough that the
styling holds up under inspection, backed by real authentication rather than a
mocked login. Instagram's landing and sign-up flow was the reference.

![Screenshot](./IG-clone.png)

The Heroku deployment is gone — free dynos were retired in November 2022 — so
the app runs locally only. Setup is below.

## What it demonstrates

**JWT authentication end to end.** Registration hashes with bcrypt, issues a
signed token, and returns it to the client. `middleware/auth.js` verifies the
`x-auth-token` header on protected routes and attaches the decoded user to the
request. On the client, `utils/setAuthToken.js` attaches the token to every
axios request, and `components/routing/PrivateRoute.js` gates routes on auth
state rather than on a page-level check.

The signing secret is read from `process.env.SECRET_KEY` via dotenv — it is not
committed.

**State without Redux.** Two Context + reducer pairs, one for auth and one for
alerts, each with the `State` / `Context` / `Reducer` split and a shared
`types.js`. Enough structure to keep auth state and transient UI messages
separate without pulling in a store.

**SCSS architecture.** A partials layer under `client/src/scss` holds the design
primitives — `_colors`, `_fonts`, `_forms`, `_buttons`, `_reset`, `_global` —
imported through `_main.scss`. Each component then owns a local `style.scss`
next to its `index.js`. Segoe UI is bundled rather than linked, so the type
matches the reference on machines that don't have it.

**Server-side validation.** `express-validator` chains on the register and login
routes return a structured `errors` array, which the client renders through the
alert context instead of `alert()`.

## Layout

```
server.js               Express entry; serves client/build in production
config/db.js            Mongoose connection
middleware/auth.js      JWT verification
models/User.js          User schema
routes/users.js         POST /api/users     — register
routes/auth.js          POST /api/auth      — login
                        GET  /api/auth      — current user

client/src/context/     auth + alert state (Context/Reducer)
client/src/components/  AuthCard, Alerts, Footer, pages/, routing/
client/src/scss/        shared partials and bundled fonts
```

## Running it

Requires Node 14+ and a MongoDB connection string.

```bash
npm run install-all      # root + client dependencies
```

Create `.env` in the project root:

```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
SECRET_KEY=<any long random string>
```

```bash
npm run dev              # API on :5003, client on :3000, concurrently
```

| Command | What it does |
|---|---|
| `npm run dev` | API and client together |
| `npm run server` | API only, with nodemon |
| `npm run client` | Client only |
| `npm run install-all` | Install both dependency trees |

## Stack

React 17 · React Router 5 · Context API · SCSS (node-sass) · Express 4 ·
Mongoose 6 · MongoDB Atlas · JWT · bcryptjs · express-validator
