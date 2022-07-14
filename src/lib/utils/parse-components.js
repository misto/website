import { visit } from "unist-util-visit";
import { commentMarker } from "mdast-comment-marker";

export default () => (tree) => {
  visit(tree, (node) => {
    const isComment = commentMarker(node);
    if (isComment) {
      node.type = "html";
      node.value = `<Test value="test"/>`;
    }
  });
  return tree;
};
