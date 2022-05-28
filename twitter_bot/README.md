# Moscow Time Twitter Bot

A simple Twitter bot written in Node.js:

- `scheduled.js` tweets some bitcoin stats at the top of every hour.
- `interactive.js` uses a Twitter filter stream to react to tweets from other accounts.

The [live version](https://twitter.com/moscowtime_xyz) is hosted on [Azure Container Apps](https://azure.microsoft.com/en-us/services/container-apps/).

## Local Development

You will need a Twitter developer account with an app configured that is enabled for user authentication.

The following environment variables need to be set for the code to work:

- `TWITTER_API_KEY` - Twitter app API key
- `TWITTER_API_KEY_SECRET` - Twitter app API key secret
- `TWITTER_OAUTH_TOKEN` - OAuth1.0a user token
- `TWITTER_OAUTH_TOKEN_SECRET` - OAuth1.0a user token secret

For obtaining the user token and secret, refer to the [official tutorial](https://developer.twitter.com/en/docs/tutorials/authenticating-with-twitter-api-for-enterprise/oauth1-0a-and-user-access-tokens).

It should be possible to authenticate using only the API key and secret if the app belongs to the same account which is sending the tweets. Twitter's documentation covers different authentication scenarios in detail.
