# Drag and Drop

## The basics

### Identify what is draggable

__draggable__

- `true`, which indicates the element may be dragged
- `false`, which indicates the element may not be dragged.

```html
<body>
  <p id="p1" draggable="true" ondragstart="dragstart_handler(event);">This element is draggable.</p>
</body>
```

```js
function dragstart_handler(ev) {
  console.log("dragStart");
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text/plain", ev.target.id);
}
```

### Define the drag's data

```js
function dragstart_handler(ev) {
  // Add the drag data
  ev.dataTransfer.setData("text/plain", ev.target.id);
  ev.dataTransfer.setData("text/html", "<p>Example paragraph</p>");
  ev.dataTransfer.setData("text/uri-list", "http://developer.mozilla.org");
}
```

__Recommended Drag Types__

```js
// Dragging Text
event.dataTransfer.setData("text/plain", "This is text to drag");

// Dragging Links
var dt = event.dataTransfer;
dt.setData("text/uri-list", "http://www.mozilla.org");
dt.setData("text/plain", "http://www.mozilla.org");

// Dragging HTML and XML
var dt = event.dataTransfer;
dt.setData("text/html", "Hello there, <strong>stranger</strong>");
dt.setData("text/plain", "Hello there, stranger");

// Dragging Files
event.dataTransfer.mozSetDataAt("application/x-moz-file", file, 0);

// Dragging Images
var dt = event.dataTransfer;
dt.mozSetDataAt("image/png", stream, 0);
dt.mozSetDataAt("application/x-moz-file", file, 0);
dt.setData("text/uri-list", imageurl);
dt.setData("text/plain", imageurl);
```

### Define the drag image

```js
function dragstart_handler(ev) {
  // Create an image and then use it for the drag image.
  // NOTE: change "example.gif" to an existing image or the image
  // will not be created and the default drag image will be used.
  var img = new Image();
  img.src = 'example.gif';
  ev.dataTransfer.setDragImage(img, 10, 10);
}
```

### Define the drag effect

```js
function dragstart_handler(ev) {
  // Set the drag effect to copy
  ev.dataTransfer.dropEffect = "copy";
}
```

### Define a drop zone

```html
<body>
  <div id="target" ondrop="drop_handler(event);" ondragover="dragover_handler(event);">Drop Zone</div>
</body>
```

```js
function dragover_handler(ev) {
  ev.preventDefault();
  // Set the dropEffect to move
  ev.dataTransfer.dropEffect = "move"
}
function drop_handler(ev) {
  ev.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}
```

### Handle the drop effect

```html
<body>
  <p id="p1" draggable="true" ondragstart="dragstart_handler(event);">This element is draggable.</p>
  <div id="target" ondrop="drop_handler(event);" ondragover="dragover_handler(event);">Drop Zone</div>
</body>
```

```js
function dragstart_handler(ev) {
  ev.preventDefault();
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text/plain", ev.target.id);
  ev.dropEffect = "move";
}
function drop_handler(ev) {
  ev.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}
```

### Drag end

> Recommended polyfills: [dropfile](https://github.com/MrSwitch/dropfile), [fileSaver](https://github.com/eligrey/FileSaver.js), [jDataView](https://github.com/vjeux/jDataView)
