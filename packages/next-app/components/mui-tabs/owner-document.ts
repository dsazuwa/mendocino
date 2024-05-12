export default function ownerDocument(node: Node | null) {
  return (node && node.ownerDocument) || document;
}
