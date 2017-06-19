#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';
import * as chokidar from 'chokidar';

import { buildFactory, IRollupConfig, yargsFailFn } from './../utils/build';

const args = yargs
  .usage('$0 --config [rollup config path] --target [watch dir]')
  .demand(['config', 'target'])
  .demand('config')
  .alias('config', 'c')
  .describe('config', 'Rollup config file')
  .demand('target')
  .alias('target', 't')
  .describe('target', 'Directory to watch for changes')
  .describe(
    'cache',
    'use the rollup caching mechanism (breaks with some plugins)'
  )
  .default('ignored', '(^|[\\/\\\\])\\..')
  .alias('ignored', 'i')
  .describe('ignored', 'regex to exclude files to watch')
  .fail(yargsFailFn)
  .help().argv;

const configFile = args.config;
const watchTarget: string = args.target;
const ignored: RegExp = new RegExp(args.ignored);
const doCache: boolean = args.cache;

const config: IRollupConfig = require(path.resolve(configFile));
const builder = buildFactory(config, doCache);

const options = {
  ignoreInitial: true,
  ignored
};

chokidar.watch(watchTarget, options).on('ready', builder).on('all', builder);
