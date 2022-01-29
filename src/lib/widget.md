# BLOCKCLOCK Moscow Time Widget

Add a BLOCKCLOCK widget to your website. You can choose between two versions:

- Full BLOCKCLOCK including the transparent frame. Suitable for white / light background colors (works well with hex code `#FCFBF7`).
![Full BLOCKCLOCK with frame widget example](widget-example-with-frame.webp)
- BLOCKCLOCK without the transparent frame. Pick this if your background color doesn't blend well with the frame.
![BLOCKCLOCK with no frame widget example](widget-example-no-frame.webp)

## Instructions

1. Just before your closing `</head>` of your HTML, insert a `<script>` tag to import the required JavaScript and CSS to run the widget.

  ```html
  <head>
    <!-- Insert ONE of the below <script> tags before your closing </head> tag. -->
    <!-- NOTE: BLOCKCLOCK is a registered trademark of Coinkite Inc. -->
    <script async defer src="https://moscowtime.xyz/widget-with-frame.js"></script>
    <script async defer src="https://moscowtime.xyz/widget-no-frame.js"></script>
  </head>
  ```

1. Add an empty `<div>` with an `id="blockclock-container"` anywhere in your document flow where you would like insert the widget.

1. Use the appropriate `class` values to determine which views should be shown and how often they should be cycled. The supported values for different views are:
   - `blockheight`
   - `usdprice`
   - `satsperdollar`
   - `moscowtime`

1. Specify the cycle interval using `interval-n` class, where `n` is the number of milliseconds to wait between view changes (defaults to 3000 if unspecified).

1. Control the width of the widget by applying direct styles or targeting it from your existing CSS.

The following example will render a BLOCKCLOCK that cycles between moscowtime, usdprice and blockheight every 3 seconds and will not span wider than 700px.

```html
<div
  id="blockclock-container"
  class="moscowtime usdprice blockheight interval-3000"
  style="max-width: 700px"
></div>
```

Enjoy keepig an eye on Moscow Time!
