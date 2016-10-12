# FileSystem & FileWriter API

The API is broken up into various themes:

- Reading and manipulating files: `File`/`Blob`, `FileList`, `FileReader`
- Creating and writing: `Blob()`, `FileWriter`
- Directories and file system access: `DirectoryReader`, `FileEntry`/`DirectoryEntry`, `LocalFileSystem`

## Requesting a file system

A web app can request access to a sandboxed file system by calling `window.requestFileSystem()`:

```js
// Note: The file system has been prefixed as of Google Chrome 12:
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

window.requestFileSystem(type, size, successCallback, opt_errorCallback)
```

Example usage:

```js
function onInitFs(fs) {
  console.log('Opened file system: ' + fs.name);
}

window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onInitFs, errorHandler);

function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}
```

### Requesting storage quota

To use `PERSISTENT` storage, you must obtain permission from the user to store peristent data. The same restriction doesn't apply to `TEMPORARY` storage because the browser may choose to evict temporarily stored data at its discretion.

```js
window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
  window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
}, function(e) {
  console.log('Error', e);
});
```

## Working with files

Properties and methods of FileEntry:

```js
fileEntry.isFile === true
fileEntry.isDirectory === false
fileEntry.name
fileEntry.fullPath
...

fileEntry.getMetadata(successCallback, opt_errorCallback);
fileEntry.remove(successCallback, opt_errorCallback);
fileEntry.moveTo(dirEntry, opt_newName, opt_successCallback, opt_errorCallback);
fileEntry.copyTo(dirEntry, opt_newName, opt_successCallback, opt_errorCallback);
fileEntry.getParent(successCallback, opt_errorCallback);
fileEntry.toURL(opt_mimeType);

fileEntry.file(successCallback, opt_errorCallback);
fileEntry.createWriter(successCallback, opt_errorCallback);
...
```

### Creating a file

The following code creates an empty file called "log.txt" in the root of the app's file system:

```js
function onInitFs(fs) {

  fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {

    // fileEntry.isFile === true
    // fileEntry.name == 'log.txt'
    // fileEntry.fullPath == '/log.txt'

  }, errorHandler);

}

window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);
```

### Reading a file by name

The following code retrieves the file called "log.txt", its contents are read using the FileReader API and appended to a new `<textarea>` on the page. If log.txt doesn't exist, an error is thrown.

```js
function onInitFs(fs) {

  fs.root.getFile('log.txt', {}, function(fileEntry) {

    // Get a File object representing the file,
    // then use FileReader to read its contents.
    fileEntry.file(function(file) {
       var reader = new FileReader();

       reader.onloadend = function(e) {
         var txtArea = document.createElement('textarea');
         txtArea.value = this.result;
         document.body.appendChild(txtArea);
       };

       reader.readAsText(file);
    }, errorHandler);

  }, errorHandler);

}

window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);
```

### Writing to a file

The following code creates an empty file called "log.txt" (if it doesn't exist) and fills it with the text 'Lorem Ipsum'.

```js
function onInitFs(fs) {

  fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      // Create a new Blob and write it to log.txt.
      var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});

      fileWriter.write(blob);

    }, errorHandler);

  }, errorHandler);

}

window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);
```

### Appending data to a file

The following code appends the text 'Hello World' to the end of our log file. An error is thrown if the file does not exist.

```js
function onInitFs(fs) {

  fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.seek(fileWriter.length); // Start write position at EOF.

      // Create a new Blob and write it to log.txt.
      var blob = new Blob(['Hello World'], {type: 'text/plain'});

      fileWriter.write(blob);

    }, errorHandler);

  }, errorHandler);

}

window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);
```

### Duplicating user-selected files

The following code allows a user to select multiple files using `<input type="file" multiple />` and creates copies of those files in the app's sandboxed file system.

```html
<input type="file" id="myfile" multiple />
```

```js
document.querySelector('#myfile').onchange = function(e) {
  var files = this.files;

  window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
    // Duplicate each file the user selected to the app's fs.
    for (var i = 0, file; file = files[i]; ++i) {

      // Capture current iteration's file in local scope for the getFile() callback.
      (function(f) {
        fs.root.getFile(f.name, {create: true, exclusive: true}, function(fileEntry) {
          fileEntry.createWriter(function(fileWriter) {
            fileWriter.write(f); // Note: write() can take a File or Blob object.
          }, errorHandler);
        }, errorHandler);
      })(file);

    }
  }, errorHandler);

};
```

### Removing a file

The following code deletes the file 'log.txt'.

```js
window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
  fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

    fileEntry.remove(function() {
      console.log('File removed.');
    }, errorHandler);

  }, errorHandler);
}, errorHandler);
```

## Working with directories

Properties and methods of DirectoryEntry:

```js
dirEntry.isDirectory === true
// See the section on FileEntry for other inherited properties/methods.
...

var dirReader = dirEntry.createReader();
dirEntry.getFile(path, opt_flags, opt_successCallback, opt_errorCallback);
dirEntry.getDirectory(path, opt_flags, opt_successCallback, opt_errorCallback);
dirEntry.removeRecursively(successCallback, opt_errorCallback);
...
```

### Creating directories

For example, the following code creates a directory named "MyPictures" in the root directory:

```js
window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
  fs.root.getDirectory('MyPictures', {create: true}, function(dirEntry) {
    ...
  }, errorHandler);
}, errorHandler);
```

### Subdirectories

The following code creates a new hierarchy (music/genres/jazz) in the root of the app's FileSystem by recursively adding each subdirectory after its parent folder has been created.

```js
var path = 'music/genres/jazz/';

function createDir(rootDirEntry, folders) {
  // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
  if (folders[0] == '.' || folders[0] == '') {
    folders = folders.slice(1);
  }
  rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {
    // Recursively add the new subfolder (if we still have another to create).
    if (folders.length) {
      createDir(dirEntry, folders.slice(1));
    }
  }, errorHandler);
};

function onInitFs(fs) {
  createDir(fs.root, path.split('/')); // fs.root is a DirectoryEntry.
}

window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);
```

Now that "music/genres/jazz" is in place, we can pass its full path to getDirectory() and create new subfolders or files under it. For example:

```js
window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
  fs.root.getFile('/music/genres/jazz/song.mp3', {create: true}, function(fileEntry) {
    ...
  }, errorHandler);
}, errorHandler);
```

### Reading a directory's contents

```html
<ul id="filelist"></ul>
```

```js
function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
}

function listResults(entries) {
  // Document fragments can improve performance since they're only appended
  // to the DOM once. Only one browser reflow occurs.
  var fragment = document.createDocumentFragment();

  entries.forEach(function(entry, i) {
    var img = entry.isDirectory ? '<img src="folder-icon.gif">' :
                                  '<img src="file-icon.gif">';
    var li = document.createElement('li');
    li.innerHTML = [img, '<span>', entry.name, '</span>'].join('');
    fragment.appendChild(li);
  });

  document.querySelector('#filelist').appendChild(fragment);
}

function onInitFs(fs) {

  var dirReader = fs.root.createReader();
  var entries = [];

  // Call the reader.readEntries() until no more results are returned.
  var readEntries = function() {
     dirReader.readEntries (function(results) {
      if (!results.length) {
        listResults(entries.sort());
      } else {
        entries = entries.concat(toArray(results));
        readEntries();
      }
    }, errorHandler);
  };

  readEntries(); // Start reading dirs.

}

window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);
```

### Removing a directory

The following removes the empty directory "jazz" from "/music/genres/":

```js
window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
  fs.root.getDirectory('music/genres/jazz', {}, function(dirEntry) {

    dirEntry.remove(function() {
      console.log('Directory removed.');
    }, errorHandler);

  }, errorHandler);
}, errorHandler);
```

#### Recursively removing a directory

The following code recursively removes the directory "music" and all the files and directories that it contains:

```js
window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
  fs.root.getDirectory('/misc/../music', {}, function(dirEntry) {

    dirEntry.removeRecursively(function() {
      console.log('Directory removed.');
    }, errorHandler);

  }, errorHandler);
}, errorHandler);
```

## Copying, renaming, and moving

### Copying an entry

The following code example copies the file "me.png" from one directory to another:

```js
function copy(cwd, src, dest) {
  cwd.getFile(src, {}, function(fileEntry) {

    cwd.getDirectory(dest, {}, function(dirEntry) {
      fileEntry.copyTo(dirEntry);
    }, errorHandler);

  }, errorHandler);
}

window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
  copy(fs.root, '/folder1/me.png', 'folder2/mypics/');
}, errorHandler);
```

### Moving or renaming an entry

The following example renames "me.png" to "you.png", but does not move the file:

```js
function rename(cwd, src, newName) {
  cwd.getFile(src, {}, function(fileEntry) {
    fileEntry.moveTo(cwd, newName);
  }, errorHandler);
}

window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
  rename(fs.root, 'me.png', 'you.png');
}, errorHandler);
```

The following example moves "me.png" (located in the root directory) to a folder named "newfolder".

```js
function move(src, dirName) {
  fs.root.getFile(src, {}, function(fileEntry) {

    fs.root.getDirectory(dirName, {}, function(dirEntry) {
      fileEntry.moveTo(dirEntry);
    }, errorHandler);

  }, errorHandler);
}

window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
  move('/me.png', 'newfolder/');
}, errorHandler);
```

## filesystem: URLs

```js
var img = document.createElement('img');
img.src = fileEntry.toURL(); // filesystem:http://example.com/temporary/myfile.png
document.body.appendChild(img);
```

Alternatively, if you already have a filesystem: URL, `resolveLocalFileSystemURL()` will get you back the fileEntry:

```js
window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL ||
                                   window.webkitResolveLocalFileSystemURL;

var url = 'filesystem:http://example.com/temporary/myfile.png';
window.resolveLocalFileSystemURL(url, function(fileEntry) {
  ...
});
```
