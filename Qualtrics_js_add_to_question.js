Qualtrics.SurveyEngine.addOnload(function() {
  // Hide Next until task finishes
  var nextBtn = document.getElementById('NextButton');
  if (nextBtn) nextBtn.style.display = 'none';

  // Create an iframe container
  var container = document.createElement('div');
  container.style.width = '100%';
  container.style.maxWidth = '100%';
  container.style.margin = '0 auto';
  container.style.padding = '0';

  // Create the iframe to your task
  var iframe = document.createElement('iframe');
  iframe.src = 'https://casgil.github.io/MiniGoStop/?embed=1'; // add ?embed=1 for any embed-specific styling you may add later
  iframe.style.width = '100%';
  iframe.style.height = '90vh'; // tall enough for mobile; adjust as needed
  iframe.style.border = '0';
  iframe.style.overflow = 'hidden';
  iframe.setAttribute('allow', 'fullscreen'); // add camera/microphone if needed: 'fullscreen; camera; microphone'

  container.appendChild(iframe);

  // Insert as the first element of the question
  var qEl = this.getQuestionContainer();
  qEl.insertBefore(container, qEl.firstChild);

  // Listen for completion messages from the task
  var onMessage = function(event) {
    // If you later restrict with origin, use: if (event.origin !== 'https://casgil.github.io') return;
    var data = event && event.data;
    if (!data || typeof data !== 'object') return;

    // Expected completion signal
    if (data.type === 'MINIGOSTOP_DONE') {
      // Optionally store results into Embedded Data for later download
      try {
        Qualtrics.SurveyEngine.setEmbeddedData('MiniGoStop_Data', typeof data.payload === 'string' ? data.payload : JSON.stringify(data.payload));
      } catch (e) {}

      // Show and auto-advance
      if (nextBtn) {
        nextBtn.style.display = '';
        nextBtn.click();
      }
      window.removeEventListener('message', onMessage);
    }

    // Optional: support dynamic resize from the task
    if (data.type === 'MINIGOSTOP_RESIZE' && data.height) {
      iframe.style.height = String(data.height) + 'px';
    }
  };

  window.addEventListener('message', onMessage);

  // Safety fallback: reveal Next after 20 minutes in case participant abandons or message is blocked
  setTimeout(function() {
    if (nextBtn && nextBtn.style.display === 'none') {
      nextBtn.style.display = '';
    }
  }, 20 * 60 * 1000);
});

Qualtrics.SurveyEngine.addOnUnload(function() {
  // Clean up listeners if Qualtrics navigates away
  window.removeEventListener('message', function() {});
});