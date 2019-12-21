import * as t from '@babel/types';
import { VisitNodeFunction } from '@babel/traverse';

export const transform: VisitNodeFunction<any, t.TaggedTemplateExpression> = (path) => {
    const { node } = path;
    const { quasi } = node;

    // const strings = [];
    // const raws = [];

    // // Flag variable to check if contents of strings and raw are equal
    // let isStringsRawEqual = true;

    // for (const elem of quasi.quasis) {
    //     const { raw, cooked } = elem.value;
    //     const value = cooked == null ? path.scope.buildUndefinedNode() : t.stringLiteral(cooked);

    //     strings.push(value);
    //     raws.push(t.stringLiteral(raw));

    //     if (raw !== cooked) {
    //         // false even if one of raw and cooked are not equal
    //         isStringsRawEqual = false;
    //     }
    // }

    const f = t.templateElement({ raw: 'test', cooked: 'test' }, true);

    const x = t.templateLiteral([f], []);

    path.replaceWith(x);
};
