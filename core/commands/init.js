const { Command } = require("commander");
const color = require("colors-cli");
const inquirer = require("inquirer");
const fsDefault = require("fs");
const fs = require("fs/promises");
const path = require("path");
const bfs = require("../modules/bfs.js");
const files = require("../modules/files.js");

module.exports = new Command("init")
  .description("starts a new dockmaker project.")
  .option("-n, --name", "Project name")
  .option("-b, --blank", "blank project")
  .option(
    "-f, --fix [skips]",
    "fix files in project [skips]: 0 refuse | 1 missing files only | 2 all files",
    parseInt
  )
  .action(async (options) => {
    const currentPath = process.cwd();
    const project_template = await fs.readdir(
      __dirname + "/../templates/project"
    );

    const isNumber = typeof options.fix == "number";
    if ((options.fix && options.fix == true) || (options.fix && isNumber)) {
      console.clear();
      console.log("you wish run a search for missing files?");
      console.log("this command will make effect in: " + currentPath);
      let doFixA = null;

      if (!isNumber) {
        doFixA = await inquirer.default.prompt([
          {
            type: "confirm",
            name: "confirmation",
            message: "run fix?",
          },
        ]);
      } else {
        if (options.fix > 0) {
          doFixA = { confirmation: true };
        } else {
          doFixA = { confirmation: false };
        }
      }

      if (doFixA.confirmation == true) {
        console.log(
          `before fix, do you wish to ${color.bold("delete")} the ${color.bold(
            "all"
          )} the files and replace they all? ${color.italic(
            "(doesn't applies to folders)"
          )}`
        );
        console.log(
          color.yellow(
            color.underline(
              "WARNING: You will lose all the current json datas."
            )
          )
        );
        let doReplaceFixA = null;
        if (!isNumber) {
          doReplaceFixA = await inquirer.default.prompt([
            {
              type: "confirm",
              name: "confirmation",
              default: false,
              message: "replace all?",
            },
          ]);
        } else {
          if (options.fix > 1) {
            doReplaceFixA = { confirmation: true };
          } else {
            doReplaceFixA = { confirmation: false };
          }
        }

        console.clear();
        if (doReplaceFixA.confirmation == true) {
          await project_template.forEach(async (child) => {
            const child_path = path.join(
              __dirname + "/../templates/project",
              child
            );
            const child_stat = await fs.stat(child_path);
            if (child_stat.isFile()) {
              const inProjectPath = path.join(currentPath, child);
              if (fsDefault.existsSync(inProjectPath)) {
                await fs.unlink(inProjectPath);
                console.log("[-] Removed: " + inProjectPath);
              }
            }
          });
        }
        await project_template.forEach(async (child) => {
          const child_path = path.join(
            __dirname + "/../templates/project",
            child
          );
          const target_path = path.join(currentPath, child);
          const inProjectPath = path.join(currentPath, child);
          const stat = await fs.stat(child_path);

          if (!fsDefault.existsSync(inProjectPath)) {
            if (stat.isFile()) {
              await fs.copyFile(child_path, target_path);
            } else {
              await bfs.copyDir(child_path, target_path);
            }

            console.log("[+] Build: " + target_path);
          }
        });

        console.log("[:] Done. ");
      } else {
        console.log("[x] Action refused.");
      }
      return;
    }

    const validade = await files.validate(currentPath);
    if (!validade[0]) {
      await project_template.forEach(async (child) => {
        const child_path = path.join(
          __dirname + "/../templates/project",
          child
        );
        const target_path = path.join(currentPath, child);
        const stat = await fs.stat(child_path);

        if (stat.isFile()) {
          await fs.copyFile(child_path, target_path);
        } else {
          await bfs.copyDir(child_path, target_path);
        }

        console.log("[+] Build: " + target_path);
      });
      console.log("[:] Done. ");
      console.log("[:] Next step, start a server! 'dockmaker serve' ");
    } else {
      console.log("[error] directory not empty.");
    }
  });
