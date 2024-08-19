const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const files = require("../modules/files.js");
const build = require("../modules/build.js");

module.exports = new Command("build")
  .description("compiles all src files")
  .action(async () => {
    const currentPath = process.cwd();

    const validade = await files.validate(currentPath);
    if (!validade[0]) {
      return console.error("[error] " + validade[1]);
    }

    const configs = files.getSettings(currentPath);
    files.checks(configs.settings);

    build(currentPath, configs, true);
  });
