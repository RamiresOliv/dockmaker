const { Command } = require("commander");
const path = require("path");
const fsDefault = require("fs");
const fs = require("fs/promises");
const express = require("express");
const colors = require("colors-cli");

const bfs = require("../modules/bfs.js");
const build = require("../modules/build.js");
const files = require("../modules/files.js");
const replaces = require("../modules/replaces.js");

module.exports = new Command("serve")
  .description("start a localhost server")
  .option(
    "-b, --build <boolean>",
    "accept or decline build before servers open."
  )
  .option("-p, --port <port>", "port host ex: 4000", parseInt)
  .option("-s, --silent [true|false]", "enable or disable others outputs")
  .option(
    "-w, --watch <boolean>",
    "enable or disable auto build when files changed."
  )
  .action(async (options) => {
    const currentPath = process.cwd();
    const validade = await files.validate(currentPath);
    if (!validade[0]) {
      return console.error("[error] " + validade[1]);
    }
    await files.checks(configs.settings);
    const configs = files.getSettings(currentPath);
    const output_dir = path.join(currentPath, configs.settings.output.dir);
    const src_dir = path.join(currentPath, configs.settings.src.dir);
    const app = express();
    app.use(express.static(output_dir));

    // lets go
    console.clear();
    if (
      (options && !options.build) ||
      (options && options.build && options.build == "true")
    ) {
      console.log(colors.italic("[*] build init (done)"));
      await build(currentPath, configs, false, options.port || null);
    }

    console.log(colors.green_bbt("[>] server woke:"));

    let port = configs.settings.localhost.port;
    if (options && options.port) {
      port = options.port;
    }

    app.listen(port);
    app.get("*", async (req, res) => {
      let paaath = req.path;

      if (paaath == "/") {
        let emptyData = (
          await fs.readFile(path.join(__dirname, "/../templates/empty.html"))
        ).toString();

        emptyData = await replaces(
          currentPath,
          configs,
          emptyData,
          null,
          src_dir
        );
        return res.send(emptyData);
      } else {
        if (paaath.endsWith("/")) {
          paaath = paaath.slice(0, -1);
        }

        const file = path.join(output_dir, paaath + ".html");
        if (!fsDefault.existsSync(path.join(output_dir, paaath + ".html"))) {
          let path404 = path.join(__dirname, "/../templates/error.html");

          const what = path.join(output_dir, "404.html");
          if (fsDefault.existsSync(what)) path404 = what;
          let error = (await fs.readFile(path404)).toString();

          error = error.replace(
            new RegExp("HOME_URL", "g"),
            "http://127.0.0.1:" + port
          );
          error = error.replace(
            new RegExp("ERROR_TITLE", "g"),
            `Dockmaker: 404`
          );
          error = error.replace(
            new RegExp("ERROR_DATA_INFO", "g"),
            `path not found "${req.path}"`
          );
          if (!options.silent || (options.silent && options.silent == "false"))
            console.log(
              colors.yellow(`[?] Not found: ${req.method} ${req.path}`)
            );
          return res.status(404).send(error);
        }

        if (!options.silent || (options.silent && options.silent == "false"))
          console.log(`[:] File access: ${req.method} ${req.path}`);
        return res.sendFile(file);
      }
    });
    app.use(async (err, req, res, next) => {
      let error = (
        await fs.readFile(path.join(__dirname, "/../templates/error.html"))
      ).toString();
      error = error.replace(
        new RegExp("HOME_URL", "g"),
        "http://127.0.0.1:" + port
      );
      error = error.replace(
        new RegExp("ERROR_TITLE", "g"),
        `Dockmaker: Server internal error`
      );
      console.log(colors.red(`[!] Error: ${req.method} ${req.path} >= 500`));
      console.log(err.stack);
      error = error.replace(new RegExp("ERROR_DATA_INFO", "g"), err);
      res.status(500).send(error);
    });

    let watchs = [];

    async function loadListeners() {
      const read = await bfs.readFullDir(src_dir);
      watchs.push(
        fs.watch(src_dir, async () => {
          await changed(src_dir);
        })
      );
      read.forEach((file) => {
        try {
          const watcher = fs.watch(file, async () => {
            await changed(file);
          });
          watcher.on("error", (error) => {
            if (error.code === "ENOENT" || error.code === "EPERM") {
              watcher.close();
            } else {
              console.error("[!] watcher unexpected error:", error);
            }
          });
          watchs.push(watcher);
        } catch (error) {
          console.log(colors.red("[!] WATCHER FATAL ERROR: " + error));
        }
      });
    }

    let working = true;
    async function changed(fileName) {
      watchs.forEach((v) => {
        v.close();
      });
      watchs = [];
      if (working) {
        console.log(colors.yellow("[!] Build rate-limited."));
      } else {
        console.log(
          colors.magenta("[*] Changes detected in: " + path.basename(fileName))
        );
        working = true;
        try {
          await build(currentPath, configs, false, options.port || null);
          console.log(colors.cyan_bt("[*] Last build was successful."));
          working = false;
        } catch (error) {
          console.log(colors.red("[!] Last build error: " + error));
        }
      }
      loadListeners();
    }

    console.log(
      `[:] server lauched: ${colors.magenta(`http://127.0.0.1:${port}`)}`
    );
    console.log("[:] express server & dockmaker output:");

    if (
      (options && !options.watch) ||
      (options && options.watch && options.watch != "false")
    ) {
      console.log(colors.green("[:] File watcher is enabled in: " + src_dir));
      loadListeners();
      setTimeout(() => {
        working = false;
      }, 300);
    }
  });

/*
    app.use((req, res, next) => {
      let path404 = path.join(__dirname, "/../templates/error.html");

      const what = path.join(output_dir, "404.html");
      console.log(what);
      if (fs.existsSync(what)) {
        path404 = what;
        console.log("aaaaaaaaaaaaaa");
      }

      let error = fs.readFileSync(path404).toString();

      error = error.replace(
        new RegExp("HOME_URL", "g"),
        "http://127.0.0.1:" + port
      );
      error = error.replace(new RegExp("ERROR_TITLE", "g"), `Dockmaker: 404`);
      error = error.replace(
        new RegExp("ERROR_DATA_INFO", "g"),
        `path not found "${req.path}"`
      );
      console.log(`Access: ${req.method} ${req.path} = 404`);
      res.status(404).send(error);
    }); */
