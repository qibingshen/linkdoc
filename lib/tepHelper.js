const fs = require('fs');
const mkdirp = require('mkdirp');
const util = require('util');
const path = require('path');
const minimatch = require('minimatch');
const process = require('process');

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
    },
    readtep(program, type, name) {
        const app = Object.create(null);
        if (program.component) {
            const component = fsHelper.loadTemplate(`${type}/component.js`);
            component.locals.name = name;
            app.component = component.render();
        }
        if (program.service) {
            const service = fsHelper.loadTemplate(`${type}/$service.js`);
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