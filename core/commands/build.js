const { Command } = require("commander");
const fsDefault = require("fs");
const fs = require("fs/promises");
const path = require("path");
const files = require("../modules/files.js");
const build = require("../modules/build.js");

module.exports = new Command("build")
  .description("Builds up to you the html side. (compiles)")
  .action(async () => {
    const currentPath = process.cwd();

    const validade = await files.validate(currentPath);
    if (!validade[0]) {
      return console.error("[error] " + validade[1]);
    }
    const configs = files.getSettings(currentPath);
    await files.checks(configs.settings);

    await build(currentPath, configs, true);
  });
