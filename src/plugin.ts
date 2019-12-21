import { PluginObj } from '@babel/core';
import { transform } from './transform';

export default function(): PluginObj {
    return {
        name: 'transform-liquid-in-template-literals',
        visitor: {
            TaggedTemplateExpression: transform,
        },
    };
}
