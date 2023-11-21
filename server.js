const cheerio = require("cheerio");
const express = require("express");
const app = express();
const port = 3000;
const puppeteer = require("puppeteer");

app.get("/", async (req, res) => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.setViewport({
		width: 1240,
		height: 1080,
		deviceScaleFactor: 1,
	});
	page.goto("https://amazon.in/");
	const searchBar = await page.waitForSelector("input#twotabsearchtextbox");
    await searchBar.type("Smartphones");
    
	const form = await page.$("input#nav-search-submit-button");
    await form.evaluate((form) => form.click());
    await page.waitForNavigation({waitUntil: 'networkidle2'})
	const html = await page.content();
	const $ = cheerio.load(html);
	const productNames = await getProductName(
		$("span.a-size-medium.a-color-base.a-text-normal")
	);

	return res.send({ productNames });

	// await searchBar.type("Phones");
});

const getProductName = async (elements) => {
    const productName = [];
	for (const element of elements) {
		productName.push(element.children?.[0].data);
    }
    return productName
};

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
