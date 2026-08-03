"use strict";
const autoprefixer = require("autoprefixer");
const fs = require("fs");
const packageJSON = require("../package.json");
const upath = require("upath");
const postcss = require("postcss");
const sass = require("sass");
const sh = require("shelljs");

const stylesPath = upath.resolve(upath.dirname(__filename), "../src/scss/styles.scss");
const destPath = upath.resolve(upath.dirname(__filename), "../css/styles.css");

const banner = `/*!
* Start Bootstrap - ${packageJSON.title} v${packageJSON.version} (${packageJSON.homepage})
* Copyright 2013-${new Date().getFullYear()} ${packageJSON.author}
* Licensed under ${packageJSON.license} (https://github.com/StartBootstrap/${packageJSON.name}/blob/master/LICENSE)
*/
`;

module.exports = function renderSCSS() {
  const results = sass.compile(stylesPath, {
    loadPaths: [upath.resolve(upath.dirname(__filename), "../node_modules")],
    silenceDeprecations: ["import", "global-builtin", "color-functions"],
  });

  const destPathDirname = upath.dirname(destPath);
  if (!sh.test("-e", destPathDirname)) {
    sh.mkdir("-p", destPathDirname);
  }

  postcss([autoprefixer])
    .process(banner + results.css, { from: "styles.css", to: "styles.css" })
    .then((result) => {
      result.warnings().forEach((warn) => {
        console.warn(warn.toString());
      });
      fs.writeFileSync(destPath, result.css.toString());
    });
};