// div is an object reference to a <div> element with class="foo bar"
div.classList.remove("foo");
div.classList.add("anotherclass");

// if visible is set remove it, otherwise add it
div.classList.toggle("visible");

//  add/remove visible, depending on test conditional, i less than 10
div.classList.toggle("visible", i < 10);

alert(div.classList.contains("foo"));

// add or remove multiple classes
div.classList.add("foo", "bar");
div.classList.remove("foo", "bar");
