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
		// Awaits for a tweet
		stream.on(
			// Emitted when Node.js {response} emits a 'error' event (contains its payload).
			ETwitterStreamEvent.ConnectionError,
			(err) => console.log('Connection error!', err)
		);

		stream.on(
			// Emitted when Node.js {response} is closed by remote or using .close().
			ETwitterStreamEvent.ConnectionClosed,
			() => console.log('Connection has been closed.')
		);

		stream.on(
			// Emitted when a Twitter payload (a tweet or not, given the endpoint).
			ETwitterStreamEvent.Data,
			async (eventData) => {
				if (
					!eventData.retweeted_status &&
					!eventData.in_reply_to_status_id &&
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

					const params = {
						media_ids: [await client.v1.uploadMedia(Buffer.from(screenshot), { type: 'png' })],
					};

					const text = `Peter Schiff just tweeted about #bitcoin. The current price is $${price.toLocaleString()}.\n\nYou should probably be buying. https://twitter.com/${
						eventData.user.screen_name
					}/status/${eventData.id_str}`;

					const quoteTweet = await client.v1.tweet(text, params);

					console.log(
						'Tweeted quote tweet:',
						`https://twitter.com/moscowtime_xyz/status/${quoteTweet.id_str}`
					);

					const reply = await client.v1.reply(
						`https://twitter.com/${quoteTweet.user.id_str}/status/${quoteTweet.id_str}`,
						eventData.id_str
					);

					console.log(
						'Replied to quoted tweet:',
						`https://twitter.com/moscowtime_xyz/status/${reply.id_str}`
					);
				}
			}
		);

		// Enable reconnect feature
		stream.autoReconnect = true;
	});

setInterval(() => {
	const date = new Date();
	if (date.getMinutes() === 0 && date.getSeconds() === 0) {
		sendScheduledTweet();
	}
}, 1000);
