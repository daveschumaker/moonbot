# MoonBot
## A (very) simple cryptocurrency trading bot.

_Hold on tight, folks. We're going to the moon!*_

**Please Note:** This is a work in progress.

This project is an attempt to build an automated bot for trading cryptocurrencies. Some ideas are based upon the work of others who've come before, notably [Zenbot](https://github.com/DeviaVir/zenbot) and [Gekko](https://github.com/askmike/gekko).

<sub>\*Most likely not going to the moon.</sub>

**IMPORTANT: If you use this for live trading, you will MOST LIKELY LOSE MONEY.**

## Installation & Usage

To get started, follow the steps below:

```
> git clone https://github.com/daveschumaker/moonbot.git
> cd moonbot
> cp config-sample.js config.js
> npm install
> ./moonbot.js
```

_MoonBot_ will begin fetching real data from Binance and display the results in your terminal.

## Setup

Open `config.js` in the root project directory and enter your relevant configuration details (the Binance API key is optional at this time and will only used for fetching and placing orders with your personal account). You do not need it to run _MoonBot_ in its default simulation mode.

## To do

There are a number of things still to implement and cleanup.