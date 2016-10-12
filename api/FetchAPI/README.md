## Basic Fetch Request

### XMLHttpRequest

```js
function reqListener() {
  var data = JSON.parse(this.responseText);
  console.log(data);
}

function reqError(err) {
  console.log('Fetch Error :-S', err);
}

var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.onerror = reqError;
oReq.open('get', './api/some.json', true);
oReq.send();
```

### Fetch

```js
fetch('./api/some.json')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
```

## Response Metadata

```js
fetch('users.json').then(function(response) {
    console.log(response.headers.get('Content-Type'));
    console.log(response.headers.get('Date'));

    console.log(response.status);
    console.log(response.statusText);
    console.log(response.type);
    console.log(response.url);
});
```

## Response Types

You can define a mode for a fetch request such that only certain requests will resolve. The modes you can set are as follows:

- `same-origin` only succeeds for requests for assets on the same origin, all other requests will reject.
- `cors` will allow requests for assets on the same-origin and other origins which return the appropriate CORs headers.
- `cors-with-forced-preflight` will always perform a preflight check before making the actual request.
- `no-cors` is intended to make requests to other origins that do not have CORS headers and result in an `opaque` response, but as stated, this isn't possible in the window global scope at the moment.

To define the mode, add an options object as the second parameter in the `fetch` request and define the mode in that object:

```js
fetch('http://some-site.com/cors-enabled/some.json', {mode: 'cors'})
  .then(function(response) {
    return response.text();
  })
  .then(function(text) {
    console.log('Request successful', text);
  })
  .catch(function(error) {
    log('Request failed', error)
  });
```

## Chaining Promises

```js
function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json()
}

fetch('users.json')
  .then(status)
  .then(json)
  .then(function(data) {
    console.log('Request succeeded with JSON response', data);
  }).catch(function(error) {
    console.log('Request failed', error);
  });
```

## POST Request

```js
fetch(url, {
    method: 'post',
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: 'foo=bar&lorem=ipsum'
  })
  .then(json)
  .then(function (data) {
    console.log('Request succeeded with JSON response', data);
  })
  .catch(function (error) {
    console.log('Request failed', error);
  });
```

## Sending Credentials with a Fetch Request

```js
fetch(url, {
  credentials: 'include'
})
```

> [Polyfill](https://github.com/github/fetch)
