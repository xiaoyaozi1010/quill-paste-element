import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');
export default class PasteBlot extends BlockEmbed {
  static create(val) {
    console.log(val)
    let node = super.create();
    console.log(node);
    node.innerHTML = val;
    node.setAttribute('border', '1');
    node.setAttribute('width', '100%');
    node.setAttribute('bordercolor', '#000');
    node.setAttribute('cellpadding', '0');
    node.setAttribute('cellspacing', '0');
    return node
  }
  static value(domNode) {
    return domNode.innerHTML
  }
  constructor(domNode) {
    super(domNode)
  }
};
PasteBlot.blotName = 'paste-element';
PasteBlot.tagName = 'p';
