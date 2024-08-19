const fs = require("fs");
const path = require("path");
module.exports = (pwd, configs, str, defaultReplaces, compilation) => {
  if (compilation) {
    const page_content_pattern = new RegExp(`\\$\\{page_content\\}`, "g");
    return str.replace(page_content_pattern, compilation.join("\n"));
  } else {
    return str;
  }
};
