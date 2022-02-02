# BLOCKCLOCK Moscow Time Widget

Add a BLOCKCLOCK widget to your website. You can choose between two style options:

Full BLOCKCLOCK including the transparent frame. Suitable for white / light background colors (works well with hex code `#FCFBF7`).
![Full BLOCKCLOCK with frame widget example](widget-example-with-frame.webp)

BLOCKCLOCK without the transparent frame. Pick this if your background color doesn't blend well with the frame.
![BLOCKCLOCK with no frame widget example](widget-example-no-frame.webp)

## Quick Start

This should get you up and running quickly with most HTML sites that are server-rendered and don't have very complex JavaScript. If this doesn't work or you want to understand a bit more, see the **Advanced Use** section below.

1. Add an empty `<div>` with `id="blockclock-container"` anywhere in your document flow where you would like to insert the widget.

1. Add appropriate `class` values to determine which views should be shown. The supported values are: `blockheight`, `usdprice`, `satsperdollar`, `moscowtime`

1. For the no frame style add a `noframe` class.

1. Control the width of the widget by applying direct styles or targeting it from your existing CSS.

  The following example will render a BLOCKCLOCK that cycles between moscowtime, usdprice and blockheight every 3 seconds and will not span wider than 700px.

  ```html
  <div
    id="blockclock-container"
    class="moscowtime usdprice blockheight interval-3000"
    style="max-width: 700px"
  ></div>
  ```

1. Somewhere inside the `<head>` tag of your HTML, insert two `<script>` tags to import the required JavaScript and CSS to run the widget.

  ```html
  <head>
    <!-- Import the required widget code and styles. -->
    <script src="https://moscowtime.xyz/widget-v2.js"></script>
    <!-- When the window has finished loading, mount the widget in its appropriate place. -->
    <script>
      const blockClock;
      window.onload = function() {
        blockClock = mountBlockClock();
      }
    </script>
    <!-- NOTE: BLOCKCLOCK is a registered trademark of Coinkite Inc. -->
  </head>
  ```

## Advanced Use

### Setting the display cycle interval

By default, the widget switches display modes every 3 seconds. You can customize it by adding a class value of `interval-<milliseconds>` on the container div, e.g. `<div id="blockclock-container" class="usdprice blockheight interval-2000"></div>` will alternate between USD price and block height every 2 seconds.

### Dynamic Modes

The widget uses the **MutationObserver** JavaScript API that allows you to dynamically change the class values of the container and will react to changes without having to reload the page.

You can find an example of this on the [moscowtime.xyz](/) home page where the mode toggles add or remove classes from the container.

For example, you could add or remove the `noframe` class value based on whether the your site is in dark or light mode.

### Unmounting

The `mountBlockClock` function returns an object that contains an `unMount` function, which clears all intervals and event listeners, disconnects ResizeObserver and MutationObserver instances, and nulls all HTML mounted inside the container.

This can be useful if you are using client-side navigation (e.g. with a JavaScript framework) and need to ensure all external JavaScript stops running before the `blockclock-container` is removed from the page.

```javascript
// Mount the widget - the container div should be on the page.
const blockClock = mountBlockClock();

// Unmount before removing the container div.
blockClock.unMount();
```
