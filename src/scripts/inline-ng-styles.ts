#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';

import { compileCss, yargsFailFn, inlineNgTemplates } from './../utils/build';

const args = yargs
  .usage(
    '$0 --cssGlob [glob pattern] --componentsGlob [glob pattern] --postcssConfig [path]'
  )
  .demand('cssGlob')
  .describe('cssGlob', 'Glob pattern to all (s)css files')
  .demand('componentsGlob')
  .describe('componentsGlob', 'Glob pattern to all ngx component files')
  .demand('postcssConfig')
  .describe('postcssConfig', 'Path to postcss config')
  .fail(yargsFailFn)
  .help().argv;

compileCss(args.cssGlob, args.postcssConfig);
inlineNgTemplates(args.componentsGlob);
