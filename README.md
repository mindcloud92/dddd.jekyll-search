# dddd.static-search

### Usecases
- [DdDd](https://super-dev.xyz/search/?q=static-search) (env. Jekyll)


### Getting Started

1. add `search.html`
    - implement search area markup
        ```html
        <div class="contents-wrapper">
            <form type="submit" action="{search path}" class="search-input-wrapper">
                <input id="{search input id}" type="text" name="{search paramter name}" placeholder="{placeholder}" />
                <button type="submit" class="icon search"></button>
            </form>

            <section id="{search result container id}" class="mt-2">
            </section>
        </div>
        ```
    
    - import `dddd.static-search` library with CDN
        ```html
        <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/mindcloud92/dddd.static-search@624e63ddeffb4b59bb34f84fae0190f3b3655495/src/static/js/dddd.static-search.min.js"></script>
        ```
    
    1-1. When using the default template engine(default: underscore)
    
    - import template engine library with CDN
        ```html
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/underscore@1.13.1/underscore-umd-min.js"></script>
        ```

    - implement onload event
        ```javascript
        window.onload = () => {
            dddd.static.Search.renderResult({
                <!-- options -->
                data: [<!-- search target origin data -->]
            })
        }
        ```
  
    - define search result template
        ```html
        <script id="template-post-list" type="text/template">
          <!-- search result template -->
        </script>
        ```

    1-2. customizing render result function
    - implement onload event

        ```javascript
        window.onload = () => {
            dddd.static.Search.renderResult({
                data: [<!-- search target origin data -->]
                renderResult: (data, keyword, config) => {
                    <!-- render result logic -->
                }
            })
        }
        ```
       
  
### Options
| name | type | required | default | supported value | description |
|---|:---:|:---:|:--|:--|:--|
| `element.input` | string | false | '#searchInput' | N/A | search input selector |
| `element.resultTemplate` | string | false | '#template-post-list' | N/A | search result template selector (*applicable only with default template engine*) |
| `element.resultContainer` | string | false | '#postSection' | N/A | search result render target container selector |
| `keyword.types` | array | false | ['title', 'content', 'categories', 'tags'] | title, content, categories, tags | search target property names |
| `keyword.queryVariableName` | string | false | 'q' | N/A | search query string parameter name |
| `renderOptions.dateFormat` | string | false | 'yyyy.MM.dd' | yyyy, yy, MM, dd, E, hh, mm, ss, a/p | search result date format (*applicable only with default template engine*) |
| `data` | array | true | N/A | N/A | all posts |
| `renderResult` | function | conditional | private renderResult(data = filtered post list, keyword, config) | N/A | render search result function |
