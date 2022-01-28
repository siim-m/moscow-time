import chromium from 'chrome-aws-lambda';
import { TwitterApi } from 'twitter-api-v2';

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

	page
		.on('console', (message) => console.log('puppeteer', message))
		.on('pageerror', ({ message }) => console.log('puppeteer', message))
		.on('requestfailed', (request) =>
			console.log('puppeteer', `${request.failure().errorText} ${request.url()}`)
		);

	await page.goto(`https://moscowtime.xyz/view/${view}`);

	let waitForFunction;

	while (!waitForFunction) {
		try {
			waitForFunction = await page.waitForFunction(
				'document.getElementById("blockclock-container").clientHeight > 0',
				{
					timeout: 3200,
				}
			);
		} catch (err) {
			console.log('err', err);
		}
	}

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

	const client = new TwitterApi({
		appKey: process.env.TWITTER_API_KEY,
		appSecret: process.env.TWITTER_API_KEY_SECRET,
		// Following access tokens are not required if you are
		// at part 1 of user-auth process (ask for a request token)
		// or if you want a app-only client (see below)
		accessToken: process.env.TWITTER_OAUTH_TOKEN,
		accessSecret: process.env.TWITTER_OAUTH_TOKEN_SECRET,
	});

	// response.setHeader('Content-Disposition', `inline; filename="${view}-${Date.now()}.png"`);
	// response.setHeader('Content-Type', 'image/png');

	const mediaId = await client.v1.uploadMedia(Buffer.from(screenshot), { type: 'png' });

	const tweet = await client.v1.tweet('Moscow time', { media_ids: [mediaId] });

	console.log('tweet', tweet);

	response.status(200).json(tweet);
}
