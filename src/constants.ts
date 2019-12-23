export const startDelimiters = [`{%`, `{{`];
export const endDelimiters = [`%}`, `}}`];

export const ignoreFilePattern = new RegExp(String.raw`\s*@babel-plugin-tlitl-ignore-file\s*`, 'i');
export const disableNextLinePattern = new RegExp(String.raw`\s*@babel-plugin-tlitl-disable-next-line\s*`, 'i');
