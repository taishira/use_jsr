// Import Astral
import { launch } from "jsr:@astral/astral";

// Launch the browser
const browser = await launch();

// Open a new page
const page = await browser.newPage("https://deno.land");

// Take a screenshot of the page and save that to disk
const screenshot = await page.screenshot();
Deno.writeFileSync("screenshot.png", screenshot);

console.log("shot saved")

// Close the browser
await browser.close();