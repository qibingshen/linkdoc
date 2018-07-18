const fs = require('fs');
const mkdirp = require('mkdirp');
const util = require('util');
const path = require('path');
const minimatch = require('minimatch');
const process = require('process');
const _ = require('lodash');

const fsHelper = require('./fsHelper');
const CONFIGURE = require('../configure');

const cwd = process.cwd();
const TEMPLATE_DIR = path.join(__dirname, '..', 'templates'); 

// 合并输入的option
function uniqOptions(program) {
    let options = [];
    CONFIGURE.options.forEach(item => {

        if (program[item]) {
            options = _.concat(options, CONFIGURE.buildconf[item]);
        }
    });
    return options;
}

// 获取配置的路径
function getFilename(program, name) {
    const options = uniqOptions(program);
    const filenames = {};
    options.forEach(option => {
        filenames[option] = `${CONFIGURE.prefix[option] || ''}${name}${CONFIGURE.suffix[option] || ''}`
    });

    return filenames;
}

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
    },
    readtep(type, program, name) {
        const app = Object.create(null);
        const filenames = getFilename(program, name);
        const options = Object.keys(filenames);

        options.forEach(option => {
            const tepEJs = fsHelper.loadTemplate(`${type}/${option}`);
            tepEJs.locals.name = name;
            app[option] = {};
            app[option].file = tepEJs.render();
            app[option].filename = filenames[option];
        });
        return app
    },
    mkdirtep(app, name) {
        
        const appKeys = Object.keys(app);
        appKeys.forEach(key => {
            const dir = `${name}/${CONFIGURE.levelDir[key] || ''}`;
            fsHelper.mkdir(cwd, dir);
            fsHelper.write(`${cwd}/${dir}/${app[key].filename}`, app[key].file);
        });
    }
}