var cookie = require('cookies-js');

module.exports = {
    BASE_URL: '${apiUrl}',
    BLOG_BASE_URL: '${blogUrl}',
    deepCopy: function (obj) {
        //may break with date objects use carefully
        //http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object
        return JSON.parse(JSON.stringify(obj));
    },
    copyProps: function (src, dest) {
        for (var key in src) {
            if (src.hasOwnProperty(key) && src[key] != undefined) {
                dest[key] = src[key];
            }
        }
        return dest;
    },
    undefinedKeyToEmpty: function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] === 'undefined') {
                obj[key] = '';
            }
        }
        return obj;
    },
    undefinedOrNullKeyToEmpty: function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && this.isUndefinedOrNull(obj[key])) {
                obj[key] = '';
            }
        }
        return obj;
    },
    isStringAndNotEmpty: function (obj) {
        return (typeof obj === 'string') && (obj !== '');
    },
    isStringAndEmpty: function (obj) {
        return (typeof obj === 'string') && (obj === '');
    },
    isEmptyObject: function (obj) {

        if (typeof obj == 'boolean' || typeof obj == 'number' || typeof obj == 'function') {
            return false;
        }

        if (obj instanceof Set) {
            if ((typeof obj.size !== 'undefined') && (obj.size != 0)) {
                return false;
            }
        }

        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
            return false;
        }

        return true;
    },
    isUndefined: function (value) {
        return typeof value === 'undefined';
    },
    isUndefinedOrNull: function (obj) {
        return (typeof obj === 'undefined') || (obj === null);
    },
    isUndefinedOrNullOrEmpty: function (obj) {
        return (typeof obj === 'undefined') || (obj === null) || (obj === '')/* || (this.isEmptyObject(obj))*/;
    },
    isUndefinedOrNullOrEmptyObject: function (obj) {
        return (typeof obj === 'undefined') || (obj === null) || (obj === '') || (this.isEmptyObject(obj));
    },
    isUndefinedOrNullOrEmptyList: function (obj) {
        return (typeof obj === 'undefined') || (obj === null) || (obj.constructor === Array && obj.length === 0);
    },
    isUndefinedOrNullOrEmptyOrEmptyObjectOrEmptyList: function (obj) {
        return (typeof obj === 'undefined') || (obj === null) || (obj === '') || (this.isEmptyObject(obj)) || (obj.constructor === Array && obj.length === 0);
    },
    isFunction: function (func) {
        if (typeof func === "function") {
            return true;
        }
        return false;
    },
    debounce: function (func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function () {
            var last = new Date().getTime() - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };

        return function () {
            context = this;
            args = arguments;
            timestamp = new Date().getTime();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
    },
    zeroArrayOfLength: function (n) {
        return Array.apply(null, Array(n)).map(function (x, i) {
            return 0;
        });
    },
    /**
    * Gets displayable errorText.
    * @param error the response recieved
    * @param defaultMessage the default error message to returned if the error is null or undefined
    * @returns {*}
    */
    getErrorMessage: function (error, defaultMessage) {
        defaultMessage = defaultMessage || 'Server is unavailable.';
        console.log(error);
        if (!this.isUndefinedOrNull(error.responseText)) {
            return JSON.parse(error.responseText).errorMessage;
        }

        return defaultMessage;
    },
    swapElement: function (array, indexA, indexB) {
        var tmp = array[indexA];
        array[indexA] = array[indexB];
        array[indexB] = tmp;
    },
    isTypeOf: function (data, type) {
        return typeof data === type;
    },
    arraysEqual: function(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    },
    getDelimiterSeperatedStringFromArray: function (array, delimiter) {
        var length = array.length;
        var finalValue = '';
        for (var i = 0; i < length - 1; i++) {
            finalValue = finalValue + array[i].trim() + delimiter + ' ';
        }
        finalValue = finalValue + array[i].trim();
        return finalValue;
    },
    splitArrayAccordingToRow: function (array, numElemsInRow) {
        var finalArray = [];
        var arrayLength = array.length;
        var arrayIndex;
        for (var i = 0; i < arrayLength; i = i + numElemsInRow) {
            var rowObject = [];
            for (var elemIndex = 0; elemIndex < numElemsInRow; elemIndex++) {
                arrayIndex = i + elemIndex;
                if (arrayIndex < arrayLength) {
                    rowObject.push(array[arrayIndex]);
                }
            }
            finalArray.push(rowObject);
        }
        return finalArray;
    },
    //don't pass nested objects in here
    objToQueryString: function (obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                if (!this.isUndefinedOrNull(obj[p])) {
                    if (Object.prototype.toString.call(obj[p]) === '[object Array]') {
                        for (var i = 0; i < obj[p].length; i++) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p][i]));
                        }
                    } else if (typeof obj[p] === 'string' || typeof obj[p] === 'number' || typeof obj[p] === 'boolean') {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p].toString()));
                    }
                }
            }
        }
        return str.join("&");
    },
    isElementInViewport: function (el) {
        var rect = el.getBoundingClientRect();
        return rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
        rect.top < (window.innerHeight || document.documentElement.clientHeight);
    },
    sleep: function (time) {
        var stop = new Date().getTime();
        while (new Date().getTime() < stop + time) {
            ;
        }
    },
    randomNo: function (offset, digits) {
        var no = parseInt(offset + (Math.random() * digits));
        return no;
    },
    buildHiddenForm: function (url, method, params) {
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", url);

        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);
                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        return form;
    },
    getUrlParams: function () {
        var params = {};
        if (window.location.search) {
            var parts = window.location.search.substring(1).split('&');

            for (var i = 0; i < parts.length; i++) {
                var nv = parts[i].split('=');
                if (!nv[0]) continue;
                params[nv[0]] = nv[1] || true;
            }
        }
        return params;
    },
    //another implementation of getUrlParams.  457 votes
    getQueryString: function () {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var queryString = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof queryString[pair[0]] === "undefined") {
                queryString[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof queryString[pair[0]] === "string") {
                var arr = [queryString[pair[0]], decodeURIComponent(pair[1])];
                queryString[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                queryString[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return queryString;
    },
    getValue: function (obj, key, def) {
        if (this.isUndefinedOrNullOrEmptyObject(obj) || this.isUndefinedOrNullOrEmpty(key)) {
            return def;
        }

        var value = obj[key];
        if (this.isUndefinedOrNull(value)) {
            return def;
        }

        return value;
    },
    getCookieHeaders: function() {
        var cookieHeaders = this.getAuthHeaders();
        var pin = cookie.get('pincode')
        if (!this.isUndefinedOrNullOrEmpty(pin)) {
            cookieHeaders['X-OFB-PINCODE'] = pin;
        }
        return cookieHeaders;
    },
    getAuthHeaders: function() {
        var authToken = cookie.get('auth-token');
        var guestAuthToken = cookie.get('g-token');
        if (!this.isUndefinedOrNullOrEmpty(authToken)) {
            return {
                'X-OFB-TOKEN': authToken
            }
        }

        if (!this.isUndefinedOrNullOrEmpty(guestAuthToken)) {
            return {
                'X-OFB-GTOKEN': guestAuthToken
            }
        }

        return {};
    },
    isLoggedInAsGuest : function(){
        return (this.isLoggedInOrGuest() && (!this.isLoggedIn()));
    },
    isLoggedInOrGuest: function() {
        var authToken = cookie.get('auth-token');
        var guestAuthToken = cookie.get('g-token');
        if (this.isUndefinedOrNullOrEmpty(authToken) && this.isUndefinedOrNullOrEmpty(guestAuthToken)) {
            return false;
        }
        return true;
    },
    getCdnUrl: function (url) {
        var cdnUrl = '${imgCdnUrl}';
        if(!this.isUndefinedOrNullOrEmpty(url)) {
            return cdnUrl + url;
        }
    },
    handleCaret: function (key) {
        if (!this.isUndefinedOrNullOrEmpty(key)) {
            var index = key.indexOf('^')
            if(index > -1) {
                var keyPrefix = key.slice(0, index);
                var keySuffix = key.slice(index + 1, index + 2);
                var keyEnd = key.slice(index + 2)
                return (
                    keyPrefix + '<sup>' + keySuffix + '</sup>' + keyEnd
                )
            }
        }
        return key;
    },
    getPlaceHolderImageUrl: function() {
        return  this.getCdnUrl("/fe-imgs/placeholder-product.jpeg");
    },
    isCategoryHealthCare: function(categoryId) {
        return categoryId === Constants.HEALTH_CARE_CATEGORY;
    },
    isLoggedIn: function() {
        var authToken = cookie.get('auth-token');
        if (this.isUndefinedOrNullOrEmpty(authToken)) {
            return false;
        }
        return true;
    },
    concatWithHyphen: function () {
        var args = Array.prototype.slice.call(arguments);
        return args.join('-');
    },
    shallowCopy: function(original) {
        // First create an empty object with
        // same prototype of our original source
        var clone = Object.create(Object.getPrototypeOf(original));
        var i, keys = Object.getOwnPropertyNames(original);
        for (i = 0; i < keys.length; i++) {
            // copy each property into the clone
            Object.defineProperty(clone, keys[i],
                Object.getOwnPropertyDescriptor(original, keys[i])
            );
        }
        return clone;
    },
    allEmptyOrInnerKeysVoid: function (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (!this.isUndefinedOrNullOrEmptyObject(arr[i])) {
                return false;
            } else if(!this.allKeysVoid(arr[i])) {
                return false;
            }
        }
        return true;
    },
    allEmpty: function (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (!this.isUndefinedOrNullOrEmptyObject(arr[i])) {
                return false;
            }
        }
        return true;
    },
    allKeysVoid: function (obj) {
        var keys = Object.keys(obj);
        var result = true;
        var _this = this;
        keys.forEach(function(key) {
            if(!_this.isUndefinedOrNullOrEmptyOrEmptyObjectOrEmptyList(obj[key])) {
                result = false;
            }
        });
        return result;
    },
    findLengthAtLeastOneKeyNonEmpty: function (arr) {
        var _this = this;
        var length = 0;
        arr.forEach(function(obj) {
            var keys = Object.keys(obj);
            var indexOf = keys.findIndex(function (key) {
                return !_this.isUndefinedOrNullOrEmpty(obj[key]);
            });
            if(indexOf > -1) {
                length++;
            }
        });
        return length;
    },
    checkIfValidPage: function (page) {
        if (this.isUndefinedOrNullOrEmptyObject(page)) {
            return {isValid: false, message: 'A valid Page object is required for rendering.'};
        }

        if (typeof page != 'function' && this.isUndefinedOrNull(page.component)) {
            return {
                isValid: false,
                message: 'A valid Page object is required for rendering, A valid React component is not present.'
            };
        }
        return {isValid: true, message: ''};
    },
    isNumeric: function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    getPreviousMonthDate: function () {
        var d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d;
    },
    fromNow: function(date) {
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        var firstDate = date;
        var secondDate = new Date();
        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
        if(diffDays === 1) {
            return diffDays + " day ago";
        }
        return diffDays + " days ago";
    },
    capitalize: function (input) {
        if (!this.isUndefinedOrNullOrEmpty(input)) {
            return input.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, function (m) {
                return m.toUpperCase();
            });
        }
    },
    parallel: function (tasks, callback) {
        if (Array.isArray(tasks)) {
            var totalNumberOfTasks = tasks.length;
            if(totalNumberOfTasks <= 0) {
                throw new Error('Empty task array passed to parallel');
            }
            var taskCompletedCount = 0;
            var results = [];
            tasks.forEach(function(task, index) {
                task(function() {
                    var args = Array.prototype.slice.call(arguments);
                    var err = args.length <= 0 ? new Error('No callback arguments passed for task number ' + (index + 1) ) : args[0];
                    if(err) {
                        callback(err);
                    }
                    args.shift(); // removes first element
                    var result = undefined; // result undefined if no more arguments left
                    if(args.length === 1) {
                        result = args[0]; // result single value
                    } else if(args.length > 1) {
                        result = args; // result multiple values
                    }
                    results[index] = result;
                    taskCompletedCount++;
                    if(taskCompletedCount === totalNumberOfTasks) {
                        callback(null, results);
                    }
                })
            })
        } else {
            var keys = Object.keys(tasks);
            var totalNumberOfTasks = keys.length;
            if(keys.length <= 0) {
                throw new Error('Empty task object passed to parallel');
            }
            var taskCompletedCount = 0;
            var results = {};
            keys.forEach(function(key, index) {
                tasks[key](function() {
                    var args = Array.prototype.slice.call(arguments);
                    var err = args.length <= 0 ? new Error('No callback arguments passed for task number ' + (index + 1) ) : args[0];
                    if(err) {
                        callback(err);
                    }
                    args.shift(); // removes first element
                    var result = undefined; // result undefined if no more arguments left
                    if(args.length === 1) {
                        result = args[0]; // result single value
                    } else if(args.length > 1) {
                        result = args; // result multiple values
                    }
                    results[key] = result;
                    taskCompletedCount++;
                    if(taskCompletedCount === totalNumberOfTasks) {
                        callback(null, results);
                    }
                })
            });
        }
    }
};
