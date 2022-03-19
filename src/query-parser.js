'use strict';

(function (root, logger, uri) {
    function deparam () {
        const queryString = decodeURIComponent(uri.substring(uri.indexOf('?') + 1, uri.length));

        return queryString.split('&').reduce((acc, curr) => {
            const [key, value] = curr.split('=');

            return {
                ...acc,
                [key]: value
            }
        }, {})
    }

    root.QueryParser = function (key= 'q') {
        try {
            const value = deparam()[key];
            if (value === undefined) {
                throw 'Invalid value in query string';
            }

            return value;
        } catch (e) {
            logger.info(`%c${e}`, 'color: green');
            return '';
        }
    }
}(window.dddd = window.dddd || {}, window.dddd.Logger = window.dddd.Logger || {}, location.href));


