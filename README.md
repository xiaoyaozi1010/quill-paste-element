### quill-paste-element
A image and table paste module for `[quill.js](https://quilljs.com/)`.

#### Support:

- upload image with given api.
- convert to base64 format if there isn't api given.
- support paste table which copied from a excel doc.

#### Usage:

1. import the module:

```js
import PasteElement from '@tencent/quill-paste-element'
```

2. register the module:

```js
Quill.register('modules/pasteElement', PasteElement);
```

3. config in the quill options

```js
const editorOption = {
  modules: {
    toolbar: {
      // ...
    },
    pasteElement: {
      table: true,
      image: {
        name: 'avatar',
        uploadUrl: 'https://your.upload.url',
        withCredentials: true,
        uploadCallback(res) {
          return `${res}`
        }
      }
    },
  }
}
```

#### Options:

All options is optionally.

```js
{
    // Whether to support the table, default is true
    table: true,
    image: {
      // a data input `name` attribute value,
      // if not given, your BE may be cannot receive this file
      name: 'avatar',
      // the upload api url, if not exist or falsy value,
      // the image will be converted to base64 format
      uploadUrl: 'http://your.upload.url',
      // Whether to send a cookie certificate, the default is true
      withCredentials: true,
      // The callback after successful upload, the parameter is the upload result
      uploadCallback(res) {
          // do something here...
          // If you are dealing with the returned result here, be sure to return the new result,
          // otherwise the image src attribute may be incorrect.
          return res;
      }
    }
}
```
