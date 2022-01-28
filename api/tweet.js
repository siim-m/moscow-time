import chromium from 'chrome-aws-lambda';
import { TwitterApi } from 'twitter-api-v2';

async function getScreenshot({ view }) {
	const browser = await chromium.puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath,
		headless: true,
		ignoreHTTPSErrors: false,
	});

	const page = await browser.newPage();

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
	if (request.method !== 'POST') {
		response.status(400).send('Bad request');
		return;
	}

	if (request.headers['x-api-key'] !== process.env.API_KEY) {
		response.status(401).send('Unauthorized');
		return;
	}

	const { view, text } = request.body;

	const screenshot = await getScreenshot({ view });

	const client = new TwitterApi({
		appKey: process.env.TWITTER_API_KEY,
		appSecret: process.env.TWITTER_API_KEY_SECRET,
		accessToken: process.env.TWITTER_OAUTH_TOKEN,
		accessSecret: process.env.TWITTER_OAUTH_TOKEN_SECRET,
	});

	let params = {};

	if (view) {
		params.media_ids = [await client.v1.uploadMedia(Buffer.from(screenshot), { type: 'png' })];
	}

	if (view === 'moscowtime') {
		params.lat = 55.751244;
		params.lon = 37.618423;
	}

	const tweet = await client.v1.tweet(text, params);

	response.status(200).json(tweet);
}
