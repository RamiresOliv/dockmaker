const fsDefault = require("fs");
const fs = require("fs/promises");
const path = require("path");

module.exports = async (pwd, configs, str, defaultReplaces, compilation) => {
  const matches = str.match(/\$\{import:([^\}]+)\}/g) || [];

  const replacements = await Promise.all(
    matches.map(async (match) => {
      const [filePath, exportName] = match.slice(9, -1).split(":"); // Remove ${import: e }
      const caminhoArquivo = path.resolve(
        path.join(pwd, configs.settings.includes.dir),
        filePath
      );

      if (fsDefault.existsSync(caminhoArquivo)) {
        const fileContent = await fs.readFile(caminhoArquivo);

        if (path.extname(caminhoArquivo) === ".js") {
          return {
            match,
            replacement: `<script> ${fileContent.toString()} </script>`,
          };
        } else if (path.extname(caminhoArquivo) === ".css") {
          return {
            match,
            replacement: `<style> ${fileContent.toString()} </style>`,
          };
        } else {
          return { match, replacement: fileContent.toString() };
        }
      } else {
        return {
          match,
          replacement: `<script>console.warn('[dockmaker:importer:error] file "${filePath}" not found in includes.')</script>`,
        };
      }
    })
  );

  replacements.forEach(({ match, replacement }) => {
    str = str.replaceAll(match, replacement);
  });

  return str;
};
