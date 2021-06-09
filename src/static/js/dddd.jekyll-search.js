'use strict';

if (!window.dddd) {
    window.dddd  = {}
}

if (!window.dddd.jekyll) {
    window.dddd.jekyll = {}
}

(function (window, document, location) {
    const utils = {
        deserializeQueryString: () => {
            const queryString = decodeURIComponent(location.href.substring(location.href.indexOf('?') + 1, location.href.length))

            return queryString.split('&').reduce((acc, curr) => {
                const pair = curr.split('=')

                return {
                    [pair[0]]: pair[1],
                    ...acc
                }
            }, {})
        },
        log: (message) => {
            console.log(`%c${message}`, 'color: #e91e63')
        },
        getQueryVariableValue: function (name, defaultValue = '') {
            try {
                const queryVariables = this.deserializeQueryString()

                const queryVariableValue = queryVariables[name]
                if (queryVariableValue === undefined) {
                    throw 'Not found query variable'
                }

                return  queryVariableValue
            } catch (e) {
                this.log(e)
                return defaultValue
            }
        },
        getElementBySelector: function (selector) {
            try {
                return document.querySelector(selector)
            } catch (e) {
                this.log(`Not found element: ${selector}`)
                return {}
            }
        },
        lPad: function (value, length = 2, padString = '0') {
            let str = '';
            for (let i = 0; i < length - value.toString().length; i++) {
                str += padString;
            }

            return `${str}${value}`
        },
        formatDate: function (value, format) {
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
                        case 'yy': return _lPad(date.getFullYear() % 1000);
                        case 'MM': return _lPad(date.getMonth() + 1);
                        case 'dd': return _lPad(date.getDate());
                        case 'E': return dayNames[date.getDay()];
                        case 'HH': return _lPad(date.getHours());
                        case 'hh': return _lPad((hours % 12) ? hours : 12);
                        case 'mm': return _lPad(date.getMinutes());
                        case 'ss': return _lPad(date.getSeconds());
                        case 'a/p': return date.getHours() < 12 ? "오전" : "오후";
                        default: return $1;
                    }
                });
        }
    }

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
                console.log(e)
                utils.log('Please check resultTemplate or resultContainer')
            }
        }
    }

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
            utils.log(e)
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
            utils.log(e)
            return []
        }
    }

    window.dddd.jekyll.Search = Search
})(window, document, location)
