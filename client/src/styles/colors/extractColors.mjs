// extracts colors.js from colors.css
// run with "node extractColors.mjs"
import fs from "fs/promises";

(async () => {
    try {
        // Read the CSS file
        const data = await fs.readFile("colors.css", "utf8");

        // Extract the color variables
        const regex = /--(.+?)-(\d+|black|white):\s*(.+?);/g;
        let matches;
        const colors = {};

        while ((matches = regex.exec(data)) !== null) {
            const [, colorName, variation, colorValue] = matches;

            if (colors[colorName]) {
                colors[colorName][variation] = colorValue;
            } else {
                colors[colorName] = { [variation]: colorValue };
            }
        }

        // Create the JavaScript file with the color variables as an exported object
        const output = `export const colors = ${JSON.stringify(colors, null, 2)};\n`;

        await fs.writeFile("colors.js", output, "utf8");
        console.log("colors.js has been created.");
    } catch (err) {
        console.error(err);
    }
})();
