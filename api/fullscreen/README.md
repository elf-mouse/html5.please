## Activating fullscreen mode

Let's consider this `<video>` element:

```html
<video controls id="myvideo">
  <source src="somevideo.webm"></source>
  <source src="somevideo.mp4"></source>
</video>
```

We can put that video into fullscreen mode with script like this:

```js
var elem = document.getElementById("myvideo");
if (elem.requestFullscreen) {
  elem.requestFullscreen();
}
```

### Presentation differences

It's worth noting a key difference here between the Gecko and WebKit implementations at this time: Gecko automatically adds CSS rules to the element to stretch it to fill the screen: "width: 100%; height: 100%". WebKit doesn't do this; instead, it centers the fullscreen element at the same size in a screen that's otherwise black. To get the same fullscreen behavior in WebKit, you need to add your own "width: 100%; height: 100%;" CSS rules to the element yourself:

```css
#myvideo:-webkit-full-screen {
  width: 100%;
  height: 100%;
}
```

On the other hand, if you're trying to emulate WebKit's behavior on Gecko, you need to place the element you want to present inside another element, which you'll make fullscreen instead, and use CSS rules to adjust the inner element to match the appearance you want.

### Notification

When fullscreen mode is successfully engaged, the document which contains the element receives a `fullscreenchange` event. When fullscreen mode is exited, the document again receives a  `fullscreenchange` event. Note that the `fullscreenchange` event doesn't provide any information itself as to whether the document is entering or exiting fullscreen mode, but if the document has a non null `fullscreenElement`, you know you're in fullscreen mode.

### When a fullscreen request fails

It's not guaranteed that you'll be able to switch into fullscreen mode. For example, `<iframe>` elements have the `allowfullscreen` attribute in order to opt-in to allowing their content to be displayed in fullscreen mode. In addition, certain kinds of content, such as windowed plug-ins, cannot be presented in fullscreen mode. Attempting to put an element which can't be displayed in fullscreen mode (or the parent or descendant of such an element) won't work. Instead, the element which requested fullscreen will receive a mozfullscreenerror event. When a fullscreen request fails, Firefox will log an error message to the Web Console explaining why the request failed. In Chrome and newer versions of Opera however, no such warning is generated.

## Getting out of full screen mode

The user always has the ability to exit fullscreen mode of their own accord; see [Things your users want to know](#things-your-users-want-to-know). You can also do so programmatically by calling the `exitFullscreen()` method.

## Other information

- `fullscreenElement`
- `fullscreenEnabled`

## Things your users want to know

You'll want to be sure to let your users know that they can press the __ESC__ key (or __F11__) to exit fullscreen mode.
