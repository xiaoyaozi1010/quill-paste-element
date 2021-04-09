/*
* Description: 剪贴板插件，处理table、image
* Author:  lizy
* Date:
* */
import axios from 'axios'
import Quill from 'quill'
import merge from 'lodash.merge'
import PasteBlot from './PasteBlot';

const defaultOptions = {
  table: true,
  image: {
    name: '',
    uploadUrl: '',
    withCredentials: true,
    uploadCallback(data) {
      return data
    }
  }
};
Quill.register(PasteBlot);

export default class PasteElement {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = merge(defaultOptions, options);
    if (!this.options.table && !this.options.image) return
    this.isUpload = !!this.options.image.uploadUrl;
    this.handlePaste = this.handlePaste.bind(this);
    this.quill.root.addEventListener('paste', this.handlePaste, false);
  }
  handlePaste(event) {
    const clipboardData = event.clipboardData || window.clipboardData;
    const source = clipboardData.getData('text/html');
    const tableHTML = this.getTableHTML(source);
    const isTable = !!tableHTML;
    const isImage = !!(
      clipboardData &&
      clipboardData.items &&
      clipboardData.items.length &&
      clipboardData.items[0].type &&
      clipboardData.items[0].type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i));
    // handle table
    if (isTable && this.options.table) {
      setTimeout(this.insert(tableHTML, 'html'), 0)
    }
    // 处理图片
    else if(isImage && this.options.image) {
      this.readFiles(clipboardData.items)
        .then(files => {
          if (this.isUpload) {
            return this.uploadImage(files)
          }
          else {
            return Promise.resolve(files)
          }
        })
        .then(res => {
          let url;
          if (Array.isArray(res)) {
            url = res.map(_ => {
              return this.options.image.uploadCallback(_.data ? _.data : _)
            })
          }
          else {
            url = this.options.image.uploadCallback(res.data ? red.data : res)
          }
          this.insert(url)
        })
        .catch(err => {
          console.error('An error occurred during the upload process', err)
        });
    }
  }
  insert(content, type) {
    let range = this.quill.getSelection(true);
    this.quill.insertText(range.index, '\n', Quill.sources.USER);
    if (Array.isArray(content)) {
      content.forEach(cont => {
        if (type === 'html') {
          this.quill.insertEmbed(range.index + 1, 'dashboard', cont, Quill.sources.USER);
        }
        else {
          this.quill.insertEmbed(range.index + 1, 'image', cont, 'user');
        }
      })
    }
    else {
      type === 'html' ?
        this.quill.insertEmbed(range.index + 1, 'dashboard', content, Quill.sources.USER) :
        this.quill.insertEmbed(range.index + 1, 'image', content, 'user');
    }
    this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
  }
  getTableHTML(src) {
    const div = document.createElement('div');
    div.innerHTML = src;
    let tables = div.getElementsByTagName('table');
    if (!tables.length) return '';
    [].forEach.call(tables, (table) => {
      const tds = table.querySelectorAll('td');
      [].forEach.call(tds, td => {
        td.innerHTML = `<p>${td.innerText}</p>`
      })
    })
    return [].map.call(tables, (item) => item.outerHTML).join('');
  }
  readFiles(files) {
    return Promise.all([].map.call(files, file => new Promise((resolve, reject) => {
      if (!file.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp|vnd\.microsoft\.icon)/i)) {
        reject();
      }
      const blob = file.getAsFile ? file.getAsFile() : file;
      if (this.isUpload) {
        resolve(blob)
      }
      else {
        const reader = new FileReader();
        reader.onload = e => {
          resolve(e.target.result);
        };
        if (blob instanceof Blob) {
          reader.readAsDataURL(blob);
        }
      }
    })));
  }
  uploadImage(files) {
    if (Array.isArray(files)) {
      return Promise.all(files.map(file => {
        const data = new FormData();
        data.append(this.options.image.name, file);
        return axios.post(this.options.image.uploadUrl, data, {withCredentials: this.options.image.withCredentials})
      }))
    }
    const data = new FormData();
    data.append(this.options.image.name, files);
    return axios.post(this.options.image.uploadUrl, data, { withCredentials: this.options.image.withCredentials });
  }
}
