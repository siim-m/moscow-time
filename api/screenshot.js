import chromium from 'chrome-aws-lambda';

async function getScreenshot({ view }) {
	const browser = await chromium.puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath,
		headless: true,
		ignoreHTTPSErrors: true,
	});

	const page = await browser.newPage();

	// set the size of the viewport, so our screenshot will have the desired size
	await page.setViewport({
		width: 1920,
		height: 1080,
	});

	await page.goto(`https://moscowtime.xyz/view/${view}`);
	await page.waitForFunction('document.getElementById("blockclock-container").clientHeight > 0');
  await page.waitForInflightRequests();

	const screenshot = await page.screenshot({
		fullPage: false,
		type: 'png',
	});

	await browser.close();

	return screenshot;
}

export default async function handler(request, response) {
	const { view } = request.query;

	const screenshot = await getScreenshot({ view });

	response.setHeader('Content-Disposition', `inline; filename="${view}-${Date.now()}.png"`);
	response.setHeader('Content-Type', 'image/png');

	response.status(200).send(screenshot);
}
