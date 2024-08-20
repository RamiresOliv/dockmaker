const { Command } = require("commander");
const fsDefault = require("fs");
const fs = require("fs/promises");
const path = require("path");
const colors = require("colors-cli");

module.exports = new Command("core")
  .description("Gets core stuff path.")
  .argument("[name]")
  .option(
    "-s, --silent",
    "Makes the command don't return you a warning mesage."
  )
  .action(async (name, options) => {
    if (!options || (options && !options.silent))
      console.log(
        colors.yellow(
          "WARNING: Make sure to before edit anything, create a backup of the file."
        )
      );
    const files = {
      core_includes: path.join(__dirname, "..", "includes"),
      core_templates: path.join(__dirname, "..", "templates"),
      core_templates_project: path.join(
        __dirname,
        "..",
        "templates",
        "project"
      ),
    };
    await fs.readdir(files.core_templates).then((v) =>
      v.forEach((child) => {
        files["core_tps:" + child.replace(path.extname(child), "")] = path.join(
          files.core_templates,
          child
        );
      })
    );

    if (!name || !files[name]) {
      console.log(colors.red("Invalid argument."));
      console.log(colors.magenta("Try use: dockmaker core [name]"));
      for (const i in files) {
        console.log(colors.italic("Expected: " + i));
      }
      if (name) console.log("But received: " + name);
      return;
    }
    console.log(files[name]);
  });
