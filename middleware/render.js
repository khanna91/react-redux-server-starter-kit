var Util = require('../common/util/util');
import global from '../src/app-server.js';

module.exports = function render(pageName, props) {

    return function (req, res, next) {

        if (res.getProp('error') === true) {
            next();
            return;
        }

        if (Util.isUndefinedOrNullOrEmpty(pageName) || typeof pageName != 'string'){
            console.error('pageName is empty or not correct');
            res.setProp('error', true);
            next();
            return;
        }

        var page = global.PAGES[pageName];

        var response = Util.checkIfValidPage(page);

        if (!response.isValid) {
            console.error(response.message);
            res.setProp('error', true);
            next();
            return;
        }

        res.setProps(props);
        res.renderNow(page);
    }
};
