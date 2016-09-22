var Home = require('./pages/home');
var Example = require('./pages/example');

if (typeof global === 'undefined') {
    global = {};
}
if (typeof global.PAGES === 'undefined') {
    global.PAGES = {};
}
if (typeof global.SERVICE === 'undefined') {
    global.SERVICE = {};
}

global.PAGES.Home = Home;
global.PAGES.Example = Example;

export default global;
