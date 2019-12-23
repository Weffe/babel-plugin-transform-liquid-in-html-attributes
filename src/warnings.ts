export const MissingSingleQuoteWarnMsg = `Couldn't find the starting single quote after the opening liquid tag. Skipping line.

----

If you did something like this:

const liquidStuff = '...';
const myHtml = \`
    <img src="{{ \${liquidStuff} 'file.jpg' | asset_url }}" />
\`;

Then, unfortunately having a Literal Expression 
before the first single quote is not supported at the moment.

Instead, consider swapping the quotes around (single -> double & double -> single):

const liquidStuff = '...';
const myHtml = \`
    <img src='{{ \${liquidStuff} "file.jpg" | asset_url }}' />
\`;

If this doesn't apply to you, then you can ignore this warning!
You can also disable your code line to prevent this plugin from
trying to transform it so that you don't get this warning.

Example:

// @babel-plugin-tlitl-disable
const liquidStuff = '...';
const myHtml = \`
    <img src="{{ \${liquidStuff} 'file.jpg' | asset_url }}" />
\`;
// @babel-plugin-tlitl-enable
`;
