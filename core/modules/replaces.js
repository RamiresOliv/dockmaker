const path = require("path");

module.exports = (pwd, configs, str, compilation, origin, port) => {
  const output_dir = path.join(pwd, configs.settings.output.dir);
  const src_dir = path.join(pwd, configs.settings.src.dir);

  let url = configs.book.url;
  let Poerta = port || configs.settings.localhost.port || 6555;
  if (url == "") {
    url = "http://localhost:" + Poerta.toString();
  }
  if (url.endsWith("/")) {
    url = configs.book.url.slice(0, -1);
  }
  let pName = path.basename(origin).replace(path.extname(origin), "");
  let parent = path.basename(path.dirname(origin));
  if (path.dirname(origin) == src_dir) {
    parent = "home";
  }
  if (pName == "index") pName = parent;

  let defaultReplaces = {
    book_name: configs.book.name,
    book_description: configs.book.description,
    book_url: url,
    page_name: pName,
    page_output_path: path
      .join(output_dir, origin.replace(src_dir + "\\", ""))
      .replace(".md", ".html"),
    page_src_path: origin,
    page_path: origin.replace(src_dir + "\\", ""),
    author_github: configs.book.author.github,
    author_name: configs.book.author.name,
  };

  str = require("./navigation")(
    pwd,
    configs,
    str,
    defaultReplaces,
    compilation
  );

  const replacer_dir = path.join(__dirname, "replacer");
  require("fs")
    .readdirSync(replacer_dir)
    .forEach((v) => {
      const what = path.join(replacer_dir, v);
      str = require(what)(pwd, configs, str, defaultReplaces, compilation);
    });

  return str;
};

/*
base_html = base_html.replace(/\$\{import:([^\}]+)\}/g, (match, p1) => {
        const [filePath, exportName] = p1.split(":");
        const caminhoArquivo = path.resolve(
          path.join(pwd, configs.settings.includes.dir),
          filePath
        );

        if (fs.existsSync(caminhoArquivo)) {
          return (
            `<script> ` +
            fs.readFileSync(caminhoArquivo).toString() +
            ` </script>`
          );
        } else {
          return `[file "${filePath}" not found in includes.]`;
        }
      });

      const page_content_pattern = new RegExp(`\\$\\{page_content\\}`, "g");
      base_html = base_html.replace(
        page_content_pattern,
        compilerResult.join("\n")
      );

      for (const i in datas) {
        const pattern = new RegExp(`\\$\\{${i}\\}`, "g");
        const replacement = datas[i] ? datas[i] : "";
        base_html = base_html.replace(pattern, replacement);
      }
*/
