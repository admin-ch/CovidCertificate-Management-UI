/* eslint-disable */

const execSync = require('child_process').execSync

try {
	execSync('git stash');
	execSync('npm run format');
	execSync('git commit -am "format: clean code"');
	execSync('npx browserslist@latest --update-db')
	execSync('npm run supportedBrowsers')
	execSync('git commit -am "Update regex for supported browsers"');
	execSync('git stash apply');
} catch (e) {}
