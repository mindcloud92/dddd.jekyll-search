'use strict';

(function (root, logger, _) {
    function validate (selector) {
        if (!_) {
            throw 'Require template middleware library: underscore'
        }

        if (!selector || !selector.template || !selector.container) {
            throw 'Require result template or container selector'
        }
    }

    function getElementBy (selector) {
        try {
            return document.querySelector(selector);
        } catch (e) {
            logger.warn(e);
            return {};
        }
    }

    const templateMiddleware = function (selector) {
        try {
            validate(selector);

            this.selector = selector;
        } catch (e) {
            logger.error(e);
        }
    };

    templateMiddleware.prototype.render = function (data) {
        if (!this.selector) {
            return;
        }

        const { template, container } = this.selector;

        const templateString = getElementBy(template).innerText;
        getElementBy(container).innerHTML = _.template(templateString)({
            data
        });
    };

    root.TemplateMiddleware = templateMiddleware;
}(window.dddd.Search, window.dddd.Logger = window.dddd.Logger || {}, window._));
