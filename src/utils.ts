import * as t from '@babel/types';
import { startDelimiters, endDelimiters, ignoreFilePattern, disableNextLinePattern } from './constants';

export function hasStartingLiquidTag(str: string) {
    const delimStr = `${startDelimiters.join('|')}`;
    const pattern = new RegExp(String.raw`\"\s*(?:${delimStr})`, 'i');
    const result = pattern.exec(str);

    let match: string = '';
    let hasStartingTag = false;
    if (result) {
        const filteredResults = result.filter(Boolean);

        if (filteredResults.length) {
            match = filteredResults[0];
            hasStartingTag = true;
        }
    }

    return {
        hasStartingTag,
        startingMatch: match,
        initSCharMatchIndex: result?.index ?? -1,
    };
}

export function hasEndingLiquidTag(str: string) {
    const delimStr = `${endDelimiters.join('|')}`;
    const pattern = new RegExp(String.raw`(?:${delimStr})\s*\"`, 'i');
    const result = pattern.exec(str);

    let match: string = '';
    let hasEndingTag = false;
    if (result) {
        const filteredResults = result.filter(Boolean);

        if (filteredResults.length) {
            match = filteredResults[0];
            hasEndingTag = true;
        }
    }

    return {
        hasEndingTag,
        endingMatch: match,
        initECharMatchIndex: result?.index ?? -1,
    };
}

type FindReplace = { str: string; target: string; replacement: string; fromIndex: number; toIndex?: number };

export function findAndReplace({ str, target, replacement, fromIndex, toIndex }: FindReplace) {
    const strToReplace = str.slice(fromIndex, toIndex === undefined ? str.length : toIndex);
    let targetIndex = strToReplace.indexOf(target);
    targetIndex = targetIndex !== -1 ? fromIndex + targetIndex : -1;
    const newStrPart = strToReplace.replace(target, replacement);

    const newStr = str.replace(strToReplace, newStrPart);

    return { newStr, targetIndex };
}

export function charReplace(str: string, index: number, replacement: string) {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

export function hasIgnoreFileComment(comment: t.Comment | undefined) {
    return ignoreFilePattern.test(comment?.value ?? '');
}

export function hasDisableNextLineComment(comment: t.Comment | undefined) {
    return disableNextLinePattern.test(comment?.value ?? '');
}
