'use strict';

// #region Static Numbers

const DEFAULT_DISPLAY_UPDATE_INTERVAL_MS = 3000;
const FETCH_INTERVAL = 10000;
const VALID_DISPLAY_OPTIONS = ['blockheight', 'usdprice', 'satsperdollar', 'moscowtime'];

// MINI NO FRAME
const MINI_NOFRAME_ASPECT_RATIO = 320 / 954;
const MINI_NOFRAME_DIGITS_HEIGHT_RATIO = 0.59;
const MINI_NOFRAME_MAIN_FONT_HEIGHT_RATIO = 0.49;
const MINI_NOFRAME_TOP_SECTION_FONT_HEIGHT_RATIO = 0.0225;
const MINI_NOFRAME_SPECIAL_FONT_HEIGHT_RATIO = 0.1775;

// MINI WITH FRAME
const MINI_WITHFRAME_ASPECT_RATIO = 376 / 1010;
const MINI_WITHFRAME_DIGITS_HEIGHT_RATIO = 0.5075;
const MINI_WITHFRAME_MAIN_FONT_HEIGHT_RATIO = 0.425;
const MINI_WITHFRAME_TOP_SECTION_FONT_HEIGHT_RATIO = 0.019;
const MINI_WITHFRAME_SPECIAL_FONT_HEIGHT_RATIO = 0.15;

// MICRO
const MICRO_ASPECT_RATIO = 750 / 1280;
const MICRO_MAIN_FONT_SIZE_TO_HEIGHT_RATIO = 0.3125;
const MICRO_BOTTOM_FONT_SIZE_TO_HEIGHT_RATIO = 0.0455;
const MICRO_SPECIAL_FONT_SIZE_TO_HEIGHT_RATIO = 0.11;

// #endregion

// #region Static HTML
/*
  Static HTML strings used for various parts of the widget
*/
const MINI_HTML = `
  <div id="blockclock">
    <div id="blockclock-digits">
      <div class="blockclock-cell">
        <div id="blockclock-top-section-0" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-display-main-section-0" class="blockclock-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-1" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-display-main-section-1" class="blockclock-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-2" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-display-main-section-2" class="blockclock-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-3" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-display-main-section-3" class="blockclock-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-4" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-display-main-section-4" class="blockclock-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-5" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-display-main-section-5" class="blockclock-content"></div>
      </div>
      <div class="blockclock-cell">
        <div id="blockclock-top-section-6" class="blockclock-top-section blockclock-content"></div>
        <div id="blockclock-display-main-section-6" class="blockclock-content"></div>
      </div>
    </div>
  </div>
`;

const MICRO_HTML = `
  <div id="blockclock">
    <div id="blockclock-display">
      <div id="blockclock-display-main-section">
        <div id="blockclock-display-main-section-0" class="blockclock-content"></div>
        <div id="blockclock-display-main-section-1" class="blockclock-content"></div>
      </div>
      <div id="blockclock-display-bottom-section" class="blockclock-content"></div>
    </div>
  </div>
`;

const MINI_USDPRICE_HTML = `
  <div class="blockclock-special">
    <div class="blockclock-special-upper">BTC</div>
    <div class="blockclock-special-separator"></div>
    <div class="blockclock-special-lower">USD</div>
  </div>
`;

const MICRO_USDPRICE_HTML = `
  <div class="blockclock-special blockclock-special-usdprice">
    <div>BTC</div>
    <div class="blockclock-special-separator"></div>
    <div>USD</div>
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
    <div>SATS</div>
    <div class="blockclock-special-separator"></div>
    <div>1USD</div>
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
    <div>MSCW</div>
    <div class="blockclock-special-separator"></div>
    <div>TIME</div>
  </div>
`;
//#endregion

// MINI - sets the values of the top section of each cell
function setTopSections(values) {
  for (let i = 0; i < 7; i += 1) {
    document.getElementById(`blockclock-top-section-${i}`).innerHTML = values[i] || '';
  }
}

// MICRO - sets the text in the small bottom section.
function setBottomSection(value) {
  document.getElementById('blockclock-display-bottom-section').innerHTML = value;
}

// Sets the dimensions of various elements on the widget depending on the size of the container.
function setDimensions({ noFrame = false, clockModel = 'mini' } = {}) {
  let aspectRatio;

  switch (clockModel) {
    case 'mini':
      if (noFrame) {
        aspectRatio = MINI_NOFRAME_ASPECT_RATIO;
      } else {
        aspectRatio = MINI_WITHFRAME_ASPECT_RATIO;
      }
      break;
    case 'micro':
      aspectRatio = MICRO_ASPECT_RATIO;
      break;
    default:
      break;
  }

  const clockContainer = document.getElementById('blockclock-container');
  const clock = document.getElementById('blockclock');
  const digits = document.getElementById('blockclock-digits');

  // USED FOR MICRO ONLY
  const clockDisplayMainSection = document.getElementById('blockclock-display-main-section');
  const clockDisplayBottomSection = document.getElementById('blockclock-display-bottom-section');

  clockContainer.style.height = `${aspectRatio * clockContainer.clientWidth}px`;
  clock.style.height = `${aspectRatio * clockContainer.clientWidth}px`;

  if (clockModel === 'mini') {
    digits.style.height = noFrame
      ? `${MINI_NOFRAME_DIGITS_HEIGHT_RATIO * clock.clientHeight}px`
      : `${MINI_WITHFRAME_DIGITS_HEIGHT_RATIO * clock.clientHeight}px`;

    Array.from(document.getElementsByClassName('blockclock-content')).forEach((el) => {
      el.style.fontSize = noFrame
        ? `${MINI_NOFRAME_MAIN_FONT_HEIGHT_RATIO * clock.clientHeight}px`
        : `${MINI_WITHFRAME_MAIN_FONT_HEIGHT_RATIO * clock.clientHeight}px`;
    });

    Array.from(document.getElementsByClassName('blockclock-top-section')).forEach((el) => {
      el.style.fontSize = noFrame
        ? `${MINI_NOFRAME_TOP_SECTION_FONT_HEIGHT_RATIO * clock.clientHeight}px`
        : `${MINI_WITHFRAME_TOP_SECTION_FONT_HEIGHT_RATIO * clock.clientHeight}px`;
    });

    Array.from(document.getElementsByClassName('blockclock-special')).forEach((el) => {
      el.style.fontSize = noFrame
        ? `${MINI_NOFRAME_SPECIAL_FONT_HEIGHT_RATIO * clock.clientHeight}px`
        : `${MINI_WITHFRAME_SPECIAL_FONT_HEIGHT_RATIO * clock.clientHeight}px`;
    });
  }

  if (clockModel === 'micro') {
    clockDisplayMainSection.style.fontSize = `${
      MICRO_MAIN_FONT_SIZE_TO_HEIGHT_RATIO * clock.clientHeight
    }px`;

    clockDisplayBottomSection.style.fontSize = `${
      MICRO_BOTTOM_FONT_SIZE_TO_HEIGHT_RATIO * clock.clientHeight
    }px`;

    Array.from(document.getElementsByClassName('blockclock-special')).forEach((el) => {
      el.style.fontSize = `${MICRO_SPECIAL_FONT_SIZE_TO_HEIGHT_RATIO * clock.clientHeight}px`;
    });
  }
}

// Handles the changing of different views of the widget.
function cycleView({ displayOptions, activeOption, displayData, clockModel }) {
  // Clear all content if no display options are selected
  if (!displayOptions.length) {
    document.querySelectorAll('.blockclock-content').forEach((cell) => {
      cell.innerHTML = '';
    });
    return;
  }

  let activeView = displayOptions[activeOption];

  const { priceUsd, satUsd, blockHeight } = displayData;

  switch (activeView) {
    case 'usdprice':
      if (clockModel === 'mini') {
        setTopSections(['Market price of', 'bitcoin']);
        document.getElementById('blockclock-display-main-section-0').innerHTML = MINI_USDPRICE_HTML;
        document.getElementById('blockclock-display-main-section-1').innerHTML = '$';

        // Determine which format to use based on number of digits in price.
        switch (true) {
          case priceUsd.length > 6:
            document.getElementById(
              'blockclock-display-main-section-2'
            ).innerHTML = `${priceUsd[0]}.`;
            document.getElementById('blockclock-display-main-section-3').innerHTML = priceUsd[1];
            document.getElementById('blockclock-display-main-section-4').innerHTML = priceUsd[2];
            document.getElementById('blockclock-display-main-section-5').innerHTML = priceUsd[3];
            document.getElementById('blockclock-display-main-section-6').innerHTML = 'M';
            break;
          case priceUsd.length > 5:
            document.getElementById('blockclock-display-main-section-2').innerHTML = priceUsd[0];
            document.getElementById('blockclock-display-main-section-3').innerHTML = priceUsd[1];
            document.getElementById(
              'blockclock-display-main-section-4'
            ).innerHTML = `${priceUsd[2]}.`;
            document.getElementById('blockclock-display-main-section-5').innerHTML = priceUsd[3];
            document.getElementById('blockclock-display-main-section-6').innerHTML = 'K';
            break;
          default:
            for (let i = 2; i < 7; i += 1) {
              document.getElementById(`blockclock-display-main-section-${i.toString()}`).innerHTML =
                priceUsd[priceUsd.length - 7 + i] || '';
            }
            break;
        }
      } else if (clockModel === 'micro') {
        // document.getElementById('blockclock-display').style.backgroundImage =
        //   "url('/z_usdprice.jpg')";
        setBottomSection('Market price of Bitcoin');
        document.getElementById('blockclock-display-main-section-0').innerHTML =
          MICRO_USDPRICE_HTML;
        document.getElementById('blockclock-display-main-section-1').innerHTML = `$${priceUsd}`;
      }

      break;

    case 'satsperdollar':
      if (clockModel === 'mini') {
        setTopSections(['Value of one US', 'Dollar,', 'expressed in', 'Satoshis']);
        document.getElementById('blockclock-display-main-section-0').innerHTML =
          MINI_SATSPERDOLLAR_HTML;
        // Set the digits.
        for (let i = 1; i < 7; i += 1) {
          document.getElementById(`blockclock-display-main-section-${i.toString()}`).innerHTML =
            satUsd[satUsd.length - 7 + i] || '';
        }
      } else if (clockModel === 'micro') {
        // document.getElementById('blockclock-display').style.backgroundImage =
        //   "url('/z_satsperdollar.jpg')";
        setBottomSection('Value of one US Dollar, expressed in Satoshis');
        document.getElementById('blockclock-display-main-section-0').innerHTML =
          MICRO_SATSPERDOLLAR_HTML;
        document.getElementById('blockclock-display-main-section-1').innerHTML = `${satUsd}`;
      }

      break;

    case 'blockheight':
      if (clockModel === 'mini') {
        setTopSections(['Number of blocks', 'in the', 'blockchain']);
        for (let i = 0; i < 7; i += 1) {
          document.getElementById(`blockclock-display-main-section-${i.toString()}`).innerHTML =
            blockHeight[blockHeight.length - 7 + i] || '';
        }
      } else if (clockModel === 'micro') {
        // document.getElementById('blockclock-display').style.backgroundImage =
        //   "url('/z_blockheight.jpg')";
        setBottomSection('Number of blocks in the blockchain');
        document.getElementById('blockclock-display-main-section-0').innerHTML = '';
        document.getElementById('blockclock-display-main-section-1').innerHTML = `${blockHeight}`;
      }

      break;

    case 'moscowtime':
      if (clockModel === 'mini') {
        setTopSections([]);
        document.getElementById('blockclock-display-main-section-0').innerHTML =
          MINI_MOSCOWTIME_HTML;
        // Set the digits.
        for (let i = 1; i < 7; i += 1) {
          document.getElementById(`blockclock-display-main-section-${i.toString()}`).innerHTML =
            satUsd[satUsd.length - 7 + i] || '';
        }
      } else if (clockModel === 'micro') {
        // document.getElementById('blockclock-display').style.backgroundImage =
        //   "url('/z_moscowtime.jpg')";
        setBottomSection('');
        document.getElementById('blockclock-display-main-section-0').innerHTML =
          MICRO_MOSCOWTIME_HTML;
        document.getElementById('blockclock-display-main-section-1').innerHTML = `${satUsd}`;
      }

      break;

    default:
      break;
  }
}

// Parses the HTML classes on the container and returns the array of all valid display options.
function getDisplayOptions(clockContainer) {
  return Array.from(clockContainer.classList).filter((className) => {
    return VALID_DISPLAY_OPTIONS.includes(className);
  });
}

// Parses the HTML classes on the container and returns the requested BLOCKCLOCK model. Defaults to mini.
function getClockModel(clockContainer) {
  if (clockContainer.classList.contains('model-mini')) {
    return 'mini';
  } else if (clockContainer.classList.contains('model-micro')) {
    return 'micro';
  } else {
    return 'mini';
  }
}

// Parses the HTML classes on the container and returns the milliseconds from 'interval-n' class. Defaults to 3000.
function getDisplayUpdateIntervalMs(clockContainer) {
  let interval;
  Array.from(clockContainer.classList).forEach((className) => {
    if (className.includes('interval-')) {
      const regexp = /^(interval-)(\d+)$/gi;
      const matches = [...className.matchAll(regexp)];
      if (matches.length) {
        const intervalValue = parseInt(matches[0][2]);
        if (typeof intervalValue === 'number') interval = intervalValue;
      }
    }
  });
  return interval || DEFAULT_DISPLAY_UPDATE_INTERVAL_MS;
}

// Fetches price and block data from external APIs.
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

// Main function that handles the running of the widget.
function mountBlockClock({ value, baseUrl = 'https://moscowtime.xyz' } = {}) {
  const clockContainer = document.getElementById('blockclock-container'); // grab the container element
  const clockModel = getClockModel(clockContainer); // mini or micro
  let displayUpdateIntervalMs = getDisplayUpdateIntervalMs(clockContainer); // display update interval in milliseconds
  let cssFilePath; // path to CSS file
  let backgroundImage; // background image of the widget
  let noFrame = Array.from(clockContainer.classList).includes('noframe'); // if true, use the no frame version
  let displayOptions = getDisplayOptions(clockContainer); // array of selected display options
  let activeOption = 0; // index of active display option
  let displayUpdateInterval; // JS interval for periodically cycling through display options (configured further down)
  let dataFetchInterval; // JS interval for periodically fetching data from external APIs (configured further down)

  // If a desired value was passed in, ensure that only a single display option is set.
  if (value && displayOptions.length > 1) {
    console.error(
      'Incorrect widget configuration. You can only specify one display option if value is specified'
    );
    alert(
      'Incorrect widget configuration. You can only specify one display option if value is specified'
    );
    return;
  }

  // Create the appropriate HTML and pull in the right CSS file based on model and frame/noframe.
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

  // Create parts of CSS that have dynamic values.
  const dynamicCss = `
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

  // Create a <style> tag with dynamic css.
  const dynamicCssStyleElement = document.createElement('style');
  dynamicCssStyleElement.appendChild(document.createTextNode(dynamicCss));
  document.head.appendChild(dynamicCssStyleElement);

  // Create a <link> tag to apply styles from CSS file.
  const externalStylesheetLinkElement = document.createElement('link');
  externalStylesheetLinkElement.href = cssFilePath;
  externalStylesheetLinkElement.type = 'text/css';
  externalStylesheetLinkElement.rel = 'stylesheet';
  document.head.appendChild(externalStylesheetLinkElement);

  // Observe and react to changes of the container dimensions.
  const clockSizeObserver = new ResizeObserver(() => {
    setDimensions({ noFrame, clockModel });
  });
  clockSizeObserver.observe(clockContainer);

  // Observe and react to changes of the container classes.
  const clockClassObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        displayOptions = getDisplayOptions(clockContainer);
        noFrame = Array.from(clockContainer.classList).includes('noframe');
        externalStylesheetLinkElement.href = cssFilePath;
        cycleView({ displayOptions, activeOption, displayData, clockModel });
        setDimensions({ noFrame, clockModel });
      }
    });
  });
  clockClassObserver.observe(clockContainer, { attributes: true });

  // Object for tracking the data that is displayed.
  // If a value was passed in use that. Otherwise, initialise to 'undefined' and set later from API.
  const displayData = {
    priceUsd: value && displayOptions[0] === 'usdprice' ? value : undefined,
    satUsd:
      value && (displayOptions[0] === 'satsperdollar' || displayOptions[0] === 'moscowtime')
        ? value
        : undefined,
    blockHeight: value && displayOptions[0] === 'blockheight' ? value : undefined,
  };

  if (!value) {
    // If value was not passed in, fetch data from external APIs, update the display and configure JS intervals.
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

      displayUpdateInterval = setInterval(() => {
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
      }, displayUpdateIntervalMs);
    });

    dataFetchInterval = setInterval(() => {
      fetchData().then((data) => {
        displayData.priceUsd = data.priceUsd;
        displayData.satUsd = data.satUsd;
        displayData.blockHeight = data.blockHeight;
      });
    }, FETCH_INTERVAL);
  } else {
    // If value was passed in, update the display and finish.
    cycleView({
      displayOptions,
      activeOption,
      displayData,
      clockModel,
    });
    setDimensions({ noFrame, clockModel });
  }

  // Return an object with an unMount function that cleans up everything.
  return {
    unMount: () => {
      clearInterval(displayUpdateInterval);
      clearInterval(dataFetchInterval);
      clockSizeObserver.disconnect();
      clockClassObserver.disconnect();
      clockContainer.innerHTML = '';
      externalStylesheetLinkElement.remove();
      dynamicCssStyleElement.remove();
    },
  };
}
