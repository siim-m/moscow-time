import { readdirSync, readFileSync } from 'fs';
import { ETwitterStreamEvent, EUploadMimeType } from 'twitter-api-v2';
import { client, getPrice, getScreenshot } from './lib/helpers.js';

if (!process.env.USERS_TO_FOLLOW) {
  console.error('No USERS_TO_FOLLOW environment variable set! Exiting...');
  process.exit(1);
}

const USERS_TO_FOLLOW = process.env.USERS_TO_FOLLOW.replace(/ /g, '').split(',');

async function main() {
  const logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toLowerCase() : undefined;
  console.log('Starting interactive Moscow Time Twitter Bot...');

  const templates = readdirSync('./templates')
    .filter((fileName) => fileName.includes('quote_tweet'))
    .map((fileName) => readFileSync(`./templates/${fileName}`, { encoding: 'utf8' }));

  console.log(`Loaded ${templates.length} quote tweet templates.`);

  const stream = await client.v1.filterStream({
    follow: USERS_TO_FOLLOW,
    tweet_mode: 'extended',
  });

  console.log('Connected to Twitter streaming API. Waiting for tweets from:', USERS_TO_FOLLOW);

  stream.autoReconnect = true;

  stream.on(ETwitterStreamEvent.Reconnected, () => console.log('Stream reconnected!'));

  stream.on(ETwitterStreamEvent.Error, (err) =>
    console.error('Connection or parse error:', JSON.stringify(err))
  );

  stream.on(ETwitterStreamEvent.ConnectionClosed, () => console.log('Connection has been closed.'));

  stream.on(ETwitterStreamEvent.DataKeepAlive, () => {
    if (logLevel === 'verbose') {
      console.log('Twitter sent a keep-alive packet.');
    }
  });

  stream.on(ETwitterStreamEvent.Data, async (eventData) => {
    if (
      !eventData.retweeted_status && // ignore retweets
      !eventData.in_reply_to_status_id_str && // ignore replies
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

        const template = templates[Math.floor(Math.random() * templates.length)];

        const text = template
          .replace('__screen_name__', eventData.user.screen_name)
          .replace('__price__', price.toLocaleString());

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

        const reply = await client.v1.reply(
          `https://twitter.com/${quoteTweet.user.screen_name}/status/${quoteTweet.id_str}`,
          eventData.id_str
        );

        console.log(
          new Date(),
          'Replied to quoted tweet:',
          `https://twitter.com/moscowtime_xyz/status/${reply.id_str}`
        );
      } catch (err) {
        console.error('Caught error when parsing Twitter stream data:', JSON.stringify(err));
        console.error('Received data:', JSON.stringify(eventData));
      }
    }
  });
}

main();
