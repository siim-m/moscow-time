import { readdirSync, readFileSync } from 'fs';
import { getMillisecondsToNextHour, sendScheduledTweet } from './lib/helpers.js';

const logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toLowerCase() : undefined;

console.log('Starting scheduled Moscow Time Twitter Bot...');

const templates = readdirSync('./templates')
  .filter((fileName) => fileName.includes('scheduled'))
  .map((fileName) => readFileSync(`./templates/${fileName}`, { encoding: 'utf8' }));

console.log(`Loaded ${templates.length} scheduled tweet templates.`);

const first = getMillisecondsToNextHour();
if (logLevel === 'verbose') {
  console.log('Scheduling first tweet in', first / (1000 * 60), 'minutes.');
}

setTimeout(function schedule() {
  sendScheduledTweet({ templates });
  const next = getMillisecondsToNextHour();
  if (logLevel === 'verbose') {
    console.log('Scheduling next tweet in', next / (1000 * 60), 'minutes.');
  }
  setTimeout(schedule, next);
}, first);
