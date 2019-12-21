export function getDoubleQuoteMatches(str: string) {
    return str.match(/(\")(\s*)(.*?)(\s*)(\")/gi);
}

export function containsLiquid(str: string) {
    const startDelimiters = [`{%`, `{{`];
    const endDelimiters = [`%}`, `}}`];
    const startDelimRegex = `(${startDelimiters.join('|')})`;
    const endDelimRegex = `(${endDelimiters.join('|')})`;

    const re = startDelimRegex + '(s*)(.*?)(s*)' + endDelimRegex;
    const pattern = new RegExp(re, 'gi');

    const matches = str.match(pattern);

    if (matches) {
        // remove empty strings
        const filtered = matches.filter(Boolean);

        return filtered.length > 0;
    }
    return false;
}
