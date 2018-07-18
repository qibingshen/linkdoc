const fs = require('fs');
const mkdirp = require('mkdirp');
const util = require('util');
const path = require('path');
const minimatch = require('minimatch');
const process = require('process');
const _ = require('lodash');

const fsHelper = require('./fsHelper');
const CONFIGURE = require('../configure');

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
function getDir(program, name) {
    const options = uniqOptions(program);
    const optionDir = {};
    options.forEach(option => {
        optionDir[option] = `${CONFIGURE.levelDir[option] || ''}${CONFIGURE.prefix[option] || ''}${name}${CONFIGURE.suffix[option] || ''}`
    });

    return optionDir;
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
    readtep(program, type, name) {
        const app = Object.create(null);
        const options = uniqOptions(program);

        options.forEach(option => {

        });

        if (program.component) {
            const component = fsHelper.loadTemplate(`${type}/component.js`);
            component.locals.name = name;
            app.component = component.render();
        }
        if (program.service) {
            const service = fsHelper.loadTemplate(`${type}/service.js`);
            service.locals.name = name;
            app.service = service.render();
        }
        if (program.style) {
            const style = fsHelper.loadTemplate(`${type}/style.scss`);
            style.locals.name = name;
            app.style = style.render();
        }
        return app
    },
    mkdirtep(app, name) {
        const cwd = process.cwd();
        fsHelper.mkdir(cwd, `/${name}`);
        const appKeys = Object.keys(app);
        appKeys.forEach(key => {
            fsHelper.mkdir(cwd, `/${name}/${key}s`)
            fsHelper.write(`${cwd}/${name}/${key}s/\$${name}.${key}.js`, app[key]);
        });
    
    }
}