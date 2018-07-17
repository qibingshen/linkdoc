const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const util = require('util');
const ejs = require('ejs');

const MODE_0666 = parseInt('0666', 8);
const MODE_0755 = parseInt('0755', 8);


module.exports =  {

    write(file, str, mode) {
        fs.writeFileSync(file, str, { mode: mode || MODE_0666 });
        console.log('   \x1b[36mcreate\x1b[0m : ' + file)
    },
    mkdir(base, dir) {
        const loc = path.join(base, dir);
        mkdirp.sync(loc, MODE_0755);
        console.log('   \x1b[36mcreate\x1b[0m : ' + loc + path.sep);
    },
    loadTemplate(name) {
        const contents = fs.readFileSync(path.join(__dirname, '..', 'templates', (name + '.ejs')), 'utf-8');
        const locals = Object.create(null);
        
        function render() {
            return ejs.render(contents, locals)
        }

        return {
            locals: locals,
            render: render
        }
    }
}