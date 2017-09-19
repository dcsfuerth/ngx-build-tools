import * as MagicString from 'magic-string';

export interface IReplaceTypescriptDefaultImportsPluginOptions {
  regexp?: RegExp;
}

export function replaceTypescriptDefaultImportsPlugin(
  options: IReplaceTypescriptDefaultImportsPluginOptions = {},
) {
  return {
    transform(code: string) {
      const magicString = new MagicString(code);
      let match: any;
      let hasUpdate = false;

      const importRegex = options.regexp || /import\s+(\*\s+as\s(\w+))\s+from\s+'.*?'/g;

      // tslint:disable-next-line:no-conditional-assignment
      while ((match = importRegex.exec(code)) !== null) {
        hasUpdate = true;

        const start = match.index;
        const end = start + match[0].length;
        const replacement = code.substring(start, end).replace(match[1], match[2]);

        magicString.overwrite(start, end, replacement);
      }

      code = magicString.toString();
      const map = magicString.generateMap({ hires: true, includeContent: true });

      return {
        code,
        map,
      };
    },
  };
}
