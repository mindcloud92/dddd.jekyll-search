<div align="center">
  <img src="https://user-images.githubusercontent.com/3929320/159136453-34c7408f-d22c-4c8c-a8a5-7ae518916109.png" alt="dddd.static-search" height="180px" />
</div>

<h1 align="center">dddd.static-search</h1>

<div align="center">
  <img src="https://img.shields.io/badge/version-v1.0.0-blue?style=flat-square" alt="version v1.0.0" />
</div>

<br/>


[![usecase](https://user-images.githubusercontent.com/3929320/159149026-1acbfc17-8406-47be-8f14-53518b8d2c27.png)](https://mindcloud92.github.io/search/?q=search)

<br/>

### Key Features
- Static data keyword search
- Default template middleware support : [Underscore.js](https://underscorejs.org/)

<br/>


### Getting Started
*Implement the following on the target page:*
<br/>



#### add search area markup

```html
<div>
    <form type="submit" action="{search path}">
        <input type="text" name="{search paramter name}" />
        <button type="submit">Search</button>
    </form>

    <section id="{search result container id}">
    </section>
</div>
```

#### define `dddd.static-search` library with CDN

```html
<script type="text/javascript" src="//cdn.jsdelivr.net/gh/mindcloud92/dddd.static-search@6ab1ea67a0357bed734a216d4de9e675c13ec45a/src/dist/dddd.search.min.js"></script>
```

#### implement `window.onload` function 
> Read more about [Creating an instance](https://github.com/mindcloud92/dddd.static-search/wiki/Creating-an-instance)


**case1:** render search results using default template middleware
* import template middleware library with CDN   

  ```html
  <script type="text/javascript" src="//cdn.jsdelivr.net/npm/underscore@1.13.1/underscore-umd-min.js"></script>
  ```
  
* define search result template   

  ```html
  <script id="{search result template id}" type="text/template">
    <!-- search result template -->
  </script>
  ```
  
* implement `window.onload` function   

  ```javascript
  window.onload = () => {
    const data = [<!-- search target origin data -->];
    const options = {<!-- options -->};

    new dddd.Search(data, options).renderResult();
  }
  ```
    
**case2:** customization
  ```javascript
  window.onload = () => {
    const data = [<!-- search target origin data -->];
    const options = {
      hasCustomRenderFunction: true
      <!-- options -->
    };

    const { keyword, result } = new dddd.Search(data, options);
    
    setKeyword(keyword);
    renderPostSection(result);
  }
  
  function setKeyword (keyword) {
    document.getElementById('searchInput').value = keyword;
  }

  function renderPostSection (posts) {
    const $postSection = createPostSection(posts);
    document.getElementById('postSection').innerHTML = $postSection.innerHTML;
  }

  function createPostSection (posts) {
    return posts.reduce((acc, curr) => {
      const $link = document.createElement('a');
      $link.text = curr.title;

      acc.innerHTML += $link.outerHTML;
      // result dom create & append to section

      return acc;
    }, document.createElement('div'));
  }
  ```

<br/>

### Example
![environment jekyll](https://img.shields.io/badge/environment-jekyll-orange?style=flat-square)   
⇢ [DdDd blog](https://mindcloud92.github.io/tech/2022/03/20/jekyll-implement-search/) 


