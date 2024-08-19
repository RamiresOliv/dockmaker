const fs = require("fs");
const path = require("path");
const colors = require("colors-cli");

const jsonMaps = path.join(__dirname, "/../configs");

function compareJsonMap(jsonPath) {
  const json = JSON.parse(fs.readFileSync(jsonPath).toString());
  const map = JSON.parse(
    fs.readFileSync(path.join(jsonMaps, path.basename(jsonPath))).toString()
  );

  function work(data, mapdat) {
    if (typeof data == "object" && mapdat != "object") {
      for (const i in mapdat) {
        if (!data[i]) {
          if (typeof data[i] == "string" && data[i] == "") continue;
          return [false, `[JSON:MISSING] missing in json: ${i}`];
        }
        if (mapdat != "object") {
          const a = work(data[i], mapdat[i]);
          if (a[0] == false) return [false, a[1]];
        }
      }
    } else if (typeof data != mapdat) {
      return [
        false,
        `[JSON:INVALID] ivalid json, expected "${mapdat}" received "${typeof data}" value: "${data}"`,
      ];
    }

    return [true];
  }

  for (const i in map) {
    if (json[i]) {
      const a = work(json[i], map[i]);
      if (a[0] == false) return [false, a[1]];
    } else {
      if (typeof json[i] == "string" && json[i] == "") continue;
      return [false, `[JSON:MISSING] missing in json: ${i}`];
    }
  }

  return [true];
}
// dance in the dark
exports.validate = async (dir) => {
  let isMissing = false;
  let missingFiles = [];
  let files = ["settings.json", "book.json"];

  files.forEach((file) => {
    if (!fs.existsSync(path.join(dir, file))) {
      isMissing = true;
      missingFiles.push(file);
    }
  });

  if (isMissing)
    return [
      false,
      colors.red(
        `missing necessary ${
          missingFiles.length > 1 ? "files" : "file"
        }: ${missingFiles.join(", ")}\ntry fix: 'dockmaker init --fix 1'`
      ),
    ];

  const r_settings = compareJsonMap(path.join(dir, "settings.json"));
  if (r_settings[0] == false) {
    return [
      false,
      colors.red(
        "settings.json: " +
          r_settings[1] +
          `\ntry fix: 'dockmaker init --fix 2'`
      ),
    ];
  }

  const r_book = compareJsonMap(path.join(dir, "book.json"));
  if (r_book[0] == false) {
    return [
      false,
      colors.red(
        "book.json: " + r_book[1] + `\ntry fix: 'dockmaker init --fix 2'`
      ),
    ];
  }

  return [true];
};

exports.checks = async (settings) => {
  if (!settings)
    return console.error(
      colors.red("[error] null argument 'settings'. <- internal error")
    );
  if (!fs.existsSync(settings.output.dir)) {
    fs.mkdirSync(settings.output.dir);
  }
  if (!fs.existsSync(settings.src.dir)) {
    fs.mkdirSync(settings.src.dir);
  }
};

exports.getSettings = (dir) => {
  let settingsR = null;
  let bookR = null;

  const sp = path.join(dir, "settings.json");
  const bp = path.join(dir, "book.json");

  if (fs.existsSync(sp)) settingsR = require(sp);
  if (fs.existsSync(bp)) bookR = require(bp);

  return {
    settings: settingsR,
    book: bookR,
  };
};
