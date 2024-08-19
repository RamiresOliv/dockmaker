const fs = require("fs");
const path = require("path");
module.exports = (pwd, configs, str, defaultReplaces, compilation) => {
  return str.replace(/\$\{import:([^\}]+)\}/g, (match, p1) => {
    const [filePath, exportName] = p1.split(":");
    const caminhoArquivo = path.resolve(
      path.join(pwd, configs.settings.includes.dir),
      filePath
    );

    if (fs.existsSync(caminhoArquivo)) {
      if (path.extname(caminhoArquivo) == ".js") {
        return (
          `<script> ` +
          fs.readFileSync(caminhoArquivo).toString() +
          ` </script>`
        );
      } else if (path.extname(caminhoArquivo) == ".css") {
        return (
          `<style> ` + fs.readFileSync(caminhoArquivo).toString() + ` </style>`
        );
      } else {
        return fs.readFileSync(caminhoArquivo).toString();
      }
    } else {
      return `<script>console.warn('[dockmaker:importer:error] file "${filePath}" not found in includes.')</script>`;
    }
  });
};
