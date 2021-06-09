'use strict';

if (!window.dddd) {
    window.dddd  = {}
}

if (!window.dddd.jekyll) {
    window.dddd.jekyll = {}
}

(function (window) {
    function deserializeQueryString () {
        const queryString = decodeURIComponent(location.href.substring(location.href.indexOf('?') + 1, location.href.length))

        return queryString.split('&').reduce((acc, curr) => {
            const pair = curr.split('=')

            return {
                [pair[0]]: pair[1],
                ...acc
            }
        }, {})
    }

    function writeLog (message) {
        console.log(`%c${message}`, 'color: #e91e63')
    }

    function getQueryVariableValue (name, defaultValue = '') {
        try {
            const queryVariables = this.deserializeQueryString()

            const queryVariableValue = queryVariables[name]
            if (queryVariableValue === undefined) {
                throw 'Not found query variable'
            }

            return  queryVariableValue
        } catch (e) {
            writeLog(e)
            return defaultValue
        }
    }

    function getElementBySelector (selector) {
        try {
            return document.querySelector(selector)
        } catch (e) {
            this.writeLog(`Not found element: ${selector}`)
            return {}
        }
    }

    function leftPad (value, length = 2, padString = '0') {
        let str = '';
        for (let i = 0; i < length - value.toString().length; i++) {
            str += padString;
        }

        return `${str}${value}`
    }

    function formatDate (value, format) {
        const date = new Date(value)
        if (!date) {
            return '';
        }

        const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
        const hours = date.getHours()

        const _lPad = this.lPad
        return format.replace(
            /(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi,
            function($1) {
                switch ($1) {
                    case 'yyyy': return date.getFullYear();
                    case 'yy': return leftPad(date.getFullYear() % 1000);
                    case 'MM': return leftPad(date.getMonth() + 1);
                    case 'dd': return leftPad(date.getDate());
                    case 'E': return dayNames[date.getDay()];
                    case 'HH': return leftPad(date.getHours());
                    case 'hh': return leftPad((hours % 12) ? hours : 12);
                    case 'mm': return leftPad(date.getMinutes());
                    case 'ss': return leftPad(date.getSeconds());
                    case 'a/p': return date.getHours() < 12 ? "오전" : "오후";
                    default: return $1;
                }
            });
    }

    window.dddd.jekyll.Utils = {
        ...window.dddd.jekyll.Utils,
        deserializeQueryString,
        writeLog,
        getQueryVariableValue,
        getElementBySelector,
        formatDate
    }
})(window);

(function (window, document, location, utils) {
    const defaults = {
        input: '#searchInput',
        targets: ['title', 'content', 'categories', 'tags'],
        dateFormat: 'yyyy.MM.dd',
        resultTemplate: '#template-post-list',
        resultContainer: '#postSection',
        parameterName: 'q',
        posts: [],
        renderResult: function (posts, q) {
            try {
                const html = _.template(utils.getElementBySelector(this.resultTemplate).innerText)({
                    posts,
                    q,
                    formatDate: (date) => utils.formatDate(date, this.dateFormat)
                })

                utils.getElementBySelector(this.resultContainer).innerHTML = html
            } catch (e) {
                utils.writeLog('Please check resultTemplate or resultContainer')
            }
        }
    }

    // search.setConfig()
    // search.renderResult()


    function Search (options) {
        this._defaults = defaults

        this.init(options)

        return this;
    }

    Search.prototype.init = function (options) {
        this.setConfig(options)

        const parameterValue = utils.getQueryVariableValue(this._config.parameterName)

        utils.getElementBySelector(this._config.input).value = parameterValue
        this._config.renderResult(this.filterPost(parameterValue), parameterValue)
    }

    Search.prototype.setConfig = function (options = {}) {
        try {
            if (!options.posts || (!options.renderResult && !window._)) {
                throw 'Undefined required properties.'
            }

            this._config = {
                ...this._defaults,
                ...options
            }
        } catch (e) {
            utils.writeLog(e)
            throw e;
        }
    }

    Search.prototype.filterPost = function (q) {
        try {
            if (!(this._config.posts instanceof Array)) {
                throw 'Mismatch post type'
            }

            if (!q) {
                return []
            }

            return this._config.posts.filter((post) => {
                return this._config.targets.some(target => {
                    return post[target].indexOf(q) > -1
                })
            })
        } catch (e) {
            utils.writeLog(e)
            return []
        }
    }

    window.dddd.jekyll.Search = Search
})(window, document, location, window.dddd.jekyll.Utils)
