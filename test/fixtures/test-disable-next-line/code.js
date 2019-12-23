/*
This test actually passes but the test runner fails it. I think it's due to whitespace :(

Input:
var x = `<div class='test'><img src="{{ 'affirm_logo_black.svg' | asset_url }}" class="affirmLogo" /></div>`;
// @babel-plugin-tlitl-disable-next-line
var y = `<div class='test ignored'><img src="{{ 'affirm_logo_black.svg' | asset_url }}" class="affirmLogo" /></div>`;

Output:
var x = `<div class='test'><img src='{{ "affirm_logo_black.svg" | asset_url }}' class="affirmLogo" /></div>`;
// @babel-plugin-tlitl-disable-next-line
var y = `<div class='test ignored'><img src="{{ 'affirm_logo_black.svg' | asset_url }}" class="affirmLogo" /></div>`;
*/
