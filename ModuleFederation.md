# Module Federation?

- Introduced in `Webpack 5`.
- Allows a `Webpack build (called a host) to dynamically import code from another Webpack build (called a remote) at runtime`.
- **Both builds remain independently deployed, yet can share code**.

✅ Example use case:

- A large enterprise app `split into micro frontends (auth, dashboard, profile).`
- Each team builds and deploys their own app.
- The shell app (host) loads features from the remote apps on demand.

## Key Concepts

1. **Host (Container / Shell App)**

- The `application that consumes remote modules`.
- Example: A dashboard app that loads authentication from another app.

2. **Remote**

- An application `that exposes modules to other apps`.
- Example: The auth app exposing its login component.

3. **Shared Modules**

- `Dependencies that should not be duplicated across host/remote`.
- Example: React, ReactDOM (only one copy should be loaded).

## Webpack Configuration

1. **Remote App (authApp)**

```js
// Exposes a Login component.
// webpack.config.js (remote)
const ModuleFederationPlugin =
  require('webpack').container.ModuleFederationPlugin;
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  output: {
    publicPath: 'http://localhost:3001/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'authApp', // global var for remote
      filename: 'remoteEntry.js', // manifest file
      exposes: {
        './Login': './src/components/Login', // exposed module
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
  ],
};
// ➡️ This generates http://localhost:3001/remoteEntry.js, describing what is exposed.
```

2. **Host App (dashboardApp)**

```js
// Consumes Login from remote.
// webpack.config.js (host)
const ModuleFederationPlugin =
  require('webpack').container.ModuleFederationPlugin;
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  output: {
    publicPath: 'http://localhost:3000/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboardApp',
      remotes: {
        authApp: 'authApp@http://localhost:3001/remoteEntry.js', // consuming remote
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
  ],
};
```

```js
// ➡️ Host can now import remote modules like this:
// host/src/index.js
import('authApp/Login').then((LoginModule) => {
  const Login = LoginModule.default;
  // render <Login />
});
```

3. **Shared Dependencies**

```js
shared: {
  react: { singleton: true, requiredVersion: "^18.0.0" },
  "react-dom": { singleton: true },
}
```

**singleton: true** → `Only one copy allowed across host + remote.`
**requiredVersion** → `Ensures compatible versions.`

| Concept            | Meaning                                  |
| ------------------ | ---------------------------------------- |
| **Host**           | App that consumes remotes                |
| **Remote**         | App that exposes modules                 |
| **Shared**         | Dependencies loaded once (singleton)     |
| **remoteEntry.js** | Manifest file describing exposed modules |
