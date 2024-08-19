const fs = require("fs");
const path = require("path");
const readline = require("readline");

async function copyDirectory(src, dest) {
  const baseDirName = path.basename(src);
  const destPath = dest.endsWith(baseDirName)
    ? dest
    : path.join(dest, baseDirName);

  await fs.promises.mkdir(destPath, { recursive: true });

  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const targetPath = path.join(destPath, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, targetPath);
    } else if (entry.isFile()) {
      await fs.promises.copyFile(srcPath, targetPath);
    }
  }
}

exports.copyDir = async (src, dest) => {
  await copyDirectory(src, dest);
};

exports.readFullDir = (dir) => {
  const result = [];

  function readDir(currentPath) {
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      const fullPath = path.join(currentPath, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        // if (item.startsWith("_")) {
        //   return;
        // }
        result.push(fullPath);
        readDir(fullPath);
      } else if (stats.isFile()) {
        result.push(fullPath);
      }
    });
  }

  readDir(dir);
  return result;
};

exports.readFileLines = (filePath, newLineListener, closeListener) => {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  if (newLineListener) rl.on("line", newLineListener);
  if (closeListener) rl.on("close", closeListener);
};
