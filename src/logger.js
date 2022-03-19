'use strict';

(function (root, log) {
    function mapToEmoji (codePoint) {
        if (!String.fromCodePoint || !codePoint) {
            return '';
        }

        return String.fromCodePoint(codePoint);
    }

    function printLog (message, codePoint, color) {
        const emoji = mapToEmoji(codePoint);

        log(`${emoji}%c${message}`, `color: ${color};`);
    }

    root.Logger = {
        log,
        info: function (message) {
            printLog(message, '0x1F388', '#4caf50');
        },
        warn: function (message) {
            printLog(message, '0x1F4A7', '#ffc107');
        },
        error: function (message) {
            printLog(message, '0x1F525', '#f44336');
        }
    };
}(window.dddd = window.dddd || {}, console.log));
