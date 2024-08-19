const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const files = require("../modules/files.js");
const build = require("../modules/build.js");

module.exports = new Command("guide")
  .description("Informations about how to use.")
  .action(() => {
    console.log("Visite the dockmaker online manual:");
  });
