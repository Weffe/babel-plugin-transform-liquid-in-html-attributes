# babel-plugin-transform-liquid-in-template-literals

From:

```
<img
    src="{{ 'affirm_logo_black.svg' | asset_url }}"
    class="affirmLogo"
/>
```

To:

```
<img
    src='{{ "affirm_logo_black.svg" | asset_url }}'
    class="affirmLogo"
/>
```

## Why

This is useful if you are using [Liquid](https://shopify.github.io/liquid/) filters inside JavaScript and using Terser for minification instead of Babel's minifier.
If you don't want to keep remembering to use single quotes for html attributes to get Liquid to work inside. Then, use this plugin to take care of things for you.

### Detailed Why

What ends up happening is Terser will transform the following:

```
input:  src="{{ 'affirm_logo_black.svg' | asset_url }}"

output: src="{{ \'affirm_logo_black.svg\' | asset_url }}"

        ^^^^ Liquid will see that the value is incorrect
```

But if the code is set like so:

```
input:  src='{{ "affirm_logo_black.svg" | asset_url }}'

output: src=\'{{ "affirm_logo_black.svg" | asset_url }}\'
```

Then, Liquid can still process the value properly.
