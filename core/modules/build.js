const path = require("path");
const fs = require("fs");
const bfs = require("./bfs");
const replaces = require("./replaces");
const markdownit = require("markdown-it");
const md = markdownit();

const includes = path.join(__dirname, "/../includes");
const templates = path.join(__dirname, "/../templates");

function compile(origen, callback) {
  let compilerResult = [];
  function onNewLine(line) {
    if (line.startsWith("<")) {
      compilerResult.push(line);
    } else {
      const a = md.render(line);
      compilerResult.push(a);
    }
  }
  bfs.readFileLines(origen, onNewLine, () => callback(compilerResult));
}

function work(pwd, configs, child, target, talk, customPort) {
  const output_dir = path.join(pwd, configs.settings.output.dir);
  const src_dir = path.join(pwd, configs.settings.src.dir);

  const stat = fs.statSync(child);
  const fileExt = path.extname(child);

  if (stat.isFile()) {
    if (fileExt.toLowerCase() == ".md") {
      compile(child, (compilation) => {
        let base_html = fs
          .readFileSync(path.join(templates, "base.html"))
          .toString();
        let translated = replaces(
          pwd,
          configs,
          base_html,
          compilation,
          child,
          customPort
        );
        translated = replaces(
          pwd,
          configs,
          translated,
          null,
          child,
          customPort
        );

        fs.appendFileSync(
          path
            .join(output_dir, child.replace(src_dir + "\\", ""))
            .replace(".md", ".html")
            .replace(new RegExp(" ", "g"), "-"),
          Buffer.from(translated)
        );
      });
    } else if (fileExt.toLowerCase() == ".html") {
      const translated = replaces(
        pwd,
        configs,
        fs.readFileSync(child),
        null,
        child,
        customPort
      );

      fs.appendFileSync(
        path
          .join(output_dir, child.replace(src_dir + "\\", ""))
          .replace(".md", ".html")
          .replace(new RegExp(" ", "g"), "-"),
        Buffer.from(translated)
      );
    } else {
      fs.copyFileSync(child, target);
    }
    if (talk == 1) {
      console.log(
        "[+] compiled: " +
          child.replace(src_dir, "") +
          " to " +
          child
            .replace(src_dir, "")
            .replace(".md", ".html")
            .replace(new RegExp(" ", "g"), "-")
      );
    } else if (talk != false) {
      console.log(
        "[+] compiled: " +
          child +
          " to " +
          path
            .join(output_dir, child.replace(src_dir + "\\", ""))
            .replace(".md", ".html")
            .replace(new RegExp(" ", "g"), "-")
      );
    }
  } else {
    fs.mkdirSync(
      path
        .join(output_dir, child.replace(src_dir + "\\", ""))
        .replace(".md", ".html")
        .replace(new RegExp(" ", "g"), "-")
    );
    if (talk == 1) {
      console.log(
        "[+] compiled: " +
          child +
          " to " +
          child
            .replace(src_dir, "")
            .replace(".md", ".html")
            .replace(new RegExp(" ", "g"), "-")
      );
    } else if (talk != false) {
      console.log(
        "[+] compiled: " +
          child +
          " to " +
          path
            .join(output_dir, child.replace(src_dir + "\\", ""))
            .replace(".md", ".html")
            .replace(new RegExp(" ", "g"), "-")
      );
    }
  }
}

module.exports = async (pwd, configs, talk, customPort) => {
  const src_dir = path.join(pwd, configs.settings.src.dir);
  const output_dir = path.join(pwd, configs.settings.output.dir);
  fs.readdirSync(output_dir).forEach((v) => {
    fs.rmSync(path.join(output_dir, v), {
      recursive: true,
      force: true,
    });
  });

  setTimeout(() => {
    bfs.readFullDir(src_dir).forEach((child) => {
      const stat = fs.statSync(child);
      const parent = path.dirname(child);
      const parentName = path.basename(parent);
      const name = path.basename(child);

      if (parent == src_dir) {
        if (stat.isFile()) {
          work(
            pwd,
            configs,
            child,
            path.join(output_dir, name),
            talk,
            customPort
          );
        } else {
          fs.mkdirSync(path.join(output_dir, name));

          if (talk == 1) {
            console.log(
              "[+] compiled: " +
                child.replace(src_dir, "") +
                " to " +
                child
                  .replace(src_dir, "")
                  .replace(".md", ".html")
                  .replace(new RegExp(" ", "g"), "-")
            );
          } else if (talk != false) {
            console.log(
              "[+] compiled: " + child + " to " + path.join(output_dir, name)
            );
          }
        }
      } else {
        work(
          pwd,
          configs,
          child,
          path.join(output_dir, parentName, name),
          talk,
          customPort
        );
      }
    });

    const indexPath = path.join(src_dir, "index.md");
    if (!fs.existsSync(indexPath)) {
      console.log("[!] Required attention: Missing index.md");
    }
    const faviconPath = path.join(pwd, "favicon.ico");
    if (fs.existsSync(faviconPath)) {
      fs.copyFileSync(faviconPath, path.join(output_dir, "favicon.ico"));
    } else {
      console.log("[?] Missing favicon.ico");
    }

    const err404Path = path.join(pwd, "404.html");
    if (fs.existsSync(err404Path)) {
      const content = replaces(
        pwd,
        configs,
        fs.readFileSync(err404Path).toString(),
        null,
        err404Path,
        customPort
      );

      fs.appendFileSync(path.join(output_dir, "404.html"), content);
    } else {
      console.log("[?] Missing 404.html");
    }

    fs.readdirSync(includes).forEach((child) => {
      const filePath = path.join(includes, child);
      const fileStat = fs.statSync(filePath);

      if (!child.startsWith("_") && !child.startsWith("!")) {
        if (fileStat.isFile()) {
          fs.copyFileSync(filePath, path.join(output_dir, child));
        } else {
          bfs.copyDir(filePath, path.join(output_dir, child));
        }
      }
    });
  }, 100);
};
