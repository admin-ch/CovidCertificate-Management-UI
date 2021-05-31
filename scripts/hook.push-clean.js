/* eslint-disable */

const execSync = require('child_process').execSync

try {
	execSync('git stash');
	execSync('npm run format');
	execSync('git commit -am "format: clean code"');
	execSync('git stash apply');
} catch (e) {}
