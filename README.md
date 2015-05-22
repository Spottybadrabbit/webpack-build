webpack-wrapper
===============

[![Build Status](https://travis-ci.org/markfinger/webpack-wrapper.svg?branch=master)](https://travis-ci.org/markfinger/webpack-wrapper)
[![Dependency Status](https://david-dm.org/markfinger/webpack-wrapper.svg)](https://david-dm.org/markfinger/webpack-wrapper)
[![devDependency Status](https://david-dm.org/markfinger/webpack-wrapper/dev-status.svg)](https://david-dm.org/markfinger/webpack-wrapper#info=devDependencies)

A wrapper around webpack's API which provides a simpler interface with a variety of optimisations
and utilities typically required for a build process.

Provides:
- Change detection for your config files
- Toggleable source file watching
- File-based caching of compilation output, which massively reduces the initial build time
- Optimisation of the background compilation performed by webpack's watcher. It initially writes assets 
  to memory and emitting them to disk when required
- Pre-processessing of the compilation output so that it can be easily passed between processes
- A config helper to map your bundle's output path to a particular directory
- Directly exposed paths from the entry files to the generated assets


Installation
------------

```bash
npm install webpack webpack-wrapper
```

Usage
-----

```javascript
var webpack = require('webpack-wrapper');

webpack({
  // An absolute path to a webpack config file.
  config: '/path/to/webpack.config.js',
  
  // The following options are the default values...
  
  // Indicates that webpack should watch the source files for changes 
  // and rebuild in the background
  watch: false,
  
  // The delay between a change being detected and webpack starting 
  // the rebuild process
  aggregateTimeout: 200,
  
  // Indicates if the watcher should poll for changes, rather than 
  // relying on the OS for notifications
  poll: undefined,
  
  // Indicates that the config file should be watched for changes. 
  // Any changes will cause webpack to completely rebuild the bundle
  watchConfig: false,
  
  // An absolute path to a file that will be used to store compilation 
  // output
  cacheFile: null,
  
  // The maximum time that compilation output will be stored for
  cacheTTL: 1000 * 60 * 60 * 24 * 30, // 30 days
  
  // Indicates that webpack's watcher should emit rebuilt files to 
  // memory until they are required to be on disk
  useMemoryFS: true
  
  // If defined, a config's `output.path` prop will have any
  // `[bundle_dir]` substrings replaced with the value of `bundleDir`
  bundleDir: null,
}), function(err, stats) {
  // Besides the usual stats data produced by webpack, the wrapper adds 
  // some extra props...
  
  // The generated config object used by webpack
  stats.webpackConfig
  
  // An object mapping asset names to the full path of the generated asset
  stats.pathsToAssets
});
```

Caching
-------

When a request comes in and the compilation output has been cached from a previous build, the 
following actions will be performed:
- the modified time for the config file is compared to the compilation's start time
- the modified time for every file dependency is compared to the compilation's start time

If any of the above actions produce errors or the modified times are later than the compilation's
start time, the cached output will be ignored and the wrapper will wait for webpack to complete.

If webpack is watching the source files, the compilation output will only be used until the build
has completed and/or the above conditions still pass.
