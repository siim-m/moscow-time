import { ETwitterStreamEvent, EUploadMimeType } from 'twitter-api-v2';
import { client, getPrice, getScreenshot } from './lib/helpers.js';

const USERS_TO_FOLLOW = [
	'56562803', // @PeterSchiff
];

async function main() {
	const stream = await client.v1.filterStream({
		follow: USERS_TO_FOLLOW,
		tweet_mode: 'extended',
	});

	stream.autoReconnect = true;

	stream.on(ETwitterStreamEvent.Reconnected, () => console.log(new Date(), 'Stream reconnected!'));

	stream.on(ETwitterStreamEvent.ConnectionLost, (err) =>
		console.error(new Date(), 'Stream connection lost!\n', err)
	);

	stream.on(
		// Emitted when Node.js {response} emits a 'error' event (contains its payload).
		ETwitterStreamEvent.Error,
		(err) => console.error(new Date(), 'Connection or parse error!\n', err)
	);

	stream.on(
		// Emitted when Node.js {response} is closed by remote or using .close().
		ETwitterStreamEvent.ConnectionClosed,
		() => console.log(new Date(), 'Connection has been closed.')
	);

	stream.on(
		// Emitted when a Twitter sent a signal to maintain connection active
		ETwitterStreamEvent.DataKeepAlive,
		() => console.log(new Date(), 'Twitter has a keep-alive packet.')
	);

	stream.on(ETwitterStreamEvent.Data, async (eventData) => {
		if (
			!eventData.retweeted_status &&
			USERS_TO_FOLLOW.includes(eventData.user?.id_str) &&
			(eventData.text.toLowerCase().includes('bitcoin') ||
				eventData.extended_tweet?.full_text?.toLowerCase().includes('bitcoin'))
		) {
			console.log(
				new Date(),
				'Received tweet matching filter:',
				`https://twitter.com/${eventData.user.screen_name}/status/${eventData.id_str}`
			);

			try {
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
					media_ids: [
						await client.v1.uploadMedia(Buffer.from(screenshot), {
							mimeType: EUploadMimeType.Png,
						}),
					],

					// Attach the original tweet as a quote without showing the URL in the text
					attachment_url: `https://twitter.com/${eventData.user.screen_name}/status/${eventData.id_str}`,
				});

				console.log(
					new Date(),
					'Tweeted quote tweet:',
					`https://twitter.com/moscowtime_xyz/status/${quoteTweet.id_str}`
				);

				const reply = await client.v1.reply(`Let's see how well this ages...`, eventData.id_str, {
					// Attach the quote tweet as a reply to the original without showing the URL in the text.
					attachment_url: `https://twitter.com/${quoteTweet.user.screen_name}/status/${quoteTweet.id_str}`,
				});

				console.log(
					new Date(),
					'Replied to quoted tweet:',
					`https://twitter.com/moscowtime_xyz/status/${reply.id_str}`
				);
			} catch (err) {
				console.log(new Date(), 'Caught error:', err);
			}
		}
	});
}

main();
