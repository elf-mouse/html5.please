# HTMLElement.dataset

## Syntax

```
string = element.dataset.camelCasedName;
element.dataset.camelCasedName = string;
```

## Examples

```html
<div id="user" data-id="1234567890" data-user="johndoe" data-date-of-birth>John Doe</div>
```

```js
var el = document.querySelector('#user');

// el.id == 'user'
// el.dataset.id === '1234567890'
// el.dataset.user === 'johndoe'
// el.dataset.dateOfBirth === ''

el.dataset.dateOfBirth = '1960-10-03'; // set the DOB.

// 'someDataAttr' in el.dataset === false

el.dataset.someDataAttr = 'mydata';
// 'someDataAttr' in el.dataset === true
```

Recommended polyfills: [HTML5 dataset support](http://eligrey.com/blog/post/html-5-dataset-support)
