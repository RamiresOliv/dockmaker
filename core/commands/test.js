const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const files = require("../modules/files.js");
const build = require("../modules/build.js");

module.exports = new Command("test").description("test things.").action(() => {
  const currentPath = process.cwd();
  console.log(files.validate(currentPath));
});
