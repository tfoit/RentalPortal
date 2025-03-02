const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

async function generatePDFfile(renderedHTML) {
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set the content of the page to the rendered HTML
    await page.setContent(renderedHTML, {
      waitUntil: "networkidle0",
    });

    // Define the output path for the PDF
    const outputPath = path.resolve(__dirname, "..", "output", `Contract-${Date.now()}.pdf`);

    // Generate the PDF from the page content and save it
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
    });

    // Close the browser
    await browser.close();

    console.log("PDF generated successfully:", outputPath);
    return outputPath;
  } catch (error) {
    console.error("Error generating PDF contract:", error);
    throw error;
  }
}

module.exports = { generatePDFfile };
