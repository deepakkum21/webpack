# Webpack

## Default webpack

```js
const path = require('path');

const config = {
  entry: './src', // default entry point is index.js in the src directory if file is not specified
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // default output filename is main.js
  },
  mode: 'production', // default mode is 'production'
};

module.exports = config;
```

---

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

---

## Sample webpack.config

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 🔑 Entry point(s)
  entry: {
    main: './src/index.js',
    admin: './src/admin.js',
  },

  // 📦 Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true, // clears old build files
  },

  // ⚡ Mode: development | production | none
  mode: 'development',

  // 🛠️ Source maps
  devtool: 'source-map',

  // 🌍 Target environment
  target: 'web',

  // 📚 Module rules (loaders)
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // CSS support
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset', // auto choose between resource/inline
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
      },
      {
        test: /\.txt$/,
        type: 'asset/source', // raw file as string
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },

  // 📦 Resolve config
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // 🔌 Plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
  ],

  // ⚙️ Optimization
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    sideEffects: true,
  },

  // 🖥️ Dev Server
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    historyApiFallback: true, // SPA routing
  },

  // 📊 Performance & logging
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000, // 500kb
    maxAssetSize: 512000,
  },
  infrastructureLogging: {
    level: 'info',
  },

  // 🔄 Cache
  cache: {
    type: 'filesystem',
  },

  // 🚧 Externals (don’t bundle react, use global React instead)
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },

  // 🧪 Experimental features
  experiments: {
    topLevelAwait: true,
  },

  // 👀 Watch mode (optional)
  watch: false,
  watchOptions: {
    ignored: /node_modules/,
  },

  // 📈 Stats output
  stats: 'normal',
};
```

---

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

---

## Loaders in Webpack?

- Loaders are `transformations that let Webpack process non-JavaScript files (like CSS, images, TypeScript, JSX, Markdown, etc.)`.
- Webpack only understands JavaScript and JSON by default.
- Loaders tell Webpack how to transform other file types into valid modules.
- So **loaders = “file transformers”** in Webpack.
- Each rule in `module.rules` defines how to handle a file type.

- Example:
  - `css-loader` → lets you import .css files into JS.
  - `babel-loader` → transpiles ES6+ JavaScript to ES5.
  - `ts-loader` → compiles TypeScript to JavaScript.

| **Property** | **Type**                | **Description**                                                          | **Example**                                      |
| ------------ | ----------------------- | ------------------------------------------------------------------------ | ------------------------------------------------ |
| `test`       | RegExp                  | Matches file extensions to apply loader                                  | `/\.css$/` → match `.css` files                  |
| `exclude`    | RegExp / Path           | Exclude certain files/folders                                            | `/node_modules/`                                 |
| `include`    | Path / Array            | Limit to specific folders                                                | `path.resolve(__dirname, "src")`                 |
| `use`        | Array / String / Object | Defines which loader(s) to use                                           | `"babel-loader"` or `[{ loader: 'css-loader' }]` |
| `loader`     | String                  | Shortcut if only one loader is used                                      | `"babel-loader"`                                 |
| `options`    | Object                  | Loader-specific options                                                  | `{ presets: ["@babel/preset-env"] }`             |
| `oneOf`      | Array of rules          | Match **first rule only** inside this array (optimization)               | Useful for mutually exclusive loaders            |
| `rules`      | Nested rules            | Apply rules recursively inside another rule                              | For complex config                               |
| `type`       | String                  | Use Webpack 5 **asset modules** (`asset/resource`, `asset/inline`, etc.) | Instead of file-loader/url-loader                |

### Examples

1. **Single Loader**

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    },
  ];
}
```

2. **Multiple Loaders (executed right → left)**

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      // css-loader runs first, then style-loader
    },
  ];
}
```

3. **Loader with Options**

```js
module: {
  rules: [
    {
      test: /\.ts$/,
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    },
  ];
}
```

4. **Conditional Rule (oneOf)**

```js
module: {
  rules: [
    {
      oneOf: [
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        { test: /\.txt$/, type: 'asset/source' },
      ],
    },
  ];
}
```

---

## babel-loader

- It’s a Webpack `loader that uses Babel to transpile modern JavaScript (ES6+, JSX, TypeScript, etc.) into older JavaScript that browsers understand`.
- It connects Webpack with Babel.

```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

### Basic babel-loader Config in Webpack

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
```

### Common Babel Presets

- Presets are `collections of plugins for common scenarios`
  | **Preset** | **Purpose** |
  | -------------------------- | ------------------------------------------------- |
  | `@babel/preset-env` | Convert modern JS → ES5, based on browser targets |
  | `@babel/preset-react` | Transpile React JSX |
  | `@babel/preset-typescript` | Transpile TypeScript |
  | `@babel/preset-flow` | Strip Flow types |

```bash
# for react
"presets": ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"]
```

### Common Babel Plugins

- Plugins handle `specific syntax/features` (can be used standalone or in addition to presets)
  | **Plugin** | **Purpose** |
  | ---------------------------------------------------- | ----------------------------------------------- |
  | `@babel/plugin-transform-runtime` | Reuse Babel helpers, reduce bundle size |
  | `@babel/plugin-proposal-class-properties` | Enable `class` fields (`class X { field = 1 }`) |
  | `@babel/plugin-proposal-object-rest-spread` | Support `{ ...obj }` spread/rest |
  | `@babel/plugin-syntax-dynamic-import` | Support `import()` syntax |
  | `@babel/plugin-transform-arrow-functions` | Convert arrow functions → ES5 |
  | `@babel/plugin-transform-async-to-generator` | Async/await → generators |
  | `@babel/plugin-proposal-optional-chaining` | Support `?.` operator |
  | `@babel/plugin-proposal-nullish-coalescing-operator` | Support `??` operator |

### webpack.config.js

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', // modern JS → ES5
              '@babel/preset-react', // JSX support
              '@babel/preset-typescript', // TypeScript support
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-transform-arrow-functions',
              '@babel/plugin-transform-async-to-generator',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
```

### Alternative: .babelrc or babel.config.json

```js
// .babelrc or babel.config.json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-async-to-generator",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
}
```

```js
//webpack.config.js
use: 'babel-loader';
```

## Note

- all major browsers have already added support for class properties.
- Nowadays this feature works out-of-the-box, and you don't have to include @babel/plugin-proposal-class-properties separately in your Webpack configuration.

---

## Plugins in Webpack?

- Plugins extend or `customize Webpack’s build process`.
- While loaders transform individual files, `plugins can affect the entire bundle or lifecycle (optimization, asset management, injection, etc.)`.
- They hook into Webpack’s compilation lifecycle.

| **Plugin**                           | **Package**                      | **Purpose**                                                  |
| ------------------------------------ | -------------------------------- | ------------------------------------------------------------ |
| **HtmlWebpackPlugin**                | `html-webpack-plugin`            | Generates `index.html` with `<script>` tags for bundles.     |
| **CleanWebpackPlugin**               | `clean-webpack-plugin`           | Cleans `/dist` folder before each build.                     |
| **MiniCssExtractPlugin**             | `mini-css-extract-plugin`        | Extracts CSS into separate `.css` files (instead of inline). |
| **DefinePlugin**                     | Built-in                         | Define environment variables (e.g., `process.env.NODE_ENV`). |
| **ProvidePlugin**                    | Built-in                         | Auto-load modules instead of importing them everywhere.      |
| **HotModuleReplacementPlugin (HMR)** | Built-in                         | Enable Hot Module Replacement during development.            |
| **ProgressPlugin**                   | Built-in                         | Show compilation progress.                                   |
| **CopyWebpackPlugin**                | `copy-webpack-plugin`            | Copy static files/folders to build output.                   |
| **CompressionWebpackPlugin**         | `compression-webpack-plugin`     | Create `.gz` compressed assets for production.               |
| **BundleAnalyzerPlugin**             | `webpack-bundle-analyzer`        | Visualize bundle contents in an interactive treemap.         |
| **TerserWebpackPlugin**              | `terser-webpack-plugin`          | Minify JavaScript (used by default in prod).                 |
| **CssMinimizerPlugin**               | `css-minimizer-webpack-plugin`   | Minify CSS files.                                            |
| **WorkboxWebpackPlugin**             | `workbox-webpack-plugin`         | Generate a service worker for PWA support.                   |
| **ForkTsCheckerWebpackPlugin**       | `fork-ts-checker-webpack-plugin` | Runs TypeScript type checking in a separate process.         |
| **ESLintWebpackPlugin**              | `eslint-webpack-plugin`          | Run ESLint on build to enforce code quality.                 |
| **FaviconsWebpackPlugin**            | `favicons-webpack-plugin`        | Generate favicons from a logo.                               |

### example

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
  },
  plugins: [
    new CleanWebpackPlugin(), // clean dist
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new BundleAnalyzerPlugin(), // visualize bundle
  ],
};
```

---

## Handlebars

- Handlebars.js is a `popular templating engine for JavaScript`.
- It lets you write `HTML templates with embedded expressions ({{ }}) that are replaced with actual data at runtime`.
- It `helps separate HTML (view) from logic (data)`.
- 👉 Think of it as a `lightweight alternative to JSX, Angular templates, or EJS`.

---

## What is mode?

- mode is a top-level configuration option in Webpack (since v4).
- It tells Webpack how to optimize the build.
- Allowed values:
  - `development`
  - `production`
  - `none`

1. **Development Mode**

- Focus: fast build, debugging support.
- Features enabled:
  - Named modules & chunks
  - Useful error messages
  - `Source maps (eval by default)`
  - `No/minimal code optimization`

```js
module.exports = {
  mode: 'development',
  devtool: 'eval-source-map', // better debugging
  devServer: {
    hot: true,
    open: true,
  },
};
```

2. **Production Mode**

- Focus: optimized, smaller bundle.
- Features enabled automatically:
  - `Minification with Terser`
  - `Tree shaking` (remove unused code)
  - `cope hoisting`
  - Module/chunk IDs optimized for caching
  - Performance hints

```js
module.exports = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js', // cache busting
  },
  optimization: {
    splitChunks: { chunks: 'all' },
    runtimeChunk: 'single',
  },
};
```

3. **None Mode**- Focus: no defaults applied.

- Behaves like a "raw" Webpack build.
- No optimizations, no dev defaults.
- You must configure everything manually.

```js
module.exports = {
  mode: 'none',
  // You must define loaders, plugins, and optimizations yourself
};
```

webpack --mode development
webpack --mode production
webpack --mode none

| Mode          | Optimizations Enabled                               | Use Case             |
| ------------- | --------------------------------------------------- | -------------------- |
| `development` | Source maps, readable output, fast rebuilds         | Coding / debugging   |
| `production`  | Minification, tree-shaking, scope hoisting, caching | Deployment           |
| `none`        | No optimizations at all                             | Custom/manual config |

---

## Webpack Dev Server?

- `Local server` for serving bundled files.
- `Auto-reload or Hot Module Replacement` (HMR) when code changes.
- Faster rebuilds using memory instead of writing to disk.
- Built-in proxying for API requests.
- 👉 It’s meant for development only (not production).

```bash
npm install --save-dev webpack-dev-server
npm webpack serve --mode development
```

```js
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devServer: {
    port: 3000, // run on http://localhost:3000
    open: true, // auto-open browser
    hot: true, // enable Hot Module Replacement
    static: {
      directory: path.join(__dirname, 'public'), // serve static files
    },
  },
};
```

| **Option**           | **Description**                                                         |
| -------------------- | ----------------------------------------------------------------------- |
| `port`               | Port number (default: `8080`).                                          |
| `host`               | Host address (default: `localhost`).                                    |
| `open`               | Auto-open browser when server starts.                                   |
| `hot`                | Enable **Hot Module Replacement** (update modules without full reload). |
| `liveReload`         | Reload the page when files change (default: true if HMR off).           |
| `static`             | Serve static files from a folder.                                       |
| `historyApiFallback` | Redirect 404s → `index.html` (useful for SPAs with React/Angular/Vue).  |
| `proxy`              | Forward API requests to a backend server.                               |
| `compress`           | Enable gzip compression.                                                |
| `https`              | Enable HTTPS server.                                                    |
| `client`             | Configure browser overlay for errors/warnings.                          |

---

## How to generate multiple html files

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'hello-world': './src/hello-world.js',
    kiwi: './src/kiwi.js',
  },
  output: {
    filename: '[name].[contenthash].js', // [name] is the key of entry point
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024,
          },
        },
      },
      {
        test: /\.txt/,
        type: 'asset/source',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.hbs$/,
        use: ['handlebars-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css', // [name] is the key of entry point
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'hello-world.html', // output file name of html file
      chunks: ['hello-world'], // same name as entry point key
      title: 'Hello world',
      description: 'some description',
      template: 'src/page-template.hbs', // reference to how to generate html file
    }),
    new HtmlWebpackPlugin({
      filename: 'kiwi.html', // output file name of html file
      chunks: ['kiwi'], // same name as entry point key
      title: 'Kiwi',
      description: 'Kiwi',
      template: 'src/page-template.hbs', // reference to how to generate html file
    }),
  ],
};
```

## Auto-generate Multiple Page [dynamically create plugin instances]

```js
const pages = ['index', 'about', 'contact'];

module.exports = {
  entry: pages.reduce((config, page) => {
    config[page] = `./src/${page}.js`;
    return config;
  }, {}),

  plugins: pages.map(
    (page) =>
      new HtmlWebpackPlugin({
        // multiple HtmlWebpackPlugin instances (one per page)
        filename: `${page}.html`,
        template: `./src/templates/${page}.html`,
        chunks: [page],
      })
  ),
};
```

## Note

- Use `multiple HtmlWebpackPlugin instances (one per page)`.
- Each page can include specific JS chunks.
- Useful for multi-page applications (like corporate sites, blogs, or dashboards)-

---

## Optimization

| Technique                         | Purpose                            |
| --------------------------------- | ---------------------------------- |
| `mode: "production"`              | Enables default optimizations      |
| Code splitting (`splitChunks`)    | Reduce bundle size, load on demand |
| Minification (JS/CSS)             | Shrinks file size                  |
| Tree shaking                      | Removes unused code                |
| Content hash                      | Better caching                     |
| Bundle analyzer                   | Analyze size & dependencies        |
| Compression (gzip/brotli)         | Smaller assets                     |
| Image optimization                | Reduce image size                  |
| Lazy loading (dynamic imports)    | Load modules only when needed      |
| Runtime chunk + deterministic IDs | Stable caching & smaller diffs     |

### 1. Code Splitting

| Method                    | When to Use                  |
| ------------------------- | ---------------------------- |
| **Multiple entry points** | Multi-page apps (MPA)        |
| **SplitChunksPlugin**     | Extract vendor & common code |
| **Dynamic import()**      | Lazy load modules on demand  |

1. **Entry Points Splitting**

```js
// Define multiple entry points (not common for SPAs, useful in MPAs).
module.exports = {
  entry: {
    home: './src/home.js',
    about: './src/about.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: __dirname + '/dist',
  },
};
```

```css
dist/
 ├── home.bundle.js
 └── about.bundle.js
```

2. **Prevent Duplication with SplitChunksPlugin**

```js
// Automatically split vendor libraries & shared code.
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all', // async, initial, or all
      minSize: 20000, // minimum size to create a chunk (20kb default)
      maxSize: 0, // no max size by default
      minChunks: 1, // must be shared at least once
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          chunks: 'all',
        },
      },
    },
  },
};
```

```css
dist/
 ├── main.js         (your app code)
 ├── vendors.js      (node_modules)
 └── commons.js      (shared code)
```

3. **Dynamic Imports (Lazy Loading)**

- Webpack `supports import() syntax for on-demand loading.`
- ✅ This will create a s`eparate math.[hash].js chunk, only loaded when button is clicked`.

```js
// index.js
document.getElementById('btn').addEventListener('click', () => {
  import('./math').then((math) => {
    console.log(math.add(2, 3));
  });
});
```
