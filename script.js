"use strict";

/**
 * To change the order of different views, change the order of
 * elements in this array.
 */
const OPTIONS = [
  "MOSCOWTIME",
  // "BTCUSD",
  // "SATUSD",
  // "HEIGHT",
];

/**
 * To change how often the views change, set CYCLE_INTERVAL to an appropriate
 * value in milliseconds.
 */
const CYCLE_INTERVAL = 10000;

const BTC_USD_HTML = `
  <div>
    <div id="special-upper">&nbsp;BTC&nbsp;</div>
    <div class="special-separator"></div>
    <div id="special-lower">&nbsp;USD&nbsp;</div>
  </div>
`;

const SAT_USD_HTML = `
  <div>
    <div id="special-upper">&nbsp;SATS&nbsp;</div>
    <div class="special-separator"></div>
    <div id="special-lower">&nbsp;USD&nbsp;</div>
  </div>
`;

const MOSCOW_TIME_HTML = `
  <div>
    <div id="special-upper-small">&nbsp;MOSCOW&nbsp;</div>
    <div class="special-separator"></div>
    <div id="special-lower-small">&nbsp;TIME&nbsp;</div>
  </div>
`;

// Sets the values of the top section of each cell
function setTopSections(values) {
  for (let i = 0; i < 7; i += 1) {
    document.getElementById(`top-section-${i}`).innerHTML = values[i] || "";
  }
}

let activeView = OPTIONS[0];

// All main logic lives in this function
function cycleView() {
  // switch (activeView) {
  //   case OPTIONS[0]:
  //     activeView = OPTIONS[1];
  //     break;
  //   case OPTIONS[1]:
  //     activeView = OPTIONS[2];
  //     break;
  //   case OPTIONS[2]:
  //     activeView = OPTIONS[3];
  //     break;
  //   case OPTIONS[3]:
  //     activeView = OPTIONS[0];
  //     break;
  //   default:
  //     activeView = OPTIONS[0];
  //     break;
  // }

  switch (activeView) {
    case "BTCUSD":
      fetch("https://api.coincap.io/v2/rates/bitcoin").then((res) => {
        res.json().then((data) => {
          /**
           * To test longer/shorter price values, comment out the next
           * line and set btcUsd to an arbitrary number in string format.
           */
          let btcUsd = Math.round(parseFloat(data.data.rateUsd)).toString();

          // Ensure the first cell has the right CSS class, so it can display special text.
          document.getElementById("0").classList.remove("digit-content");
          document.getElementById("0").classList.add("special-content");

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
      });
      break;

    case "SATUSD":
      fetch("https://api.coincap.io/v2/rates/bitcoin").then((res) => {
        res.json().then((data) => {
          let btcUsd = parseFloat(data.data.rateUsd);

          /**
           * To test longer/shorter sats per dollar values, comment out the
           * next line and set satUsd to an arbitrary number in string format.
           */
          let satUsd = Math.round((1 / btcUsd) * 100000000).toString();

          // Ensure the first cell has the right CSS class, so it can display special text.
          document.getElementById("0").classList.remove("digit-content");
          document.getElementById("0").classList.add("special-content");

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
          document.getElementById("0").classList.remove("special-content");
          document.getElementById("0").classList.add("digit-content");

          for (let i = 0; i < 7; i += 1) {
            document.getElementById(i.toString()).innerHTML =
              blockHeight[blockHeight.length - 7 + i] || "";
          }

          setTopSections(["Number of blocks", "in the", "blockchain"]);
        });
      });
      break;

    case "MOSCOWTIME":
      fetch("https://api.coincap.io/v2/rates/bitcoin").then((res) => {
        res.json().then((data) => {
          let btcUsd = parseFloat(data.data.rateUsd);

          /**
           * To test longer/shorter sats per dollar values, comment out the
           * next line and set satUsd to an arbitrary number in string format.
           */
          let satUsd = Math.round((1 / btcUsd) * 100000000).toString();

          // Ensure the first cell has the right CSS class, so it can display special text.
          document.getElementById("0").classList.remove("digit-content");
          document.getElementById("0").classList.add("special-content");

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
        });
      });
      break;

    default:
      break;
  }
}

cycleView();

setInterval(cycleView, CYCLE_INTERVAL);
