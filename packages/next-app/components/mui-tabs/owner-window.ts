import ownerDocument from './owner-document';

export default function ownerWindow(node: Node | null) {
  const doc = ownerDocument(node);
  return doc.defaultView || window;
}
