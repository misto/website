import { visit } from "unist-util-visit";

export default () => (tree, vFile) => {
  visit(tree, (node) => {
    if (node.tagName === "a") {
      // resolve "index" in relative paths
      if (
        node.properties.href.includes("index") &&
        node.properties.href.startsWith(".")
      ) {
        const version = vFile.data.fm.filepath
          .split("/")
          .slice(-2)
          .reverse()
          .pop();
        const newPath = node.properties.href.replace("index", `../${version}`);
        node.properties.href = newPath;
      }
    }
  });
  return tree;
};
