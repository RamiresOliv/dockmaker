module.exports = (pwd, configs, str, defaultReplaces, compilation) => {
  for (const i in defaultReplaces) {
    const pattern = new RegExp(`\\$\\{${i}\\}`, "g");
    const replacement = defaultReplaces[i] ? defaultReplaces[i] : "";
    str = str.replace(pattern, replacement);
  }

  return str;
};
