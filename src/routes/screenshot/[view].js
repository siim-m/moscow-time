import puppeteer from 'puppeteer';

async function getScreenshot({ view }) {
	// open the browser and prepare a page
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// set the size of the viewport, so our screenshot will have the desired size
	await page.setViewport({
		width: 1920,
		height: 1080,
	});

	await page.goto(`https://moscowtime.xyz/view/${view}`);
	await page.waitForNetworkIdle();

	const screenshot = await page.screenshot({
		fullPage: false,
		type: 'png',
	});

	await browser.close();

	return screenshot;
}

export async function get({ params }) {
	const { view } = params;

	const screenshot = await getScreenshot({ view });

	return {
		status: 200,
		headers: {
			'Content-Disposition': `inline; filename="${view}-${Date.now()}.png"`,
			'Content-Type': 'image/png',
		},
		body: new Uint8Array(screenshot),
	};
}
