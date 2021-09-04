"use strict";

const CLOCK_HTML = `
<div id="clock">
  <div id="digits">
    <div class="cell">
      <div id="top-section-0" class="top-section"></div>
      <div id="0" class="special-content"></div>
    </div>
    <div class="cell">
      <div id="top-section-1" class="top-section"></div>
      <div id="1" class="digit-content"></div>
    </div>
    <div class="cell">
      <div id="top-section-2" class="top-section"></div>
      <div id="2" class="digit-content"></div>
    </div>
    <div class="cell">
      <div id="top-section-3" class="top-section"></div>
      <div id="3" class="digit-content"></div>
    </div>
    <div class="cell">
      <div id="top-section-4" class="top-section"></div>
      <div id="4" class="digit-content"></div>
    </div>
    <div class="cell">
      <div id="top-section-5" class="top-section"></div>
      <div id="5" class="digit-content"></div>
    </div>
    <div class="cell">
      <div id="top-section-6" class="top-section"></div>
      <div id="6" class="digit-content"></div>
    </div>
  </div>
</div>
`;

/**
 * To change the order of different views, change the order of
 * elements in this array.
 */
const OPTIONS = ["MOSCOWTIME", "HEIGHT", "BTCUSD", "SATUSD"];

/**
 * To change how often the views change, set CYCLE_INTERVAL to an appropriate
 * value in milliseconds.
 */
const CYCLE_INTERVAL = 300000;

const BTC_USD_HTML = `
  <div>
    <div class="special-upper">&nbsp;BTC&nbsp;</div>
    <div class="special-separator"></div>
    <div class="special-lower">&nbsp;USD&nbsp;</div>
  </div>
`;

const SAT_USD_HTML = `
  <div>
    <div class="special-upper">&nbsp;SATS&nbsp;</div>
    <div class="special-separator"></div>
    <div class="special-lower">&nbsp;USD&nbsp;</div>
  </div>
`;

const MOSCOW_TIME_HTML = `
  <div>
    <div class="special-upper-small">&nbsp;MOSCOW&nbsp;</div>
    <div class="special-separator"></div>
    <div class="special-lower-small">&nbsp;TIME&nbsp;</div>
  </div>
`;

// Sets the values of the top section of each cell
function setTopSections(values) {
  for (let i = 0; i < 7; i += 1) {
    document.getElementById(`top-section-${i}`).innerHTML = values[i] || "";
  }
}

let activeView = OPTIONS[0];

function setDimensions() {
  const clockContainer = document.getElementById("blockclock-container");
  const clock = document.getElementById("clock");
  const digits = document.getElementById("digits");

  clockContainer.style.height = `${0.336 * clockContainer.clientWidth}px`;
  clock.style.height = `${0.336 * clockContainer.clientWidth}px`;
  digits.style.height = `${0.59 * clock.clientHeight}px`

  Array.from(document.getElementsByClassName("digit-content")).forEach((el) => {
    el.style.fontSize = `${0.49 * clock.clientHeight}px`;
  });

  Array.from(document.getElementsByClassName("top-section")).forEach((el) => {
    el.style.fontSize = `${0.0225 * clock.clientHeight}px`;
  });

  Array.from(document.getElementsByClassName("special-content")).forEach(
    (el) => {
      el.style.fontSize = `${0.2 * clock.clientHeight}px`;
    }
  );

  Array.from(document.getElementsByClassName("special-upper-small")).forEach(
    (el) => {
      el.style.fontSize = `${0.1125 * clock.clientHeight}px`;
    }
  );
}

// All main logic lives in this function
function cycleView() {
  switch (activeView) {
    case OPTIONS[0]:
      activeView = OPTIONS[1];
      break;
    case OPTIONS[1]:
      activeView = OPTIONS[2];
      break;
    case OPTIONS[2]:
      activeView = OPTIONS[3];
      break;
    case OPTIONS[3]:
      activeView = OPTIONS[0];
      break;
    default:
      activeView = OPTIONS[0];
      break;
  }

  switch (activeView) {
    case "BTCUSD":
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      ).then((res) => {
        res.json().then((data) => {
          /**
           * To test longer/shorter price values, comment out the next
           * line and set btcUsd to an arbitrary number in string format.
           */
          let btcUsd = Math.round(parseFloat(data.bitcoin.usd)).toString();

          // Ensure the first cell has the right CSS class, so it can display special text.
          // document.getElementById("0").classList.remove("digit-content");
          // document.getElementById("0").classList.add("special-content");

          // Set the top sections.
          setTopSections(["Market price of", "bitcoin"]);

          // Set first and second cell to show BTC/USD and $ sign.
          document.getElementById("0").innerHTML = BTC_USD_HTML;
          document.getElementById("1").innerHTML = "$";

          // Determine which format to use based on number of digits in price.
          switch (true) {
            case btcUsd.length > 6:
              document.getElementById("2").innerHTML = `${btcUsd[0]}.`;
              document.getElementById("3").innerHTML = btcUsd[1];
              document.getElementById("4").innerHTML = btcUsd[2];
              document.getElementById("5").innerHTML = btcUsd[3];
              document.getElementById("6").innerHTML = "M";
              break;
            case btcUsd.length > 5:
              document.getElementById("2").innerHTML = btcUsd[0];
              document.getElementById("3").innerHTML = btcUsd[1];
              document.getElementById("4").innerHTML = `${btcUsd[2]}.`;
              document.getElementById("5").innerHTML = btcUsd[3];
              document.getElementById("6").innerHTML = "K";
              break;
            default:
              for (let i = 2; i < 7; i += 1) {
                document.getElementById(i.toString()).innerHTML =
                  btcUsd[btcUsd.length - 7 + i] || "";
              }
              break;
          }
        });

        // Update dimensions
        setDimensions();
      });
      break;

    case "SATUSD":
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      ).then((res) => {
        res.json().then((data) => {
          let btcUsd = parseFloat(data.bitcoin.usd);

          /**
           * To test longer/shorter sats per dollar values, comment out the
           * next line and set satUsd to an arbitrary number in string format.
           */
          let satUsd = Math.round((1 / btcUsd) * 100000000).toString();

          // Ensure the first cell has the right CSS class, so it can display special text.
          // document.getElementById("0").classList.remove("digit-content");
          // document.getElementById("0").classList.add("special-content");

          // Set the first cell to show SATS / USD.
          document.getElementById("0").innerHTML = SAT_USD_HTML;

          /**
           * If the sats per dollar view should display any text in the upper
           * sections of the slots, this can be set here. See BTCUSD and HEIGHT
           * views for examples above and below.
           */
          setTopSections([]);

          // Set the digits.
          for (let i = 1; i < 7; i += 1) {
            document.getElementById(i.toString()).innerHTML =
              satUsd[satUsd.length - 7 + i] || "";
          }

          // Update dimensions
          setDimensions();
        });
      });
      break;

    case "HEIGHT":
      fetch("https://blockstream.info/api/blocks/tip/height").then((res) => {
        res.json().then((data) => {
          /**
           * To test longer/shorter block height values, comment out the
           * next line and set blockHeight to an arbitrary number in string format.
           */
          let blockHeight = data.toString();

          // Ensure the first cell has the right CSS class, so it can display a digit.
          // document.getElementById("0").classList.remove("special-content");
          // document.getElementById("0").classList.add("digit-content");

          for (let i = 0; i < 7; i += 1) {
            document.getElementById(i.toString()).innerHTML =
              blockHeight[blockHeight.length - 7 + i] || "";
          }

          setTopSections(["Number of blocks", "in the", "blockchain"]);
          // Update dimensions
          setDimensions();
        });
      });
      break;

    case "MOSCOWTIME":
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      ).then((res) => {
        res.json().then((data) => {
          let btcUsd = parseFloat(data.bitcoin.usd);

          /**
           * To test longer/shorter sats per dollar values, comment out the
           * next line and set satUsd to an arbitrary number in string format.
           */
          let satUsd = Math.round((1 / btcUsd) * 100000000).toString();

          // Ensure the first cell has the right CSS class, so it can display special text.
          // document.getElementById("0").classList.remove("digit-content");
          // document.getElementById("0").classList.add("special-content");

          // Set the first cell to show SATS / USD.
          document.getElementById("0").innerHTML = MOSCOW_TIME_HTML;

          /**
           * If the sats per dollar view should display any text in the upper
           * sections of the slots, this can be set here. See BTCUSD and HEIGHT
           * views for examples above and below.
           */
          setTopSections([]);

          // Set the digits.
          for (let i = 1; i < 7; i += 1) {
            document.getElementById(i.toString()).innerHTML =
              satUsd[satUsd.length - 7 + i] || "";
          }

          // Update dimensions
          setDimensions();
        });
      });
      break;

    default:
      break;
  }
}

const file = location.pathname.split("/").pop();

window.onload = () => {

  const link = document.createElement("link");
  link.href = "widget.css"; //file.substr( 0, file.lastIndexOf( "." ) ) + ".css";
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
  
  document.getElementById("blockclock-container").innerHTML = CLOCK_HTML;
  
  setDimensions();
  window.onresize = setDimensions;
  
  cycleView();
  setInterval(cycleView, CYCLE_INTERVAL);
}

