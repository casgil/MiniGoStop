# MiniGoStop

This repository contains the code for a Go/Stop short-term recognition task implemented with jsPsych. It was forked from the version by Florence Larkin (https://github.com/florencelarkin/MiniGoStop) and adapted for mobile-first use and easy embedding in Qualtrics.

## Task overview

- Participants view 5‑digit numbers presented sequentially.
- The rule: tap the blue "Match" button when a number is the same as the immediately preceding number (target trial).
- On some repeated numbers (stop trials), the number turns orange a short time after reappearing — participants must withhold the response.
- Non-repeating numbers are novel trials; no response is expected.

### Key parameters (defined in `main.js`)
- `stopTrials`: number of stop trials per run (default 4)
- `targetTrials`: number of target trials per run (default 4)
- `novelTrials`: number of novel trials per run (default 4)
- `stimDuration`: stimulus duration in ms for full presentations (default 500)
- `fixDuration`: fixation duration in ms (default 1000)
- `interval`: initial blue phase of stop trials before turning orange (default 150)

### Button and interaction
- Buttons are rendered by `jsPsychHtmlButtonResponse` and styled with `.button` classes in `index.html`.
- Mobile tap feedback is ensured via a delegated pointer handler that toggles a `.button--pressed` class on quick taps.

### Data
For each displayed screen, jsPsych records standard fields. Trial events include a `data.type` of `novel`, `fixation`, `stop`, or `target`, and a `correct_response` of `0` for target screens (button index) or `null` otherwise. We also compute `data.correct` in `on_finish` by comparing the response to `correct_response`.

## Running

- Local: open `index.html` via an HTTP server (recommended) or host on GitHub Pages.
- GitHub Pages demo: `https://casgil.github.io/MiniGoStop/`

## Embedding in Qualtrics

There are two parts:
1) Add a Descriptive Text question to host an iframe and paste a small JavaScript snippet in the Question JavaScript editor.
2) Ensure the hosted task sends a completion message back to Qualtrics.

This repository already includes the completion signal and an optional `?embed=1` flag to hide the jsPsych data table when embedded.

### 1) Qualtrics Question JavaScript

Use the script below or the copy in the repo at `Qualtrics_js_add_to_question.js`.

```javascript
Qualtrics.SurveyEngine.addOnload(function() {
  var nextBtn = document.getElementById('NextButton');
  if (nextBtn) nextBtn.style.display = 'none';

  var container = document.createElement('div');
  container.style.width = '100%';
  container.style.maxWidth = '100%';
  container.style.margin = '0 auto';
  container.style.padding = '0';

  var iframe = document.createElement('iframe');
  iframe.src = 'https://casgil.github.io/MiniGoStop/?embed=1';
  iframe.style.width = '100%';
  iframe.style.height = '90vh';
  iframe.style.border = '0';
  iframe.style.overflow = 'hidden';
  iframe.setAttribute('allow', 'fullscreen');

  container.appendChild(iframe);
  var qEl = this.getQuestionContainer();
  qEl.insertBefore(container, qEl.firstChild);

  var onMessage = function(event) {
    var data = event && event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'MINIGOSTOP_DONE') {
      try {
        Qualtrics.SurveyEngine.setEmbeddedData('MiniGoStop_Data', typeof data.payload === 'string' ? data.payload : JSON.stringify(data.payload));
      } catch (e) {}
      if (nextBtn) {
        nextBtn.style.display = '';
        nextBtn.click();
      }
      window.removeEventListener('message', onMessage);
    }
    if (data.type === 'MINIGOSTOP_RESIZE' && data.height) {
      iframe.style.height = String(data.height) + 'px';
    }
  };
  window.addEventListener('message', onMessage);

  setTimeout(function() {
    if (nextBtn && nextBtn.style.display === 'none') nextBtn.style.display = '';
  }, 20 * 60 * 1000);
});

Qualtrics.SurveyEngine.addOnUnload(function() {
  // Cleanup if needed
});
```

### 2) Completion signal from the task (already included)

In `main.js`, the jsPsych init sends a postMessage when the task finishes:

```javascript
const jsPsych = initJsPsych({
  on_finish: function() {
    try {
      if (window.parent) {
        window.parent.postMessage({
          type: 'MINIGOSTOP_DONE',
          payload: jsPsych.data.get().values()
        }, '*');
      }
    } catch (e) {}
    try {
      var isEmbedded = /[?&]embed=1(?!\w)/.test(window.location.search);
      if (!isEmbedded) jsPsych.data.displayData();
    } catch (e) {}
  }
});
```

### Survey Flow setup

Optionally add an Embedded Data element (e.g., `MiniGoStop_Data`) in Survey Flow before the block and set its value to '-1'. The Question JavaScript sets this key on completion with the task’s JSON data, which will be included in Qualtrics exports.

### Security and compatibility notes
- If desired, restrict the origin in `postMessage` by replacing `'*'` with your Qualtrics data center origin and in the Qualtrics code, check `event.origin === 'https://casgil.github.io'`.
- Mobile support: the task adds touch-friendly pointer handling to ensure fast tap visual feedback.
- If you later use camera/microphone plugins, add permissions to the iframe `allow` attribute (`camera; microphone`).

## Credits

- Original concept and prior implementation by Florence Larkin.
- This fork updates styling, mobile interactions, and Qualtrics embedding helpers.
