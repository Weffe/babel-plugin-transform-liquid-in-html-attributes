import * as t from '@babel/types';
import { VisitNodeFunction } from '@babel/traverse';
import { containsLiquid, getDoubleQuoteMatches } from './utils';

export const transform: VisitNodeFunction<any, t.TemplateLiteral> = (path) => {
    const { node } = path;
    const { quasis } = node;

    for (const elem of quasis) {
        const { value } = elem;

        if (value.raw.length) {
            let resultStr = value.raw;
            const matches = getDoubleQuoteMatches(value.raw);

            if (matches) {
                let shouldBeReplace = false;

                matches.forEach((match) => {
                    if (containsLiquid(match)) {
                        const doubleToNothing = match.replace(/\"/g, '');
                        const singleToDouble = doubleToNothing.replace(/\'/g, `"`);
                        const transformedStr = `'${singleToDouble}'`;

                        shouldBeReplace = true;
                        resultStr = resultStr.replace(match, transformedStr);
                    }
                });

                // prevent unneccessary replacements
                if (shouldBeReplace) {
                    value.raw = resultStr;
                }
            }
        }
    }
};
