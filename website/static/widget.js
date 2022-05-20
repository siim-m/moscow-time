'use strict';

// Sets the values of the top section of each cell
function setTopSections(values) {
	for (let i = 0; i < 7; i += 1) {
		document.getElementById(`blockclock-top-section-${i}`).innerHTML = values[i] || '';
	}
}

function setDimensions({ noFrame = false } = {}) {
	const clockContainer = document.getElementById('blockclock-container');
	const clock = document.getElementById('blockclock');
	const digits = document.getElementById('blockclock-digits');

	clockContainer.style.height = noFrame
		? `${0.336 * clockContainer.clientWidth}px`
		: `${0.375 * clockContainer.clientWidth}px`;

	clock.style.height = noFrame
		? `${0.336 * clockContainer.clientWidth}px`
		: `${0.375 * clockContainer.clientWidth}px`;

	digits.style.height = noFrame
		? `${0.59 * clock.clientHeight}px`
		: `${0.5075 * clock.clientHeight}px`;

	Array.from(document.getElementsByClassName('blockclock-digit-content')).forEach((el) => {
		el.style.fontSize = noFrame
			? `${0.49 * clock.clientHeight}px`
			: `${0.425 * clock.clientHeight}px`;
	});

	Array.from(document.getElementsByClassName('blockclock-top-section')).forEach((el) => {
		el.style.fontSize = noFrame
			? `${0.0225 * clock.clientHeight}px`
			: `${0.019 * clock.clientHeight}px`;
	});

	Array.from(document.getElementsByClassName('blockclock-special-content')).forEach((el) => {
		el.style.fontSize = noFrame
			? `${0.1775 * clock.clientHeight}px`
			: `${0.15 * clock.clientHeight}px`;
	});

	Array.from(document.getElementsByClassName('blockclock-special-upper-small')).forEach((el) => {
		el.style.fontSize = noFrame
			? `${0.1125 * clock.clientHeight}px`
			: `${0.175 * clock.clientHeight}px`;
	});
}

function cycleView({ displayOptions, activeOption, displayData }) {
	if (!displayOptions.length) {
		document.querySelectorAll('.blockclock-top-section').forEach((cell) => {
			cell.innerHTML = '';
		});
		document.querySelectorAll('.blockclock-digit-content').forEach((cell) => {
			cell.innerHTML = '';
		});
		document.querySelectorAll('.blockclock-special-content').forEach((cell) => {
			cell.innerHTML = '';
		});
		return;
	}

	const BTC_USD_HTML = `
    <div>
      <div class="blockclock-special-upper">BTC</div>
      <div class="blockclock-special-separator"></div>
      <div class="blockclock-special-lower">USD</div>
    </div>
  `;

	const SAT_USD_HTML = `
    <div>
      <div class="blockclock-special-upper">SATS</div>
      <div class="blockclock-special-separator"></div>
      <div class="blockclock-special-lower">1USD</div>
    </div>
  `;

	const MOSCOW_TIME_HTML = `
    <div>
      <div class="blockclock-special-upper">MSCW</div>
      <div class="blockclock-special-separator"></div>
      <div class="blockclock-special-lower">TIME</div>
    </div>
  `;

	let activeView = displayOptions[activeOption];

	const { priceUsd, satUsd, blockHeight } = displayData;

	switch (activeView) {
		case 'usdprice':
			setTopSections(['Market price of', 'bitcoin']);

			document.getElementById('blockclock-cell-0').innerHTML = BTC_USD_HTML;
			document.getElementById('blockclock-cell-1').innerHTML = '$';

			// Determine which format to use based on number of digits in price.
			switch (true) {
				case priceUsd.length > 6:
					document.getElementById('blockclock-cell-2').innerHTML = `${priceUsd[0]}.`;
					document.getElementById('blockclock-cell-3').innerHTML = priceUsd[1];
					document.getElementById('blockclock-cell-4').innerHTML = priceUsd[2];
					document.getElementById('blockclock-cell-5').innerHTML = priceUsd[3];
					document.getElementById('blockclock-cell-6').innerHTML = 'M';
					break;
				case priceUsd.length > 5:
					document.getElementById('blockclock-cell-2').innerHTML = priceUsd[0];
					document.getElementById('blockclock-cell-3').innerHTML = priceUsd[1];
					document.getElementById('blockclock-cell-4').innerHTML = `${priceUsd[2]}.`;
					document.getElementById('blockclock-cell-5').innerHTML = priceUsd[3];
					document.getElementById('blockclock-cell-6').innerHTML = 'K';
					break;
				default:
					for (let i = 2; i < 7; i += 1) {
						document.getElementById(`blockclock-cell-${i.toString()}`).innerHTML =
							priceUsd[priceUsd.length - 7 + i] || '';
					}
					break;
			}

			break;

		case 'satsperdollar':
			document.getElementById('blockclock-cell-0').innerHTML = SAT_USD_HTML;

			setTopSections([]);

			// Set the digits.
			for (let i = 1; i < 7; i += 1) {
				document.getElementById(`blockclock-cell-${i.toString()}`).innerHTML =
					satUsd[satUsd.length - 7 + i] || '';
			}

			break;

		case 'blockheight':
			for (let i = 0; i < 7; i += 1) {
				document.getElementById(`blockclock-cell-${i.toString()}`).innerHTML =
					blockHeight[blockHeight.length - 7 + i] || '';
			}

			setTopSections(['Number of blocks', 'in the', 'blockchain']);

			break;

		case 'moscowtime':
			document.getElementById('blockclock-cell-0').innerHTML = MOSCOW_TIME_HTML;

			setTopSections([]);

			// Set the digits.
			for (let i = 1; i < 7; i += 1) {
				document.getElementById(`blockclock-cell-${i.toString()}`).innerHTML =
					satUsd[satUsd.length - 7 + i] || '';
			}

			break;

		default:
			break;
	}
}

async function fetchData() {
	const priceUsdResponse = await (
		await fetch('https://api.coinbase.com/v2/prices/spot?currency=USD')
	).json();

	const blockHeightResponse = await (
		await fetch('https://blockstream.info/api/blocks/tip/height')
	).json();

	const priceUsd = parseInt(priceUsdResponse.data.amount).toString();
	const satUsd = Math.round((1 / priceUsd) * 100000000).toString();
	const blockHeight = blockHeightResponse.toString();

	return {
		priceUsd,
		satUsd,
		blockHeight,
	};
}

function mountBlockClock({ value } = {}) {
	const FETCH_INTERVAL = 10000;
	const VALID_DISPLAY_OPTIONS = ['blockheight', 'usdprice', 'satsperdollar', 'moscowtime'];

	const CLOCK_HTML = `
  <div id="blockclock">
    <div id="blockclock-digits">
      <div class="blockclock-cell">
        <div id="blockclock-top-section-0" class="blockclock-top-section"></div>
        <div id="blockclock-cell-0" class="blockclock-special-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-1" class="blockclock-top-section"></div>
        <div id="blockclock-cell-1" class="blockclock-digit-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-2" class="blockclock-top-section"></div>
        <div id="blockclock-cell-2" class="blockclock-digit-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-3" class="blockclock-top-section"></div>
        <div id="blockclock-cell-3" class="blockclock-digit-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-4" class="blockclock-top-section"></div>
        <div id="blockclock-cell-4" class="blockclock-digit-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-5" class="blockclock-top-section"></div>
        <div id="blockclock-cell-5" class="blockclock-digit-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-6" class="blockclock-top-section"></div>
        <div id="blockclock-cell-6" class="blockclock-digit-content"></div>
      </div>
    </div>
  </div>
  `;

	let cycleInterval = 3000;

	const clockContainer = document.getElementById('blockclock-container');

	let noFrame = Array.from(clockContainer.classList).includes('noframe');

	// Load CSS
	const link = document.createElement('link');
	link.href = noFrame
		? 'https://moscowtime.xyz/widget-no-frame.css'
		: 'https://moscowtime.xyz/widget-with-frame.css';
	link.type = 'text/css';
	link.rel = 'stylesheet';
	document.getElementsByTagName('head')[0].appendChild(link);

	let displayOptions = Array.from(clockContainer.classList).filter((className) => {
		return VALID_DISPLAY_OPTIONS.includes(className);
	});

	clockContainer.innerHTML = CLOCK_HTML;

	setDimensions({ noFrame });

	const clockSizeObserver = new ResizeObserver(() => {
		setDimensions({ noFrame });
	});
	clockSizeObserver.observe(clockContainer);

	const clockClassObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.attributeName === 'class') {
				displayOptions = Array.from(clockContainer.classList).filter((className) => {
					return VALID_DISPLAY_OPTIONS.includes(className);
				});
				noFrame = Array.from(clockContainer.classList).includes('noframe');
				link.href = noFrame
					? 'https://moscowtime.xyz/widget-no-frame.css'
					: 'https://moscowtime.xyz/widget-with-frame.css';
				setDimensions({ noFrame });
				cycleView({ displayOptions, activeOption, displayData });
			}
		});
	});
	clockClassObserver.observe(clockContainer, { attributes: true });

	if (value && displayOptions.length > 1) {
		console.error(
			'Incorrect widget configuration. You can only specify one display option if value is specified'
		);
		alert(
			'Incorrect widget configuration. You can only specify one display option if value is specified'
		);
		return;
	}

	let activeOption = 0;

	Array.from(clockContainer.classList).forEach((className) => {
		if (className.includes('interval-')) {
			const regexp = /^(interval-)(\d+)$/gi;
			const matches = [...className.matchAll(regexp)];
			if (matches.length) {
				const intervalValue = parseInt(matches[0][2]);
				if (typeof intervalValue === 'number') cycleInterval = intervalValue;
			}
		}
	});

	let displayData = {
		priceUsd: value && displayOptions[0] === 'usdprice' ? value : undefined,
		satUsd:
			value && (displayOptions[0] === 'satsperdollar' || displayOptions[0] === 'moscowtime')
				? value
				: undefined,
		blockHeight: value && displayOptions[0] === 'blockheight' ? value : undefined,
	};

	let cycleViewInterval;
	let fetchDataInterval;

	if (!value) {
		fetchData().then((data) => {
			displayData.priceUsd = data.priceUsd;
			displayData.satUsd = data.satUsd;
			displayData.blockHeight = data.blockHeight;

			cycleView({
				displayOptions,
				activeOption,
				displayData,
			});

			cycleViewInterval = setInterval(() => {
				if (activeOption === undefined || activeOption >= displayOptions.length - 1) {
					activeOption = 0;
				} else {
					activeOption += 1;
				}

				cycleView({
					displayOptions,
					activeOption,
					displayData,
				});
			}, cycleInterval);
		});

		fetchDataInterval = setInterval(() => {
			fetchData().then((data) => {
				displayData.priceUsd = data.priceUsd;
				displayData.satUsd = data.satUsd;
				displayData.blockHeight = data.blockHeight;
			});
		}, FETCH_INTERVAL);
	} else {
		cycleView({
			displayOptions,
			activeOption,
			displayData,
		});
	}

	return {
		unMount: () => {
			clearInterval(cycleViewInterval);
			clearInterval(fetchDataInterval);
			clockSizeObserver.disconnect();
			clockClassObserver.disconnect();
			clockContainer.innerHTML = '';
		},
	};
}
