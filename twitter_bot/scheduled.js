import { client, getBlocks, getPrice, getScreenshot, getBlockIssuance } from './lib/helpers.js';
import { EUploadMimeType } from 'twitter-api-v2';

const log_level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toLowerCase() : undefined;

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
    media_ids: [
      await client.v1.uploadMedia(Buffer.from(screenshot), { mimeType: EUploadMimeType.Png }),
    ],
  };

  const tweet = await client.v1.tweet(text, params);

  console.log('Tweeted:', `https://twitter.com/moscowtime_xyz/status/${tweet.id_str}`);
}

// Calculates the number of milliseconds to the next full hour for scheduling
function getMillisecondsToNextRun() {
  const now = new Date();
  const hour = 60 * 60 * 1000; // 1 hour in milliseconds
  return hour - (now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();
}

const first = getMillisecondsToNextRun();
if (log_level === 'verbose') {
  console.log('Scheduling first tweet in', first / (1000 * 60), 'minutes');
}

setTimeout(function schedule() {
  sendScheduledTweet();
  const next = getMillisecondsToNextRun();
  if (log_level === 'verbose') {
    console.log('Scheduling next tweet in', next / (1000 * 60), 'minutes');
  }
  setTimeout(schedule, next);
}, first);
