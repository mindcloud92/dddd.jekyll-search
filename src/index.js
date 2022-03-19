'use strict';

(function (root, logger) {
    function validate (source) {
        if (!source || source.length === undefined) {
            throw 'Mismatch data type'
        }
    }

    function filterSource(fields = ['title', 'content', 'category', 'sub_category', 'tags', ]) {
        try {
            validate(this.source);

            return this.source.filter(data => {
                return fields.some(field => data[field] && data[field].indexOf(this.keyword) > -1);
            })
        } catch (e) {
            logger.error(e);
            return [];
        }
    }

    function setRenderFunction (resultSelector) {
        const defaults = {
            template: '#template-post-list',
            container: '#postSection',
        };

        this.render = () => {
            const middleware = new root.Search.TemplateMiddleware({
                ...defaults,
                ...resultSelector
            });

            return middleware.render(this.result);
        };
    }

    function setKeyword (key) {
        this.keyword = root.QueryParser(key);
    }

    root.Search = function (data, options = {}) {
        this.source = data;

        setKeyword.call(this, options.queryStringKey);
        this.result = filterSource.call(this, options.fields);

        if (!options.hasCustomRenderFunction) {
            setRenderFunction.call(this, options.resultSelector);
        }

        return this;
    };
}(window.dddd = window.dddd || {}, window.dddd.Logger = window.dddd.Logger || {}));
