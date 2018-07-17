const fs = require('fs');
const mkdirp = require('mkdirp');
const util = require('util');
const path = require('path');
const minimatch = require('minimatch');

const fsHelper = require('./fsHelper');

const TEMPLATE_DIR = path.join(__dirname, '..', 'templates'); 

module.exports = {
    copyTemplateMulti(fromDir, toDir, nameGlob) {
        fs.readdirSync(path.join(TEMPLATE_DIR, fromDir))
            .filter(minimatch.filter(nameGlob, {matchBase: true}))
            .forEach(name => {
                this.copyTemplate(path.join(fromDir, name), path.join(toDir, name))
            });
    },
    copyTemplate(from, to) {
        fsHelper.write(to, from);
    }
}