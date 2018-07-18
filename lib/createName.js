// 生成规则配置
const _ = require('lodash');
const CONFIGURE = require('../configure');

function render(program, name) {
    // 合并规则为所有数组合并
    let options = [],
        optionDir = {};

    CONFIGURE.options.forEach(item => {
        if (program[item]) {
            options = _.concat(options, CONFIGURE.buildconf[item]);
        }
    });
    options.forEach(option => {
        optionDir[option] = `${CONFIGURE.levelDir[option] || ''}${CONFIGURE.prefix[option] || ''}${name}${CONFIGURE.suffix[option] || ''}`
    });

    return optionDir;
}

module.exports = {
    render: render,
}