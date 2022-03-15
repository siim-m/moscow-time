import { ETwitterStreamEvent, TwitterApi } from 'twitter-api-v2';

import { getBlocks, getBlockIssuance, getPrice, getScreenshot } from './lib/helpers.js';

const USERS_TO_FOLLOW = [
	'56562803', // @PeterSchiff
];

const client = new TwitterApi({
	appKey: process.env.TWITTER_API_KEY,
	appSecret: process.env.TWITTER_API_KEY_SECRET,
	accessToken: process.env.TWITTER_OAUTH_TOKEN,
	accessSecret: process.env.TWITTER_OAUTH_TOKEN_SECRET,
});

async function sendScheduledTweet() {
	const now = Date.now();
	const hourAgo = now - 1000 * 60 * 60;

	const blocksInLastHour = await getBlocks({ sinceTimestamp: hourAgo });
	const blockHeight = blocksInLastHour[0].height;
	const numberOfBlocks = blocksInLastHour.length;
	const transactionCount = blocksInLastHour.reduce((acc, block) => acc + block.tx_count, 0);
	const newCoinsCreated = blocksInLastHour.reduce((acc, block) => acc + getBlockIssuance(block), 0);

	const price = await getPrice();
	const satsPerDollar = Math.round((1 / price) * 100000000);
	const moscowTime = `${satsPerDollar.toString().slice(0, 2)}:${satsPerDollar.toString().slice(2)}`;

	const tweetOptions = [
		{ view: 'blockheight', value: blockHeight },
		{ view: 'usdprice', value: price },
		{ view: 'moscowtime', value: satsPerDollar },
		{ view: 'satsperdollar', value: satsPerDollar },
	];

	const tweetOptionIndex = Math.floor(Math.random() * tweetOptions.length);

	const mainTextOptions = [
		`The current block height is ${blockHeight}.\nThe price of 1 #BTC is $${price.toLocaleString()}.\nMoscow time is ${moscowTime}.`,
	];

	const statsText = `Stats for the last hour:\n\n- Number of blocks mined: ${numberOfBlocks}\n- Newly created coins: ${newCoinsCreated} BTC\n- Number of transactions confirmed: ${transactionCount}`;

	const text = `${
		mainTextOptions[Math.floor(Math.random() * mainTextOptions.length)]
	}\n\n${statsText}`;

	const screenshot = await getScreenshot({
		view: tweetOptions[tweetOptionIndex].view,
		value: tweetOptions[tweetOptionIndex].value,
		timestamp: Date.now() / 1000,
	});

	const params = {
		media_ids: [await client.v1.uploadMedia(Buffer.from(screenshot), { type: 'png' })],
	};

	const tweet = await client.v1.tweet(text, params);

	console.log('Tweeted:', `https://twitter.com/moscowtime_xyz/status/${tweet.id_str}`);
}

client.v1
	.filterStream({
		follow: USERS_TO_FOLLOW,
		tweet_mode: 'extended',
	})
	.then((stream) => {
		stream.on(ETwitterStreamEvent.Connected, () => console.log('Stream connected'));
		stream.on(ETwitterStreamEvent.Reconnected, () => console.log('Stream reconnected'));
		stream.on(ETwitterStreamEvent.ConnectionLost, (err) =>
			console.log('Stream connection lost!', err)
		);
		stream.on(ETwitterStreamEvent.ConnectionError, (err) =>
			console.log('Stream connection error!', err)
		);

		stream.on(ETwitterStreamEvent.ConnectionClosed, () =>
			console.log('Connection has been closed.')
		);

		// stream.on(ETwitterStreamEvent.DataKeepAlive, () => console.log('Received stream keep-alive'));

		stream.on(ETwitterStreamEvent.Data, async (eventData) => {
			if (
				!eventData.retweeted_status &&
				USERS_TO_FOLLOW.includes(eventData.user?.id_str) &&
				(eventData.text.toLowerCase().includes('bitcoin') ||
					eventData.extended_tweet?.full_text?.toLowerCase().includes('bitcoin'))
			) {
				console.log(
					'Received tweet matching filter:',
					`https://twitter.com/${eventData.user.screen_name}/status/${eventData.id_str}`
				);

				const price = await getPrice();

				const screenshot = await getScreenshot({
					view: 'usdprice',
					value: price,
					timestamp: Date.now() / 1000,
				});

				const text = `🚨 @${
					eventData.user.screen_name
				} just tweeted about #bitcoin. The current price is $${price.toLocaleString()}.\n\nIf the past is any indicator of the future, it might be a good time to buy.`;

				const quoteTweet = await client.v1.tweet(text, {
					media_ids: [await client.v1.uploadMedia(Buffer.from(screenshot), { type: 'png' })],

					// Attach the original tweet as a quote without showing the URL in the text
					attachment_url: `https://twitter.com/${eventData.user.screen_name}/status/${eventData.id_str}`,
				});

				console.log(
					'Tweeted quote tweet:',
					`https://twitter.com/moscowtime_xyz/status/${quoteTweet.id_str}`
				);

				const reply = await client.v1.reply(
					`Let's see how well this ages...`,
					eventData.id_str,
					{
						// Attach the quote tweet as a reply to the original without showing the URL in the text.
						attachment_url: `https://twitter.com/${quoteTweet.user.screen_name}/status/${quoteTweet.id_str}`,
					}
				);

				console.log(
					'Replied to quoted tweet:',
					`https://twitter.com/moscowtime_xyz/status/${reply.id_str}`
				);
			}
		});

		// Enable reconnect feature
		stream.autoReconnect = true;
	});

setInterval(() => {
	const date = new Date();
	if (date.getMinutes() === 0 && date.getSeconds() === 0) {
		sendScheduledTweet();
	}
}, 1000);
