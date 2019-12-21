import pluginTransform from '../src/plugin';
import pluginTester from 'babel-plugin-tester';
import path from 'path';

const fixturesPath = path.resolve(__dirname, './fixtures');

pluginTester({
    plugin: pluginTransform,
    fixtures: fixturesPath,
});
