import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as postcss from 'postcss';
import * as sass from 'node-sass';
import * as yargs from 'yargs';
import * as PrettyError from 'pretty-error';
import { rollup } from 'rollup';
import { Bundle, Options, Format } from '@types/rollup';

const ng2Inline = require('angular2-inline-template-style');


export interface RollupConfig extends Options {
  dest: string;
  format?: Format;
}

export function buildFactory(rollupConfig: RollupConfig, doCache: boolean = false) {
  let rollupCache: Bundle | undefined;
  const pe = new PrettyError();

  return function buildBundle(eventType?: string, filename?: string) {
    // cache only for code files (.js and .ts hardcoded at the moment)
    // as the inlining of html/css plugin is buggy respective to cache
    // see https://github.com/cebor/rollup-plugin-angular/issues/34
    if (doCache && isCodeChange(filename)) {
      rollupConfig = Object.assign({}, rollupConfig, { cache: rollupCache });
    }

    console.time(`Build time ${rollupConfig.entry}`);

    rollup(rollupConfig)
      .then(bundle => {
        let result = bundle.generate({
          format: rollupConfig.format,
        });

        rollupCache = bundle;

        bundle.write({
          format: rollupConfig.format,
          dest: rollupConfig.dest
        }).then(() => {
          console.log('\n\x1b[32m%s\x1b[0m', 'Successful build!');
          console.timeEnd(`Build time ${rollupConfig.entry}`);
        });
      })
      .catch(error => {
        rollupCache = undefined;
        console.log(pe.render(error));
      });
  }
}

export function isCodeChange(filename?: string): boolean {
  return (!!filename && (filename.endsWith('.js') || filename.endsWith('.ts') ));
}

export function buildPackageJsonForProduction(pathToSource: string, destination: string) {
  const pjs = require(path.resolve(pathToSource));

  delete pjs.devDependencies;
  delete pjs.scripts;
  delete pjs.private;

  fs.writeFileSync(destination, JSON.stringify(pjs, undefined, 2));
}

export function compileCss(globPattern: string, pathToPostcssConfig: string) {
  const postcssConfig = require(path.resolve(pathToPostcssConfig));

  let scssFiles = glob.sync(globPattern, {});

  scssFiles.forEach((filename: string) => {
    let scss = fs.readFileSync(filename, 'utf-8');
    let css = sass
      .renderSync({ data: scss, outputStyle: 'compressed' })
      .css
      .toString()
      // remove linebreak at the end
      .replace(/^\s+|\s+$/g, '');
    css = postcss(postcssConfig).process(css).css;

    fs.writeFileSync(filename, css, 'utf-8');
  });
}

export function inlineNgTemplates(globPattern: string) {
  let components = glob.sync(globPattern, {});

  components.forEach(filename => {
    let dirname = path.dirname(filename);

    let component = fs.readFileSync(filename, 'utf-8');
    component = ng2Inline(component, { base: dirname, compress: true }).then((content: Buffer) => {
      fs.writeFileSync(filename, content, 'utf-8');
    });

  });
}

// thanks wrong typings
export const yargsFailFn: any = function (msg: string, err: Error, args: yargs.Argv) {
  console.error('');
  console.error('Error: ', msg);
  console.error('');
  console.error('Usage:', args.help());
  process.exit(1);
};
