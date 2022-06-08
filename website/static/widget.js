'use strict';

// Sets the values of the top section of each cell
function setTopSections(values) {
  for (let i = 0; i < 7; i += 1) {
    document.getElementById(`blockclock-top-section-${i}`).innerHTML = values[i] || '';
  }
}

// MICRO Sets the text in the small bottom section.
function setBottomSection(value) {
  document.getElementById('blockclock-display-bottom-section').innerHTML = value;
}

function setDimensions({ noFrame = false, clockModel = 'mini' } = {}) {
  let aspectRatio;

  // MICRO ONLY - For calculating various font sizes based on clock height.
  const MAIN_FONT_SIZE_TO_HEIGHT_RATIO = 0.3125;
  const BOTTOM_FONT_SIZE_TO_HEIGHT_RATIO = 0.04975;
  const SPECIAL_FONT_SIZE_TO_HEIGHT_RATIO = 0.11;

  switch (clockModel) {
    case 'mini':
      if (noFrame) {
        aspectRatio = 0.336;
      } else {
        aspectRatio = 0.375;
      }
      break;
    case 'micro':
      aspectRatio = 750 / 1280;
      break;
    default:
      break;
  }

  const clockContainer = document.getElementById('blockclock-container');
  const clock = document.getElementById('blockclock');
  const digits = document.getElementById('blockclock-digits');

  // MICRO ONLY
  const clockDisplayMainSection = document.getElementById('blockclock-display-main-section');
  const clockDisplayBottomSection = document.getElementById('blockclock-display-bottom-section');

  clockContainer.style.height = `${aspectRatio * clockContainer.clientWidth}px`;

  clock.style.height = `${aspectRatio * clockContainer.clientWidth}px`;

  if (clockModel === 'mini') {
    digits.style.height = noFrame
      ? `${0.59 * clock.clientHeight}px`
      : `${0.5075 * clock.clientHeight}px`;

    Array.from(document.getElementsByClassName('blockclock-content')).forEach((el) => {
      el.style.fontSize = noFrame
        ? `${0.49 * clock.clientHeight}px`
        : `${0.425 * clock.clientHeight}px`;
    });

    Array.from(document.getElementsByClassName('blockclock-top-section')).forEach((el) => {
      el.style.fontSize = noFrame
        ? `${0.0225 * clock.clientHeight}px`
        : `${0.019 * clock.clientHeight}px`;
    });

    Array.from(document.getElementsByClassName('blockclock-special')).forEach((el) => {
      el.style.fontSize = noFrame
        ? `${0.1775 * clock.clientHeight}px`
        : `${0.15 * clock.clientHeight}px`;
    });
  }

  if (clockModel === 'micro') {
    clockDisplayMainSection.style.fontSize = `${
      MAIN_FONT_SIZE_TO_HEIGHT_RATIO * clock.clientHeight
    }px`;

    clockDisplayBottomSection.style.fontSize = `${
      BOTTOM_FONT_SIZE_TO_HEIGHT_RATIO * clock.clientHeight
    }px`;

    Array.from(document.getElementsByClassName('blockclock-special')).forEach((el) => {
      el.style.fontSize = `${SPECIAL_FONT_SIZE_TO_HEIGHT_RATIO * clock.clientHeight}px`;
    });
  }
}

function cycleView({ displayOptions, activeOption, displayData, clockModel }) {
  if (!displayOptions.length) {
    document.querySelectorAll('.blockclock-content').forEach((cell) => {
      cell.innerHTML = '';
    });
    return;
  }

  const MINI_USDPRICE_HTML = `
    <div class="blockclock-special">
      <div class="blockclock-special-upper">BTC</div>
      <div class="blockclock-special-separator"></div>
      <div class="blockclock-special-lower">USD</div>
    </div>
  `;

  const MICRO_USDPRICE_HTML = `
  <div class="blockclock-special blockclock-special-usdprice">
    <div id="blockclock-cell-0-special-upper">BTC</div>
    <div id="blockclock-cell-0-special-separator"></div>
    <div id="blockclock-cell-0-special-lower">USD</div>
  </div>
	`;

  const MINI_SATSPERDOLLAR_HTML = `
    <div class="blockclock-special">
      <div class="blockclock-special-upper">SATS</div>
      <div class="blockclock-special-separator"></div>
      <div class="blockclock-special-lower">1USD</div>
    </div>
  `;

  const MICRO_SATSPERDOLLAR_HTML = `
  <div class="blockclock-special blockclock-special-satsperdollar">
    <div id="blockclock-cell-0-special-upper">SATS</div>
    <div id="blockclock-cell-0-special-separator"></div>
    <div id="blockclock-cell-0-special-lower">1USD</div>
  </div>
`;

  const MINI_MOSCOWTIME_HTML = `
    <div class="blockclock-special">
      <div class="blockclock-special-upper">MSCW</div>
      <div class="blockclock-special-separator"></div>
      <div class="blockclock-special-lower">TIME</div>
    </div>
  `;

  const MICRO_MOSCOWTIME_HTML = `
  <div class="blockclock-special blockclock-special-moscowtime">
    <div id="blockclock-cell-0-special-upper">MSCW</div>
    <div id="blockclock-cell-0-special-separator"></div>
    <div id="blockclock-cell-0-special-lower">TIME</div>
  </div>
	`;

  let activeView = displayOptions[activeOption];

  const { priceUsd, satUsd, blockHeight } = displayData;

  switch (activeView) {
    case 'usdprice':
      if (clockModel === 'mini') {
        setTopSections(['Market price of', 'bitcoin']);
        document.getElementById('blockclock-cell-0').innerHTML = MINI_USDPRICE_HTML;
      } else if (clockModel === 'micro') {
        setBottomSection('Market price of Bitcoin');
        // document.getElementById('blockclock-display').style.backgroundImage =
        //   "url('/z_usdprice.jpg')";
        document.getElementById('blockclock-cell-0').innerHTML = MICRO_USDPRICE_HTML;
      }

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
      if (clockModel === 'mini') {
        setTopSections([]);
        document.getElementById('blockclock-cell-0').innerHTML = MINI_SATSPERDOLLAR_HTML;
      } else if (clockModel === 'micro') {
        // document.getElementById('blockclock-display').style.backgroundImage =
        //   "url('/z_satsperdollar.jpg')";
        document.getElementById('blockclock-cell-0').innerHTML = MICRO_SATSPERDOLLAR_HTML;
        setBottomSection('Value of one US Dollar, expressed in Satoshis');
      }

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

      if (clockModel === 'mini') {
        setTopSections(['Number of blocks', 'in the', 'blockchain']);
      } else if (clockModel === 'micro') {
        setBottomSection('Number of blocks in the blockchain');
        // document.getElementById('blockclock-display').style.backgroundImage =
        //   "url('/z_blockheight.jpg')";
      }

      break;

    case 'moscowtime':
      if (clockModel === 'mini') {
        setTopSections([]);
        document.getElementById('blockclock-cell-0').innerHTML = MINI_MOSCOWTIME_HTML;
      } else if (clockModel === 'micro') {
        // document.getElementById('blockclock-display').style.backgroundImage =
        //   "url('/z_moscowtime.jpg')";
        document.getElementById('blockclock-cell-0').innerHTML = MICRO_MOSCOWTIME_HTML;
        setBottomSection('');
      }

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

function mountBlockClock({ value, baseUrl = 'https://moscowtime.xyz' } = {}) {
  const FETCH_INTERVAL = 10000;
  const VALID_DISPLAY_OPTIONS = ['blockheight', 'usdprice', 'satsperdollar', 'moscowtime'];

  const MINI_HTML = `
  <div id="blockclock">
    <div id="blockclock-digits">
      <div class="blockclock-cell">
        <div id="blockclock-top-section-0" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-cell-0" class="blockclock-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-1" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-cell-1" class="blockclock-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-2" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-cell-2" class="blockclock-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-3" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-cell-3" class="blockclock-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-4" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-cell-4" class="blockclock-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-5" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-cell-5" class="blockclock-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-6" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-cell-6" class="blockclock-content"></div>
      </div>
    </div>
  </div>
  `;

  const MICRO_HTML = `
	<div id="blockclock">
		<div id="blockclock-display">
			<div id="blockclock-display-main-section">
				<div id="blockclock-cell-0" class="blockclock-cell blockclock-content"></div>
				<div id="blockclock-cell-1" class="blockclock-cell blockclock-content"></div>
				<div id="blockclock-cell-2" class="blockclock-cell blockclock-content"></div>
				<div id="blockclock-cell-3" class="blockclock-cell blockclock-content"></div>
				<div id="blockclock-cell-4" class="blockclock-cell blockclock-content"></div>
				<div id="blockclock-cell-5" class="blockclock-cell blockclock-content"></div>
				<div id="blockclock-cell-6" class="blockclock-cell blockclock-content"></div>
			</div>
			<div id="blockclock-display-bottom-section" class="blockclock-content"></div>
		</div>
	</div>
	`;

  let cycleInterval = 3000;

  const clockContainer = document.getElementById('blockclock-container');

  let clockModel;
  let clockSizeObserver;
  let clockClassObserver;
  let cssFilePath;
  let backgroundImage;

  if (clockContainer.classList.contains('model-mini')) {
    clockModel = 'mini';
  } else if (clockContainer.classList.contains('model-micro')) {
    clockModel = 'micro';
  } else {
    clockModel = 'mini';
  }

  let noFrame = Array.from(clockContainer.classList).includes('noframe');

  switch (clockModel) {
    case 'mini':
      clockContainer.innerHTML = MINI_HTML;
      cssFilePath = noFrame ? `${baseUrl}/widget-no-frame.css` : `${baseUrl}/widget-with-frame.css`;
      backgroundImage = noFrame ? 'blockclock-no-frame.webp' : 'blockclock-with-frame.webp';
      break;
    case 'micro':
      clockContainer.innerHTML = MICRO_HTML;
      cssFilePath = `${baseUrl}/widget-micro.css`;
      backgroundImage = 'bcmm-face-1280.webp';
      break;
    default:
      break;
  }

  // Load CSS
  const fontFaceCss = `
    @font-face {
      font-family: 'Steelfish Rounded Bold';
      src: url('${baseUrl}/steelfish_rounded_bold.woff2') format('woff2'),
        url('${baseUrl}/steelfish_rounded_bold.woff') format('woff'),
        url('${baseUrl}/steelfish_rounded_bold.ttf') format('truetype');
    }
    
    @font-face {
      font-family: 'Peep';
      src: url('${baseUrl}/peep.woff2') format('woff2'),
        url('${baseUrl}/peep.woff') format('woff'),
        url('${baseUrl}/peep.ttf') format('truetype');
    }

    @font-face {
      font-family: 'Courier Prime Bold';
      src: url('${baseUrl}/courier_prime_bold.woff2') format('woff2'),
        url('${baseUrl}/courier_prime_bold.woff') format('woff'),
        url('${baseUrl}/courier_prime_bold.ttf') format('truetype');
    }

    #blockclock {
      background-image: url('${baseUrl}/${backgroundImage}');
    }
  `;

  const fontFaceStyleTag = document.createElement('style');
  fontFaceStyleTag.appendChild(document.createTextNode(fontFaceCss));
  document.head.appendChild(fontFaceStyleTag);

  const stylesheetLinkElement = document.createElement('link');
  stylesheetLinkElement.href = cssFilePath;
  stylesheetLinkElement.type = 'text/css';
  stylesheetLinkElement.rel = 'stylesheet';
  document.head.appendChild(stylesheetLinkElement);

  let displayOptions = Array.from(clockContainer.classList).filter((className) => {
    return VALID_DISPLAY_OPTIONS.includes(className);
  });

  setDimensions({ noFrame, clockModel });

  clockSizeObserver = new ResizeObserver(() => {
    setDimensions({ noFrame, clockModel });
  });
  clockSizeObserver.observe(clockContainer);

  clockClassObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        displayOptions = Array.from(clockContainer.classList).filter((className) => {
          return VALID_DISPLAY_OPTIONS.includes(className);
        });
        noFrame = Array.from(clockContainer.classList).includes('noframe');
        stylesheetLinkElement.href = cssFilePath;
        cycleView({ displayOptions, activeOption, displayData, clockModel });
        setDimensions({ noFrame, clockModel });
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
        clockModel,
      });
      setDimensions({ noFrame, clockModel });

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
          clockModel,
        });
        setDimensions({ noFrame, clockModel });
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
      clockModel,
    });
    setDimensions({ noFrame, clockModel });
  }

  return {
    unMount: () => {
      clearInterval(cycleViewInterval);
      clearInterval(fetchDataInterval);
      clockSizeObserver.disconnect();
      clockClassObserver.disconnect();
      clockContainer.innerHTML = '';
      stylesheetLinkElement.remove();
      fontFaceStyleTag.remove();
    },
  };
}
