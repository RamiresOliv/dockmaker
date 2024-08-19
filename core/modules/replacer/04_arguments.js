const fs = require("fs");
const path = require("path");
module.exports = (pwd, configs, str, defaultReplaces, compilation) => {
  for (const i in configs.book.includes) {
    const pattern = new RegExp(`\\$\\{${i}\\}`, "g");
    const replacement = configs.book.includes[i]
      ? configs.book.includes[i]
      : "";
    str = str.replace(pattern, replacement);
  }

  return str;
};
