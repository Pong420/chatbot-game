/**
 * use for resolve paths in locale files
 */

const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

tsConfigPaths.register({
  baseUrl: __dirname,
  paths: tsConfig.compilerOptions.paths
});
