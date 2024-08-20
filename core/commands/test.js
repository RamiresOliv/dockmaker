const { Command } = require("commander");
const fsDefault = require("fs");
const fs = require("fs/promises");
const path = require("path");
const files = require("../modules/files.js");
const build = require("../modules/build.js");

module.exports = new Command("test")
  .description("test things.")
  .action(async () => {
    const currentPath = process.cwd();
    console.log(files.validate(currentPath));
  });
