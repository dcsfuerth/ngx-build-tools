import { expect } from 'chai';
import { replaceTypescriptDefaultImportsPlugin } from './rollup';

describe('rollup utils', () => {
  describe('replaceTypescriptDefaultImportsPlugin', () => {
    const subject: { transform: (code: string) => any } = replaceTypescriptDefaultImportsPlugin();

    it('replaces the * as import statements', () => {
      const result = subject.transform(`import * as foo from './bar';
import y from './y';`);
      expect(result.code).to.equal(
        `import foo from './bar';
import y from './y';`,
      );
    });

    it('leaves other import statements alone', () => {
      const code: string = `import foo from './bar';
import { y as z } from './y';`;
      const result = subject.transform(code);
      expect(result.code).to.equal(code);
    });

    it('generates a sourcemap', () => {
      const code: string = `import foo from './bar';
import { y as z } from './y';`;
      const result = subject.transform(code);
      expect(result.map.mappings).to.include('CAAC');
    });
  });
});
