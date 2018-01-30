# TODO's

## Big Features

* Ideally, we should run all technical analysis calculations at each period and make it available to our API (using Express?)
* Serve up an API via Express or Koa and control the bot that way, rather than through the command line. Serve all the info up in a nice webpage (graphs, control the bot, execute orders, etc).
* When checking sell price, if profit won't even cover fees (e.g., 0.1%), don't sell.
* Preserve profit: Track max profit for asets and then sell if profit dips X percent.
* Use DB to persist profit / loss data, num of sells, etc.
* Info page needs to show starting balance, assets, total and compare with current stuff (and show a diff). Bonus: Table view.
* For the above, show time of last trade and sell (and amounts, cost, profit, etc);
* Make sure we always start with a buy (NEVER SELL AT FIRST)
* For defaultStrategy -- add RSI to buy / sell signal stuff for trends.
* On top of that, check RSI for < 30 or > 70 for potential changes.
* 'inPeriod' calculations vs 'endPeriod' calculations.
* Take fees into account for --paper mode!
* Support launching with params and settings
* "Slough" off extra balance. e.g, if we set a max balance of 1 ETH and we sell some coins for > 1 ETH, reset balance to 1.0 ETH (so we basically end up banking the extra ETH).

## Nice To Have

* Backfill orders for a previous time frame.
* Backfill orders on initial script load (so it doesn't have to wait to fill in data) (Sort of implemented).
* Add in backtester / sim.
* Add support for genetic algo!
* NodeMailer or some notification service for trades.
* Keyboard shortcut to change period on the fly and recalculate (e.g., looking at short term vs longer term trends.)
* LIVE keyboard shortcuts!