# Moscow Time / Blockclock Widget

Celebrate 1952 Moscow Time by adding a BLOCKCLOCK widget to your website.

First, add the following `<script>` tag within the `<head>` of your HTML.

```html
<head>
  <!-- Insert the script tag just before your closing head tag. -->
  <script src="https://moscowtime.xyz/widget.js"></script>
</head>
```

Then, add a `<div>` with an `id` of `blockclock-container` anywhere in your document flow where you would like insert the widget.

Use the appropriate `class` values to determine which views should be shown and how often they should be cycled. The supported values for different views are `blockheight`, `usdprice`, `satsperdollar` and `moscowtime`. You can specify the cycle interval using `interval-n` where `n` is the number of milliseconds to wait between view changes (defaults to 3000).

Control the width of the widget by applying direct styles or targeting it from your exising CSS.

The following example will render a BLOCKCLOCK that cycles between `moscowtime`, `usdprice` and `blockheight` every 3 seconds and will not span wider than `700px`.

```html
<div id="blockclock-container" class="moscowtime usdprice blockheight interval-3000" style="max-width: 700px"></div>
```
