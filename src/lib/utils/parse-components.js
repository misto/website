import { visit } from "unist-util-visit";
import { commentMarker } from "mdast-comment-marker";

export default () => (tree) => {
  visit(tree, (node) => {
    const comment = commentMarker(node);
    if (comment && comment.name === "Component") {
      node.type = "html";
      node.value = `<${comment.attributes}/>`;
    }
  });
  return tree;
};
