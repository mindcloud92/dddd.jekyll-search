'use strict';

if (!window.dddd) {
    window.dddd  = {}
}

if (!window.dddd.static) {
    window.dddd.static = {}
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

    window.dddd.Utils = {
        ...window.dddd.Utils,
        deserializeQueryString,
        writeLog,
        getQueryVariableValue,
        getElementBySelector,
        formatDate
    }
})(window);

(function (window, document, location, utils) {

    const defaults = {
        data: [],
        element: {
            input: '#searchInput',
            resultTemplate: '#template-post-list',
            resultContainer: '#postSection'
        },
        keyword: {
            types: ['title', 'content', 'categories', 'tags'],
            queryVariableName: 'q'
        },
        renderOptions: {
            dateFormat: 'yyyy.MM.dd',
        },
        renderResult: function (data, keyword, { element, renderOptions }) {
            try {
                const templateString = utils.getElementBySelector(element.resultTemplate).innerText

                utils.getElementBySelector(element.resultContainer).innerHTML = _.template(templateString)({
                    data,
                    keyword,
                    formatDate: (date) => utils.formatDate(date, renderOptions.dateFormat)
                })
            } catch (e) {
                utils.writeLog('Please check resultTemplate or resultContainer')
                utils.writeLog(e)
            }
        }
    }

    function createConfig (options) {
        try {
            if (!options.data || (!options.renderResult && !_)) {
                throw 'Undefined required option'
            }

            return {
                ...defaults,
                ...options
            }
        } catch (e) {
            utils.writeLog(e)
            throw e;
        }
    }

    function filterData (keyword, config) {
        try {
            if (!(config.data instanceof Array)) {
                throw 'Mismatch data type'
            }

            if (!keyword) {
                return []
            }

            return config.data.filter((d) => {
                return config.keyword.types.some(type => {
                    return d[type].indexOf(keyword) > -1
                })
            })
        } catch (e) {
            utils.writeLog(e)
            return []
        }
    }

    function renderResult (options) {
        const config = createConfig(options)
        const keyword = utils.getQueryVariableValue(config.keyword.queryVariableName)

        utils.getElementBySelector(config.element.input).value = keyword
        config.renderResult(filterData(keyword, config), keyword, config)
    }


    window.dddd.static.Search = {
        renderResult
    }
})(window, document, location, window.dddd.Utils)
