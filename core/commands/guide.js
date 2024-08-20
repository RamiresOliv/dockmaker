const { Command } = require("commander");
const fsDefault = require("fs");
const fs = require("fs/promises");
const path = require("path");
const files = require("../modules/files.js");
const build = require("../modules/build.js");

module.exports = new Command("guide")
  .description("Manual of Dockmaker.")
  .action(async () => {
    console.log("Visite the dockmaker online manual:");
  });
