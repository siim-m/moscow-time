import { TwitterApi } from 'twitter-api-v2';
import mempoolJS from '@mempool/mempool.js';
import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import { EUploadMimeType } from 'twitter-api-v2';

export const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_OAUTH_TOKEN,
  accessSecret: process.env.TWITTER_OAUTH_TOKEN_SECRET,
});

export function getBlockIssuance({ height }) {
  if (height < 840000) {
    return 6.25;
  } else if (height < 1050000) {
    return 3.125;
  } else if (height < 1260000) {
    return 1.5625;
  } else if (height < 1470000) {
    return 0.78125;
  } else if (height < 1680000) {
    return 0.390625;
  } else if (height < 1890000) {
    return 0.1953125;
  } else if (height < 2100000) {
    return 0.09765625;
  } else if (height < 2310000) {
    return 0.04882812;
  } else if (height < 2520000) {
    return 0.02441406;
  } else if (height < 2730000) {
    return 0.01220703;
  } else if (height < 2940000) {
    return 0.00610351;
  } else if (height < 3150000) {
    return 0.00305175;
  } else if (height < 3360000) {
    return 0.00152587;
  }
}

export async function getBlocks({ sinceTimestamp, untilHeight }) {
  const {
    bitcoin: { blocks },
  } = mempoolJS({
    hostname: 'mempool.space',
  });

  const blocksToReturn = [];

  const lastTen = await blocks.getBlocks({ start_height: untilHeight });

  blocksToReturn.push(...lastTen.filter((block) => block.timestamp * 1000 > sinceTimestamp));

  if (
    blocksToReturn.length &&
    blocksToReturn[blocksToReturn.length - 1].timestamp * 1000 > sinceTimestamp
  ) {
    blocksToReturn.push(
      ...(await getBlocks({
        sinceTimestamp,
        untilHeight: blocksToReturn[blocksToReturn.length - 1].height - 1,
      }))
    );
  }

  return blocksToReturn;
}

export async function getPrice() {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin');
  const data = await res.json();

  return Math.floor(data.market_data.current_price.usd);
}

export async function getScreenshot({ view, value, timestamp }) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    ignoreHTTPSErrors: false,
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  page
    // .on('console', (message) => console.log('puppeteer', message))
    .on('pageerror', ({ message }) => console.log('puppeteer', message))
    .on('requestfailed', (request) =>
      console.log('puppeteer', `${request.failure().errorText} ${request.url()}`)
    );

  if (!value && !timestamp) {
    await page.goto(`https://moscowtime.xyz/view/${view}`);
  } else if (!value) {
    await page.goto(`https://moscowtime.xyz/view/${view}?timestamp=${timestamp}`);
  } else if (!timestamp) {
    await page.goto(`https://moscowtime.xyz/view/${view}?value=${value}`);
  } else {
    await page.goto(`https://moscowtime.xyz/view/${view}?value=${value}&timestamp=${timestamp}`);
  }

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

  await page.waitForNetworkIdle();

  const screenshot = await page.screenshot({
    fullPage: false,
    type: 'png',
  });

  await browser.close();

  return screenshot;
}

// Calculates the number of milliseconds to the next full hour for scheduling
export function getMillisecondsToNextHour() {
  const now = new Date();
  const hour = 60 * 60 * 1000; // 1 hour in milliseconds
  return hour - (now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();
}

export async function sendScheduledTweet({ templates }) {
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

  const screenshotOptions = [
    { view: 'blockheight', value: blockHeight },
    { view: 'usdprice', value: price },
    { view: 'moscowtime', value: satsPerDollar },
    { view: 'satsperdollar', value: satsPerDollar },
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  const text = template
    .replace('__block_height__', blockHeight)
    .replace('__price__', price.toLocaleString())
    .replace('__moscow_time__', moscowTime)
    .replace('__number_of_blocks__', numberOfBlocks)
    .replace('__new_coins_created__', newCoinsCreated)
    .replace('__transaction_count__', transactionCount)
    .replace('__sats_per_dollar__', satsPerDollar.toLocaleString());

  const screenshotOptionIndex = Math.floor(Math.random() * screenshotOptions.length);
  const screenshot = await getScreenshot({
    view: screenshotOptions[screenshotOptionIndex].view,
    value: screenshotOptions[screenshotOptionIndex].value,
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
