[![npm](https://img.shields.io/npm/v/@dcs/ngx-build-tools.svg)](https://www.npmjs.com/package/@dcs/ngx-build-tools)
[![Build Status](https://travis-ci.org/dcsfuerth/ngx-build-tools.svg?branch=master)](https://travis-ci.org/dcsfuerth/ngx-build-tools)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# @dcs/ngx-build-tools

Some command line tools to aid in developing angular library npm packages.

## Install

```sh
npm install --save-dev @dcs/ngx-build-tools
```

Then use the commands in your build process (like package.json scripts).

## CLI

### ngx-build-watch

This command watches for changes in the specified target directory (all files not just .ts), inlines templates and styles into angular components and does an (incremental) rollup build:

```sh
ngx-build-watch --config rollup.config.js --target ./src
```

### ngx-build-package-json

This command takes the development package.json (with devDependencies, scripts ...) and builds a production one for the build directory.

```sh
ngx-build-package-json --source package.json --destination build/paclage.json
```

### ngx-inline-styles

This command inlines all templates and styles of angular components in a specified directory, compiling sass and adding postcss transformations.

```sh
ngx-inline-styles --cssGlob 'src/**/*.component.scss --componentsGlob 'src/**/*.component.ts' --postcssConfig my-postcss.config.js
```
