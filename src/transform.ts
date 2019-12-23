import * as t from '@babel/types';
import { VisitNodeFunction } from '@babel/traverse';
import warning from 'tiny-warning';
import {
    hasIgnoreFileComment,
    hasDisableNextLineComment,
    findAndReplace,
    hasEndingLiquidTag,
    hasStartingLiquidTag,
    charReplace,
} from './utils';
import { MissingSingleQuoteWarnMsg } from './warnings';

type State = {
    file: {
        ast: {
            comments: Array<t.Comment>;
        };
    };
};

export const transform: VisitNodeFunction<{}, t.TemplateLiteral> = (path, state) => {
    const { node } = path;
    const { quasis } = node;

    const comments = (state as State).file.ast.comments;
    const disabledLines: { [key: number]: boolean } = {};

    if (comments.length) {
        const commentOnFirstLine = comments.find((c) => c.loc.start.line === 1);

        if (hasIgnoreFileComment(commentOnFirstLine)) {
            return;
        }

        for (let i = 0; i < comments.length; i++) {
            const c = comments[i];

            if (hasDisableNextLineComment(c)) {
                disabledLines[c.loc.start.line] = true;
            }
        }
    }

    let qIndex = 0;
    for (; qIndex < quasis.length; qIndex++) {
        const sElem = quasis[qIndex];
        const sValue = sElem.value;

        // check sElem starting line to see if it's disabled so that it's skipped
        if (sElem.loc) {
            const startingLine = sElem.loc.start.line;
            const disabledLineKey = startingLine - 1;

            const isDisabled = disabledLines[disabledLineKey];

            if (isDisabled) {
                /**
                 * this line of code is in between a disable & enable special comment
                 * so skip this current loop
                 */
                break;
            }
        }

        if (sValue.raw.length) {
            let sResult = sValue.raw;
            const sTarget = sValue.raw;

            const { hasStartingTag, startingMatch, initSCharMatchIndex } = hasStartingLiquidTag(sTarget);
            if (hasStartingTag && startingMatch) {
                const { hasEndingTag, endingMatch, initECharMatchIndex } = hasEndingLiquidTag(sTarget);

                if (hasEndingTag && endingMatch) {
                    const currentValue = sValue; // renaming this for better context
                    let finalResult = sResult; // renaming this for better context

                    /**
                     * Great, let's update the start target elem
                     */

                    // easily swap the first double quote
                    const sDoubleQuoteIndex = startingMatch.indexOf(`"`);
                    const transformedStartingTag = charReplace(startingMatch, sDoubleQuoteIndex, `'`);
                    const x1 = finalResult.replace(startingMatch, transformedStartingTag);

                    const { newStr: x2, targetIndex: sSingleQuoteIndex } = findAndReplace({
                        str: x1,
                        target: `'`,
                        replacement: `"`,
                        fromIndex: initSCharMatchIndex + startingMatch.length,
                    });

                    warning(sSingleQuoteIndex !== -1, MissingSingleQuoteWarnMsg);
                    if (sSingleQuoteIndex === -1) {
                        break; // skip this current elem since it doesnt have a single quote
                    }

                    finalResult = x2;

                    /**
                     * Finally, update the end target elem
                     */

                    // update end tag double quote
                    const eDoubleQuoteIndex = endingMatch.indexOf(`"`);
                    const transformedEndingTag = charReplace(endingMatch, eDoubleQuoteIndex, `'`);
                    finalResult = finalResult.replace(endingMatch, transformedEndingTag);

                    const { newStr: y1 } = findAndReplace({
                        str: finalResult,
                        target: `'`,
                        replacement: `"`,
                        fromIndex: sSingleQuoteIndex,
                        toIndex: initECharMatchIndex + endingMatch.length,
                    });

                    finalResult = y1;

                    currentValue.raw = finalResult;

                    if (currentValue.cooked) {
                        currentValue.cooked = finalResult;
                    }
                } else {
                    /**
                     * We need to peek the next elems to see if they contain
                     * and ending liquid tag before trying to transform
                     */
                    for (let eIndex = qIndex; eIndex < quasis.length; eIndex++) {
                        const eElem = quasis[eIndex];
                        const eValue = eElem.value;

                        if (eValue.raw.length) {
                            let eResult = eValue.raw;
                            const eTarget = eValue.raw;

                            const { hasEndingTag, endingMatch, initECharMatchIndex } = hasEndingLiquidTag(eTarget);
                            if (hasEndingTag && endingMatch) {
                                /**
                                 * Great, let's update the start target elem
                                 */

                                // swap quotes
                                const sDoubleQuoteIndex = startingMatch.indexOf(`"`);
                                const transformedStartingTag = charReplace(startingMatch, sDoubleQuoteIndex, `'`);
                                const s1 = sResult.replace(startingMatch, transformedStartingTag);

                                const { newStr: s2, targetIndex: sSingleQuoteIndex } = findAndReplace({
                                    str: s1,
                                    target: `'`,
                                    replacement: `"`,
                                    fromIndex: initSCharMatchIndex + startingMatch.length,
                                });

                                warning(sSingleQuoteIndex !== -1, MissingSingleQuoteWarnMsg);
                                if (sSingleQuoteIndex === -1) {
                                    break; // skip this current elem since it doesnt have a single quote
                                }

                                sResult = s2;
                                sValue.raw = sResult;

                                if (sValue.cooked) {
                                    sValue.cooked = sResult;
                                }

                                /**
                                 * Finally, update the end target elem
                                 */
                                const fromEIndex = endingMatch.length + initECharMatchIndex;
                                const eDoubleQuoteIndex = endingMatch.indexOf(`"`);
                                const transformedEndingTag = charReplace(endingMatch, eDoubleQuoteIndex, `'`);
                                eResult = eResult.replace(endingMatch, transformedEndingTag);

                                const { newStr: e1 } = findAndReplace({
                                    str: eResult,
                                    target: `'`,
                                    replacement: `"`,
                                    fromIndex: 0,
                                    toIndex: initECharMatchIndex,
                                });

                                eResult = e1;
                                eValue.raw = eResult;

                                if (eValue.cooked) {
                                    eValue.cooked = eResult;
                                }

                                /**
                                 * Since we are looking for an end tag,
                                 * we can actually skip elems that we
                                 * just processed so we dont have
                                 * do it again in the main loop!
                                 */
                                qIndex += 1;
                                break;
                            } else {
                                qIndex += 1;
                            }
                        }
                    }
                }
            }
        }
    }
};
