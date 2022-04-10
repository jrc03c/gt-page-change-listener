# Install

**Option #1:** Clone the repo:

```bash
git clone https://github.com/jrc03c/gt-page-change-listener
```

**Option #2:** Install with npm:

```bash
npm install --save https://github.com/jrc03c/gt-page-change-listener
```

**Option #3:** Download the repo as a zip file by clicking on the the green "Code" on [the repo's home page](https://github.com/jrc03c/gt-page-change-listener) and then selecting "Download ZIP". Then unzip the zip file.

# Use

Include the script in the "dist" folder in your HTML page:

```html
<script src="path/to/gt-pange-change-listener/dist/gt-page-change-listener.js"></script>
```

And add a callback just like you would when using `*trigger` from within a GT program (see [the relevant docs page](https://docs.guidedtrack.com/manual/advanced-options/triggering-a-javascript-event/#triggering-a-javascript-event)):

```js
$(window).on("gt-page-change", () => {
  console.log("The page has changed!")
})
```

Optionally, stop the listener whenever you're done using it:

```js
$(window).trigger("stop-gt-page-change-listener")
```

And restart it later:

```js
$(window).trigger("start-gt-page-change-listener")
```

(By default the listener starts as soon as the page loads, so there's no need to start it manually.)
