var React = require('react');
var Util = require('../common/util/util');
var ReactDOMServer = require('react-dom/server');

module.exports = function (req, res, next) {

    (function init() {
        res.locals['props'] = {'pageInfo': {}};
        res.locals['links'] = [];
    }());

    res.safeStringify = function (obj, pretty) {
        var jsonString;
        if (obj instanceof Set) {
            if (pretty) {
                jsonString = JSON.stringify(Array.from(obj), null, 4);
            } else {
                jsonString = JSON.stringify(Array.from(obj));
            }
        } else {
            if (pretty) {
                jsonString = JSON.stringify(obj, null, 4);
            } else {
                jsonString = JSON.stringify(obj);
            }
        }

        return jsonString;
    };

    res.setSeoInfo = function (seoInfo) {
        this.setTitle(seoInfo.pageTitle);
        this.setMetaKeywords(seoInfo.metaKeywords);
        this.setMetaDescription(seoInfo.metaDescription)
    };

    res.setTitle = function (title) {
        this.setTemplateOnlyProp('pageTitle', title, false);
    };

    res.setMetaDescription = function (description) {
        this.setTemplateOnlyProp('metaDescription', description);
    };

    res.setMetaKeywords = function (keywords) {
        this.setTemplateOnlyProp('metaKeywords', keywords);
    };

    res.getSeoInfo = function () {
        return {
            pageTitle: this.getTitle(),
            metaKeywords: this.getMetaKeywords(),
            metaDescription: this.getMetaDescription()
        }
    };

    res.getTitle = function () {
        return this.getTemplateOnlyProp('pageTitle', false);
    };

    res.getMetaDescription = function () {
        return this.getTemplateOnlyProp('metaDescription');
    };

    res.getMetaKeywords = function () {
        return this.getTemplateOnlyProp('metaKeywords');
    };

    // by default retargeting is false
    res.isRetargetingRequired = function (required) {
        this.setTemplateOnlyProp('retargeting', required, false);
    };

    // by default isSmoothScroll is false
    res.isSmoothScrollRequired = function (required) {
        this.setTemplateOnlyProp('isSmoothScroll', required, false);
    };

    // by default GoogleFontQuery will be blank, that will result in no retargeting code in ejs
    res.setGoogleFontUrlQuery = function (query) {
        if (!Util.isUndefinedOrNullOrEmpty(query)) {
            this.addCssLink('https://fonts.googleapis.com/css?' + query);
        }
    };

    res.setProp = function (key, value) {

        if (Util.isUndefinedOrNullOrEmpty(key)) {
            throwError('\'key\' is required for setting a prop.');
        }

        if (Util.isUndefinedOrNullOrEmptyObject(res.locals.props)) {
            res.locals.props = {};
        }

        if (typeof value == 'undefined') {
            this.deleteProp(key);
            return;
        }

        res.locals.props[key] = value;
    };

    res.setProps = function (props) {
        for (var key in props) {
            if (!props.hasOwnProperty(key)) { continue; }
            this.setProp(key, props[key]);
        }
    };

    res.getProp = function (key) {

        if (Util.isUndefinedOrNull(key)) {
            throwError('\'key\' is required for getting a prop.');
        }

        var value = res.locals.props[key];

        if (Util.isUndefinedOrNullOrEmptyObject(value)) {
            value = null;
        }

        return value;
    };

    res.getProps = function () {
        return res.locals.props;
    };

    res.deleteProp = function (key) {
        delete res.locals.props[key];
    };

    //default value for isStringifyRequired is true
    res.setTemplateOnlyProp = function (key, value, isStringifyRequired) {

        if (Util.isUndefinedOrNullOrEmpty(key)) {
            throwError('\'key\' is required for setting server only.');
        }

        if (typeof value == 'undefined') {
            this.deleteTemplateOnlyProp(key);
            return;
        }

        if (Util.isUndefinedOrNullOrEmpty(isStringifyRequired)) {
            isStringifyRequired = true;
        }

        res.locals[key] = isStringifyRequired ? this.safeStringify(value) : value;
    };

    //default value for isParsingRequired is true
    res.getTemplateOnlyProp = function (key, isParsingRequired) {

        if (Util.isUndefinedOrNullOrEmpty(key)) {
            throwError('\'key\' is required for getting server only value.');
        }

        var value = res.locals[key];

        if (Util.isUndefinedOrNullOrEmptyObject(value)) {
            value = null;
        } else {

            if (Util.isUndefinedOrNullOrEmpty(isParsingRequired)) {
                isParsingRequired = true;
            }

            if (isParsingRequired) {

                try {
                    value = JSON.parse(value);
                } catch (e) {}

            }
        }

        return value;
    };

    res.getTemplateOnlyProps = function () {

        var copy = {};

        for (var key in res.locals) {
            if (key != 'props') {
                copy[key] = this.getTemplateOnlyProp(key);
            }
        }

        return copy;
    };

    res.deleteTemplateOnlyProp = function (key) {
        delete res.locals[key];
    };

    res.addEntryInServerOnlyProp = function (key, entry) {

        if (Util.isUndefinedOrNullOrEmpty(key)) {
            throwError('\'key\' is required for adding server only value.');
        }

        var value = this.getTemplateOnlyProp(key);

        if (Util.isUndefinedOrNull(value)) {
            value = {};
        }

        value[entry.key] = entry.value;

        this.setTemplateOnlyProp(key, value);
    };

    res.addEntryInProp = function (key, entry) {
        if (Util.isUndefinedOrNullOrEmpty(key)) {
            throwError('\'key\' is required for adding prop.');
        }

        var value = this.getProp(key);
        if (Util.isUndefinedOrNull(value)) {
            value = {};
        }
        value[entry.key] = entry.value;

        this.setProp(key, value);
    };

    //head link start

    res.isValidHeadLink = function (linkObject) {
        if (Util.isUndefinedOrNullOrEmptyObject(linkObject)) {
            return {result: false, message: '\'linkObject\' is required while a setting header link.'};
        }

        if (typeof linkObject != 'object') {
            return {result: false, message: '\'linkObject\' is should be a valid object type.'};
        }

        if (Util.isUndefinedOrNullOrEmpty(linkObject.relevance)
            || typeof linkObject.relevance != 'string'
            || Util.isUndefinedOrNullOrEmpty(linkObject.type)
            || typeof linkObject.type != 'string'
            || Util.isUndefinedOrNullOrEmpty(linkObject.href)
            || typeof linkObject.href != 'string') {
            return {result: false, message: '\'linkObject\' is should have non empty string type of relevance, type and href keys.'};
        }

        return {result: true};
    };

    res.addHeadLink = function (linkObject) {

        var currentLinks = this.getTemplateOnlyProp('links', false);

        if (Util.isUndefinedOrNull(currentLinks)) {
            currentLinks = new Array();
        }

        if (linkObject instanceof Array || linkObject instanceof Set) {

            var _this = this;
            linkObject.forEach(function (link) {

                var result = _this.isValidHeadLink(link);

                if (!result.result) {
                    throwError(result.message);
                }

                currentLinks.push(link);

            });

        } else {

            var result = this.isValidHeadLink(linkObject);

            if (!result.result) {
                throwError(result.message);
            }

            currentLinks.push(linkObject);
        }

        this.setTemplateOnlyProp('links', currentLinks, false);

    };

    //res.removeHeadLink = function (linkObject) {
    //
    //    var result = this.isValidHeadLink(linkObject);
    //
    //    if (!result.result) {
    //        throwError(result.message);
    //    }
    //
    //    var currentLinks = this.getTemplateOnlyProp('links', false);
    //
    //    if (Util.isUndefinedOrNull(currentLinks)) {
    //        currentLinks = new Set();
    //    }
    //
    //    if (linkObject instanceof Array || linkObject instanceof Set) {
    //
    //        linkObject.forEach(function (link) {
    //
    //            var result = this.isValidHeadLink(link);
    //
    //            if (!result.result) {
    //                throwError(result.message);
    //            }
    //
    //            currentLinks.delete(link);
    //
    //        });
    //
    //    } else {
    //        var result = this.isValidHeadLink(linkObject);
    //
    //        if (!result.result) {
    //            throwError(result.message);
    //        }
    //
    //
    //        currentLinks.delete(linkObject);
    //
    //    }
    //
    //    this.setTemplateOnlyProp('links', currentLinks, false);
    //
    //};

    res.getHeadLinks = function () {
        return this.getTemplateOnlyProp('links', false);
    };

    //head link end

    //cssLinks start
    res.addCssLink = function (cssUrl) {

        if (Util.isUndefinedOrNullOrEmptyObject(cssUrl)) {
            throw "'cssUrl' should be a valid string or array/set of valid string";
        }

        if (cssUrl instanceof Array || cssUrl instanceof Set) {

            var _this = this;
            cssUrl.forEach(function (url) {
                _this.addHeadLink({
                    relevance: 'stylesheet',
                    type: 'text/css',
                    href: url
                });
            });

        } else {
            this.addHeadLink({
                relevance: 'stylesheet',
                type: 'text/css',
                href: cssUrl
            });
        }
    };

    res.removeCssLink = function (cssUrl) {
        this.removeHeadLink({
            relevance: 'stylesheet',
            type: 'text/css',
            href: cssUrl
        });
    };

    res.getCssLinks = function () {
        var allLinks = this.getHeadLinks();

        var allCssLinks = new Array();
        allLinks.forEach(function (link) {
            if (link.relevance === 'stylesheet' && link.type === 'text/css') {
                allCssLinks.push(link);
            }
        });

        return allCssLinks;
    };

    //cssLinks end

    res.deleteRequestHeader = function (key) {

        var headers = this.getTemplateOnlyProp('headers');
        if (!Util.isUndefinedOrNull(headers[key])) {
            delete headers[key];
            this.setTemplateOnlyProp('headers', headers);
        }

    };

    res.addRequestHeader = function (key, value) {

        if (Util.isUndefinedOrNullOrEmpty(key)) {
            throwError('\'key\' is required while a setting header value.');
        }

        if (typeof value == 'undefined' || value === null) {
            this.deleteRequestHeader(key);
            return;
        }

        this.addEntryInServerOnlyProp('headers', {key: key, value: value});
    };

    res.getRequestHeaders = function () {
        return this.getTemplateOnlyProp('headers');
    };

    res.getRequestHeader = function (key) {

        if (Util.isUndefinedOrNullOrEmpty(key)) {
            throwError('\'key\' is required while a getting header value.');
        }

        var headers = this.getRequestHeaders();

        var value  = headers[key];

        if (Util.isUndefinedOrNull(value)) {
            value = null
        }

        return value;
    };

    res.addPageInfo = function (key, value) {

        if (Util.isUndefinedOrNullOrEmpty(key)) {
            throwError('\'key\' is required while a setting pageInfo value.');
        }

        if (typeof value == 'undefined') {
            value = null
            //throwError('\'value\' is required while a setting as pageInfo.');
        }

        this.addEntryInProp('pageInfo', {key: key, value: value});
    };

    res.getAllPageInfo = function () {
        return this.getProp('pageInfo');
    };

    res.getPageInfo = function (key) {

        if (Util.isUndefinedOrNullOrEmpty(key)) {
            throwError('\'key\' is required while a getting pageInfo value.');
        }

        var pageInfo = this.getAllPageInfo();

        var value  = pageInfo[key];

        if (Util.isUndefinedOrNull(value)) {
            value = null
        }

        return value;
    };

    /*
     page = 'top level react component, i.e. from pages' (will use default template, and a valid name should be set in component)
        For component "abc-efg.jsx", name should be "abc-efg".

     OR

     page = {
     template: 'ejs template name', (required = false, default = 'template')
     component: 'top level react component, i.e. from pages', (required = true),
     client: 'client js file name for supplied page. it should Without "-client.js suffix"' (required = true)
     }
     * */
    // withRetargeting, googleFontQuery and smoothScrolling flags will only work if you are not supplying your own template
    res.renderNow = function (page) {
        
        if (Util.isUndefinedOrNullOrEmptyObject(page)) {
            throwError('A valid Page object is required for rendering.');
        }

        var component;

        // By default page.template will be "template.ejs"
        // And we recommend you to use default implementation. or you can give your own template file name.
        var template = 'index';

        // By default page.client will be inferred from a component name.
        // Assigning a displayName to every component is must and with following name formula.
        // For component "abc-efg.jsx", name should be "abc-efg".
        // We recommend you to use default implementation.
        // Still you can give your own client js name. (in this case you need to add a new entry in related webpack task, like you were doing previously).
        var client;

        // it will true if page is directly a react component
        if (typeof page != 'function') {

            if (Util.isUndefinedOrNull(page.component)) {
                throwError('A valid Page object is required for rendering, A valid React component is not present.');
            }

            component = page.component;

            if (!Util.isUndefinedOrNull(page.template)) {
                template = page.template;
            }

            if (!Util.isUndefinedOrNull(page.client)) {
                client = page.client;
            }

        } else if (typeof page == 'function') {
            component = page;
        } else {
            throwError('A valid Page object is required for rendering, A valid React component is not present.');
        }

        var content = null;
        var element = null;
        var elementName = 'Unknown';

        try {

            element = React.createElement(component, this.getProps());

            if (!Util.isUndefinedOrNullOrEmpty(element)
                && !Util.isUndefinedOrNullOrEmpty(element.type)
                && !Util.isUndefinedOrNullOrEmpty(element.type.displayName)) {
                elementName = element.type.displayName
            } else {
                console.error('Server side rendering resulted in exception, displayName not present');
                var suppliedProps = this.getProps();
                delete suppliedProps.pageInfo;
                delete suppliedProps.menu;
                console.error('Supplied Props: ' + this.safeStringify(suppliedProps, true)) ;
                console.error('Supplied serverProps: ' + this.safeStringify(this.getTemplateOnlyProps(), true)) ;
                try {
                    console.error('element dump: ' + this.safeStringify(element, true));
                } catch (e) {}
                throwError(err);
            }

            content = ReactDOMServer.renderToString(element);

        } catch(err) {

            if (!Util.isUndefinedOrNullOrEmpty(element)
                && !Util.isUndefinedOrNullOrEmpty(element.type)
                && !Util.isUndefinedOrNullOrEmpty(element.type.displayName)) {
                elementName = element.type.displayName
            }

            console.error('Server side rendering of component ' + elementName + ' resulted in exception');
            var suppliedProps = this.getProps();
            delete suppliedProps.pageInfo
            delete suppliedProps.menu;
            try {
                console.error('Supplied Props: ' + this.safeStringify(suppliedProps, true)) ;
                console.error('Supplied serverProps: ' + this.safeStringify(this.getTemplateOnlyProps(), true)) ;
                console.error('element dump: ' + this.safeStringify(element, true));
            } catch (e) {}
            throwError(err);
        }

        if (Util.isUndefinedOrNull(client)) {

            if (Util.isUndefinedOrNull(component.prototype.name)) {
                console.error('Server side rendering of component ' + elementName + ' resulted in exception');
                console.error('\'name\' not set in component ' + elementName);
                var suppliedProps = this.getProps();
                delete suppliedProps.pageInfo;
                delete suppliedProps.menu;
                console.error('Supplied Props: ' + this.safeStringify(suppliedProps, null, 4)) ;
                console.error('Supplied serverProps: ' + this.safeStringify(this.getTemplateOnlyProps(), true)) ;
                throwError('\'name\' not set in component ' + elementName);
            }

            client = component.prototype.name;
        }

        this.setTemplateOnlyProp('client', client, false);
        this.setTemplateOnlyProp('content', content, false);
        this.setTemplateOnlyProp('stringifyProps', this.getProps());

        this.renderTemplate(template);
    };

    // final point for rendering, prepare your props data before it.
    res.renderTemplate = function(templateName) {
        try {
            res.render(templateName);
        } catch(err) {
            console.error('Node rendering of template ' + templateName + ' resulted in exception');
            var suppliedProps = this.getProps();
            delete suppliedProps.pageInfo;
            delete suppliedProps.menu;
            console.error('Supplied Props: ' + this.safeStringify(suppliedProps, true)) ;
            console.error('Supplied serverProps: ' + this.safeStringify(this.getTemplateOnlyProps(), true)) ;
            throwError(err);
            return;
        }
};

    res.renderInvoices = function (invoices) {
        this.setProp('invoices', invoices);
        this.renderNow({
            template: 'invoice',
            client: 'invoice',
            component: global.PAGES.Invoice
        });
    };

    res.renderPayment = function (content) {
        this.setTemplateOnlyProp('content', content, false);
        this.renderTemplate('payment');
    };

    res.renderStatus = function () {
        this.renderTemplate('status');
    };

    res.renderMaintenance = function () {
        this.renderTemplate('maintenance');
    };

    function throwError(message) {
        console.error('StackTrace: ' + message.stack);
        throw message;
    };

    next();

}
