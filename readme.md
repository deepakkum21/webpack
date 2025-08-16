# Webpack

| **Section**      | **Property**                          | **Description**                                                   |
| ---------------- | ------------------------------------- | ----------------------------------------------------------------- |
| **Core**         | `entry`                               | Entry point(s) for the application (string, array, or object).    |
|                  | `output`                              | Where and how to emit bundled files (path, filename, publicPath). |
|                  | `mode`                                | Sets optimizations: `"development"`, `"production"`, `"none"`.    |
|                  | `target`                              | Defines runtime environment (`web`, `node`, `es2020`, etc.).      |
|                  | `devtool`                             | Source map type (e.g., `source-map`, `inline-source-map`).        |
|                  | `plugins`                             | Extend functionality with plugins (e.g., HtmlWebpackPlugin).      |
|                  | `externals`                           | Prevent bundling certain dependencies (use globals).              |
|                  | `cache`                               | Configure caching for faster rebuilds.                            |
|                  | `stats`                               | Control build output logs.                                        |
|                  | `watch` / `watchOptions`              | Rebuild on file changes; configure watch behavior.                |
|                  | `profile`                             | Enable performance profiling.                                     |
|                  | `performance`                         | Show warnings/errors for oversized assets.                        |
|                  | `infrastructureLogging`               | Control Webpack’s internal logging.                               |
|                  | `parallelism`                         | Max parallel file generation processes.                           |
|                  | `experiments`                         | Enable experimental features (e.g., topLevelAwait, wasm).         |
| **Modules**      | `module.rules`                        | Define loaders/rules for file types (CSS, images, TS, etc.).      |
|                  | `resolve`                             | Configure module resolution (aliases, extensions, fallback).      |
| **Optimization** | `optimization.minimize`               | Enable/disable minification.                                      |
|                  | `optimization.minimizer`              | Custom minimizers (Terser, CSS).                                  |
|                  | `optimization.splitChunks`            | Code splitting configuration.                                     |
|                  | `optimization.runtimeChunk`           | Extract runtime into a separate chunk.                            |
|                  | `optimization.moduleIds` / `chunkIds` | How IDs are generated.                                            |
|                  | `optimization.concatenateModules`     | Scope hoisting.                                                   |
|                  | `optimization.sideEffects`            | Enable tree-shaking.                                              |
| **Dev Server**   | `devServer.port`                      | Port number for local dev server.                                 |
|                  | `devServer.open`                      | Auto-open browser on start.                                       |
|                  | `devServer.hot`                       | Enable Hot Module Replacement (HMR).                              |
|                  | `devServer.static`                    | Serve static files from a folder.                                 |
|                  | `devServer.historyApiFallback`        | Fallback for SPA routing.                                         |

## Asset modules

- a built-in `way to handle static files` (images, fonts, media, etc.) without extra loaders like file-loader or url-loader.

| Type             | Output                                  | Similar to old loader   |
| ---------------- | --------------------------------------- | ----------------------- |
| `asset/resource` | Separate file (URL)                     | `file-loader`           |
| `asset/inline`   | Base64 inlined in bundle                | `url-loader` (no limit) |
| `asset/source`   | Source string                           | `raw-loader`            |
| `asset`          | Auto inline or resource by size `(8kb)` | `url-loader` with limit |

1. `asset/resource`

- Emits a separate file into the output directory and exports the URL.
- Similar to the old file-loader.

```js
{
  test: /\.png$/,
  type: 'asset/resource'
}

// usage
import logo from './logo.png';
console.log(logo); // '/dist/logo.hash.png'
```

2. `asset/inline`

- Inlines the file as a Base64 URI in the JavaScript bundle.
- Similar to the old url-loader with limit: Infinity.

```js
{
  test: /\.svg$/,
  type: 'asset/inline'
}

//usage
import icon from './icon.svg';
console.log(icon); // 'data:image/svg+xml;base64,...'
```

3. `asset/source`

- Exports the source code of the file as a string.
- Similar to the old raw-loader.

```js
{
  test: /\.txt$/,
  type: 'asset/source'
}

//usage
import text from './note.txt';
console.log(text); // 'This is file content...'
```

4. `asset`

- Automatic choice between resource and inline based on file size.
- Uses parser.dataUrlCondition.maxSize to decide.
- `Default max size is 8kb.`
- Behavior:
  - Small files → inlined as Base64
  - Large files → emitted as separate resources

```js
{
  test: /\.jpg$/,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 4 * 1024 // 4kb
    }
  }
}
```
