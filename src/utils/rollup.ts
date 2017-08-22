export interface IReplaceTypescriptDefaultImportsPluginOptions {
  regexp?: RegExp;
}

export function replaceTypescriptDefaultImportsPlugin(
  options: IReplaceTypescriptDefaultImportsPluginOptions = {}
) {
  return {
    transform(code: string, id: string) {
      const importRegex =
        options.regexp || /import\s+\*\s+as\s(\w+)\s+from\s+('.*?')/g;
      code = code.replace(importRegex, 'import $1 from $2');

      return {
        code,
        map: { mappings: '' }
      };
    }
  };
}
