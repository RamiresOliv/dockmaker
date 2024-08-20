const path = require("path");
const fsDefault = require("fs");
const fs = require("fs/promises");
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

async function work(pwd, configs, child, target, talk, customPort) {
  const output_dir = path.join(pwd, configs.settings.output.dir);
  const src_dir = path.join(pwd, configs.settings.src.dir);

  const stat = await fs.stat(child);
  const fileExt = path.extname(child);

  if (stat.isFile()) {
    if (fileExt.toLowerCase() == ".md") {
      compile(child, async (compilation) => {
        let base_html = (
          await fs.readFile(path.join(templates, "base.html"))
        ).toString();
        let translated = await replaces(
          pwd,
          configs,
          base_html,
          compilation,
          child,
          customPort
        );
        translated = await replaces(
          pwd,
          configs,
          translated,
          null,
          child,
          customPort
        );

        await fs.appendFile(
          path
            .join(output_dir, child.replace(src_dir + "\\", ""))
            .replace(".md", ".html")
            .replace(new RegExp(" ", "g"), "-"),
          Buffer.from(translated)
        );
      });
    } else if (fileExt.toLowerCase() == ".html") {
      const translated = await replaces(
        pwd,
        configs,
        await fs.readFile(child),
        null,
        child,
        customPort
      );

      await fs.appendFile(
        path
          .join(output_dir, child.replace(src_dir + "\\", ""))
          .replace(".md", ".html")
          .replace(new RegExp(" ", "g"), "-"),
        Buffer.from(translated)
      );
    } else {
      await fs.copyFile(child, target);
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
    await fs.mkdirSync(
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
  await fs.readdir(output_dir).forEach(async (v) => {
    await fs.rm(path.join(output_dir, v), {
      recursive: true,
      force: true,
    });
  });

  await bfs.readFullDir(src_dir).forEach(async (child) => {
    const stat = await fs.stat(child);
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
        await fs.mkdir(path.join(output_dir, name));

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
  if (!fsDefault.existsSync(indexPath)) {
    console.log("[!] Required attention: Missing index.md");
  }
  const faviconPath = path.join(pwd, "favicon.ico");
  if (fsDefault.existsSync(faviconPath)) {
    fs.copyFile(faviconPath, path.join(output_dir, "favicon.ico"));
  } else {
    console.log("[?] Missing favicon.ico");
  }

  const err404Path = path.join(pwd, "404.html");
  if (fsDefault.existsSync(err404Path)) {
    const content = await replaces(
      pwd,
      configs,
      (await fs.readFile(err404Path)).toString(),
      null,
      err404Path,
      customPort
    );

    await fs.appendFile(path.join(output_dir, "404.html"), content);
  } else {
    console.log("[?] Missing 404.html");
  }

  await fs.readdir(includes).forEach(async (child) => {
    const filePath = path.join(includes, child);
    const fileStat = await fs.stat(filePath);

    if (!child.startsWith("_") && !child.startsWith("!")) {
      if (fileStat.isFile()) {
        await fs.copyFile(filePath, path.join(output_dir, child));
      } else {
        await bfs.copyDir(filePath, path.join(output_dir, child));
      }
    }
  });
};
