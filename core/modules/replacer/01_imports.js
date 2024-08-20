const fsDefault = require("fs");
const fs = require("fs/promises");
const path = require("path");
module.exports =async (pwd, configs, str, defaultReplaces, compilation) => {
  return await str.replace(/\$\{import:([^\}]+)\}/g, async (match, p1) => {
    const [filePath, exportName] = p1.split(":");
    const caminhoArquivo = path.resolve(
      path.join(pwd, configs.settings.includes.dir),
      filePath
    );

    if (fsDefault.existsSync(caminhoArquivo)) {
      if (path.extname(caminhoArquivo) == ".js") {
        return (
          `<script> ` +
          (await fs.readFile(caminhoArquivo)).toString() +
          ` </script>`
        );
      } else if (path.extname(caminhoArquivo) == ".css") {
        return (
          `<style> ` + (await fs.readFile(caminhoArquivo)).toString() + ` </style>`
        );
      } else {
        return (await fs.readFile(caminhoArquivo)).toString();
      }
    } else {
      return `<script>console.warn('[dockmaker:importer:error] file "${filePath}" not found in includes.')</script>`;
    }
  });
};
