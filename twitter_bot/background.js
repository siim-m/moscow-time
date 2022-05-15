import { ETwitterStreamEvent, EUploadMimeType } from 'twitter-api-v2';
import { client, getPrice, getScreenshot } from './lib/helpers.js';

const USERS_TO_FOLLOW = [
	'56562803', // @PeterSchiff
];

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
						'Tweeted quote tweet:',
						`https://twitter.com/moscowtime_xyz/status/${quoteTweet.id_str}`
					);

					const reply = await client.v1.reply(`Let's see how well this ages...`, eventData.id_str, {
						// Attach the quote tweet as a reply to the original without showing the URL in the text.
						attachment_url: `https://twitter.com/${quoteTweet.user.screen_name}/status/${quoteTweet.id_str}`,
					});

					console.log(
						'Replied to quoted tweet:',
						`https://twitter.com/moscowtime_xyz/status/${reply.id_str}`
					);
				} catch (err) {
					console.log('Caught error:', err);
				}
			}
		});

		// Enable reconnect feature
		stream.autoReconnect = true;
	});
