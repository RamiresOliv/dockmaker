const fsDefault = require("fs");
const fs = require("fs/promises");
const path = require("path");
const readline = require("readline");

async function copyDirectory(src, dest) {
  const baseDirName = path.basename(src);
  const destPath = dest.endsWith(baseDirName)
    ? dest
    : path.join(dest, baseDirName);

  await fs.mkdir(destPath, { recursive: true });

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const targetPath = path.join(destPath, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, targetPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, targetPath);
    }
  }
}

exports.copyDir = async (src, dest) => {
  await copyDirectory(src, dest);
};

exports.readFullDir = async (dir) => {
  const result = [];

  async function readDir(currentPath) {
    const items = await fs.readdir(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        // if (item.startsWith("_")) {
        //   return;
        // }
        result.push(fullPath);
        await readDir(fullPath);
      } else if (stats.isFile()) {
        result.push(fullPath);
      }
    }
  }

  await readDir(dir);
  return result;
};

exports.readFileLines = (filePath, newLineListener, closeListener) => {
  const rl = readline.createInterface({
    input: require("fs").createReadStream(filePath),
    crlfDelay: Infinity,
  });

  if (newLineListener) rl.on("line", newLineListener);
  if (closeListener) rl.on("close", closeListener);
};
