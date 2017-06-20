import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as rimraf from 'rimraf';

import {
  isCodeChange,
  buildPackageJsonForProduction,
  inlineNgTemplates
} from './build';

describe('build', () => {
  it('runs the test suite', () => {
    expect(42).to.equal(42);
  });

  describe('isCodeChange', () => {
    it('returns true for files ending with .ts', () => {
      expect(isCodeChange('src/foo/foo.component.ts')).to.be.true;
    });

    it('returns true for files ending with .js', () => {
      expect(isCodeChange('foo.js')).to.be.true;
    });

    it('returns false for files ending with .html', () => {
      expect(isCodeChange('foo.component.html')).to.be.false;
    });

    it('returns false for files ending with .css', () => {
      expect(isCodeChange('foo.component.css')).to.be.false;
    });
  });

  describe('buildPackageJsonForProduction', () => {
    let testDirectory: string;
    let subject: any;

    beforeEach(() => {
      testDirectory = fs.mkdtempSync('build-spec');
      const destinationFile: string = `${testDirectory}/package.json`;

      buildPackageJsonForProduction('package.json', destinationFile);
      subject = require('../../' + destinationFile);
    });

    afterEach(() => {
      rimraf.sync(testDirectory);
    });

    it('removes devDependencies', () => {
      expect(subject.devDependencies).to.be.undefined;
    });

    it('removes scripts', () => {
      expect(subject.scripts).to.be.undefined;
    });

    it('removes private', () => {
      expect(subject.private).to.be.undefined;
    });

    it('keeps dependencies', () => {
      expect(subject.dependencies).to.not.be.undefined;
    });

    it('keeps name', () => {
      expect(subject.name).to.equal('@dcs/ngx-build-tools');
    });
  });

  describe('inlineNgTemplates', () => {
    let testDirectory: string;
    let subject: string;

    beforeEach(done => {
      testDirectory = fs.mkdtempSync('build-spec');
      fs.copySync(path.resolve(`${__dirname}/../../fixtures/`), testDirectory);
      inlineNgTemplates(`./${testDirectory}/*.component.ts`).then(() => {
        subject = fs
          .readFileSync(`./${testDirectory}/foo.component.ts`)
          .toString();
        done();
      });
    });

    afterEach(() => {
      rimraf.sync(testDirectory);
    });

    it('replaces templateUrl with the template content', () => {
      expect(subject).to.include(`template: '<div>Hello World!!!</div>'`);
    });

    it('replaces styleUrls with the css content', () => {
      expect(subject).to.include(
        `styles: ['div{background-color:#CCC;border:1px solid #333}']`
      );
    });
  });
});
