import React from 'react';
import ReactDOM from 'react-dom';

if (typeof window === 'undefined') {
    window = {};
}
if (typeof global === 'undefined') {
    global = {};
}
if (typeof global.PAGES === 'undefined') {
    global.PAGES = {};
}

var Page = require('${page}.js');

window.React = React;
window.ReactDom = ReactDOM;

//this method will called by client only
window.renderClient = function (params) {
    ReactDOM.render(React.createElement(Page, params), document.getElementById('main'));
};
