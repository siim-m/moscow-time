# Moscow Time Twitter Bot

A simple Twitter bot written in Node.js:

- `scheduled.js` runs at the top of every hour and tweets some bitcoin stats.
- `background.js` uses a Twitter filter stream to react to tweets from other accounts. It's currently quote tweeting [@PeterSchiff](https://twitter.com/PeterSchiff) whenever he mentions bitcoin.

The [live version](https://twitter.com/moscowtime_xyz) is running on containers in a Kubernetes cluster.
