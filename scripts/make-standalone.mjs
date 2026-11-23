// Builds ONE self-contained HTML file (no internet, no server needed) from the normal build in dist/.
// Usage: npm run standalone   ->  standalone/Tata-Service-Status-Portal.html
// The code is inlined as a plain (non-module) script, which the widest range of viewers and browsers accept.
import fs from "node:fs";

const html0 = fs.readFileSync("dist/index.html", "utf8");
const jsName = html0.match(/<script type="module" crossorigin src="\.\/assets\/([^"]+\.js)"><\/script>/)?.[1];
const cssName = html0.match(/<link rel="stylesheet" crossorigin href="\.\/assets\/([^"]+\.css)">/)?.[1];
if (!jsName || !cssName) throw new Error("Could not find the built JS/CSS in dist/index.html. Run `npm run build` first.");

const js = fs.readFileSync(`dist/assets/${jsName}`, "utf8");
const css = fs.readFileSync(`dist/assets/${cssName}`, "utf8");
if (/^\s*(import|export)\s/m.test(js) || js.includes("import.meta")) {
  throw new Error("The bundle uses module syntax (import/export/import.meta); it cannot be inlined as a plain script.");
}

let html = html0
  .replace(/\s*<script type="module" crossorigin src="[^"]+"><\/script>/, () => "")
  .replace(/<link rel="stylesheet" crossorigin href="[^"]+">/, () => `<style>\n${css}\n</style>`)
  // `</script` inside the code would end the tag early
  .replace("</body>", () => `<script>\n(function(){"use strict";\n${js.replaceAll("</script", "<\\/script")}\n})();\n</script>\n  </body>`);

if (html.includes("./assets/") || html.includes("cdn.tailwindcss")) throw new Error("External file references are still in the page.");
if (html.replace("<!doctype html>", "").includes("<!--")) throw new Error("The page contains an HTML comment marker; it can confuse the script parser.");

fs.mkdirSync("standalone", { recursive: true });
fs.writeFileSync("standalone/Tata-Service-Status-Portal.html", html);
console.log(`standalone/Tata-Service-Status-Portal.html  ${(html.length / 1024).toFixed(0)} KB`);
