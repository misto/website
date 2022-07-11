import { visit } from "unist-util-visit";

export default () => (tree, vFile) => {
  visit(tree, (node) => {
    if (node.tagName === "a") {
      // resolve "index" in relative paths
      if (
        node.properties.href.includes("index") &&
        !vFile.data.fm.filepath.includes("helm") &&
        vFile.data.fm.filepath.includes("docs") &&
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

      //resolve "latest" in relative paths
      if (
        node.properties.href.includes("latest") &&
        !vFile.data.fm.filepath.includes("helm") &&
        vFile.data.fm.filepath.includes("docs") &&
        node.properties.href.startsWith(".")
      ) {
        const version = vFile.data.fm.filepath
          .split("/")
          .slice(-2)
          .reverse()
          .pop();
        const newPath = node.properties.href.replace("latest", `${version}`);
        node.properties.href = newPath;
      }
    }
  });
  return tree;
};
