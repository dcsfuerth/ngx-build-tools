#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';

import { buildPackageJsonForProduction, yargsFailFn } from './../utils/build';

const args = yargs
  .usage('$0 --source [path] --destination [path]')
  .demand('source')
  .alias('source', 's')
  .describe('source', 'Path to source package.json')
  .demand('destination')
  .alias('destination', 'd')
  .describe('destination', 'Where to write the result to')
  .fail(yargsFailFn)
  .help().argv;

buildPackageJsonForProduction(args.source, args.destination);
