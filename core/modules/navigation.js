const fsDefault = require("fs");
const fs = require("fs/promises");
const path = require("path");
const bfs = require("./bfs");

module.exports = async (pwd, configs, str, defaultReplaces, compilation) => {
  if (configs.book.navigation.enabled == false) return str;
  async function formatFilesInDirectory(directory, prefix = "", level = 1) {
    let result = [];
    let fileIndex = 2;
    const index_path = path.join(directory, "index.md");

    if (fsDefault.existsSync(index_path)) {
      fileIndex = 1;
    }

    const files = await fs.readdir(directory);

    for (const file of files) {
      let filePathDefault = path.join(directory, file).replace(src + "\\", "");
      let rightPATH = filePathDefault
        .replace(new RegExp(" ", "g"), "-")
        .replace(/\\/g, "/");
      let rightNAME = path.basename(file);

      if (configs.book.navigation.whitelist[0] != "*") {
        for (const v of configs.book.navigation.whitelist) {
          rightPATH = rightPATH.replace(new RegExp(v, "g"), "");
        }
        for (const v of configs.book.navigation.whitelist) {
          rightNAME = rightNAME.replace(new RegExp(v, "g"), "");
        }
      }

      function validDir(name) {
        return !configs.book.navigation.blacklist_dir.some(
          (v) => name.toLowerCase() === v
        );
      }

      function validExt(ext) {
        if (configs.book.navigation.whitelist[0] == "*") return true;
        return configs.book.navigation.whitelist.some(
          (v) => ext.toLowerCase() === v
        );
      }

      const filePath = path.join(directory, file);
      const fileStat = await fs.stat(filePath);
      const newPrefix = prefix ? `${prefix}.${fileIndex}` : `${fileIndex}`;
      const marginLeft = (level - 1) * 20;

      if (fileStat.isDirectory()) {
        if (validDir(file)) {
          result.push(
            `<li style="margin-left: ${marginLeft}px"><a href="\${book_url}/${rightPATH}">${newPrefix}. ${rightNAME}</a></li>`
          );
          result = result.concat(
            await formatFilesInDirectory(filePath, newPrefix, level + 1)
          );
          fileIndex++;
        }
      } else if (validExt(path.extname(file))) {
        if (rightNAME.toLowerCase() !== "index") {
          result.push(
            `<li style="margin-left: ${marginLeft}px"><a href="\${book_url}/${rightPATH}">${newPrefix}: ${rightNAME}</a></li>`
          );
          fileIndex++;
        }
      }
    }

    return result;
  }

  const src = path.join(pwd, configs.settings.src.dir);
  const output = path.join(pwd, configs.settings.output.dir);
  const nav_send = [];
  nav_send.push('<li><a href="${book_url}">1:: home</a></li>');

  const files = await formatFilesInDirectory(src);
  for (const v of files) {
    nav_send.push(v);
  }

  const page_nav_items = new RegExp(`\\$\\{core-book_nav_items\\}`, "g");
  return str.replace(page_nav_items, nav_send.join("\n"));
};

/*
          <li>Item 1</li>
          <li>
            Item 2
            <ul>
              <li>Subitem 2.1</li>
              <li>Subitem 2.2</li>
              <li>Subitem 2.3</li>
            </ul>
          </li>
          <li>Item 3</li>
*/

/*
if (!path.basename(child).toLowerCase().startsWith("index")) {
      let rightPATH = ohmygod.replace(new RegExp(" ", "g"), "-");
      let rightNAME = path.basename(child);

      if (configs.book.navigation.whitelist[0] != "*") {
        configs.book.navigation.whitelist.forEach((v) => {
          rightPATH = rightPATH.replace(new RegExp(v, "g"), "");
        });
        configs.book.navigation.whitelist.forEach((v) => {
          rightNAME = rightNAME.replace(new RegExp(v, "g"), "");
        });
      }

      function validDir(name) {
        let found = true;
        configs.book.navigation.blacklist_dir.forEach((v) => {
          if (name.toLowerCase() == v) {
            found = false;
            return;
          }
        });

        return found;
      }
      function validExt(ext) {
        if (configs.book.navigation.whitelist[0] == "*") return true;

        let found = false;
        configs.book.navigation.whitelist.forEach((v) => {
          if (ext.toLowerCase() == v) {
            found = true;
            return;
          }
        });

        return found;
      }

      function doit() {
        if (last && path.basename(path.dirname(child)) == path.basename(last)) {
          nav_erar.push(
            '<li style=" margin-left: 20px"><a href="${book_url}/' +
              rightPATH +
              '">' +
              (I_base - 1) +
              "." +
              folder_I +
              ". " +
              rightNAME +
              "</a></li>"
          );
          folder_I += 1;
        } else {
          if (validDir(path.basename(child))) {
            if (stat.isDirectory()) {
              folder_I = 1;
              last = child;
            }
            nav_erar.push(
              '<li><a href="${book_url}/' +
                rightPATH +
                '">' +
                I_base +
                ". " +
                rightNAME +
                "</a></li>"
            );
            I_base += 1;
          }
        }
      }
      if (stat.isFile() && validExt(ext)) {
        doit();
      } else if (stat.isDirectory()) {
        doit();
      }
    }
*/
