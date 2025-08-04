# MiniGoStop

This repository contains the code for a GoStop task written in jspsych. 
It was forked from the version
written by Florence Larkin (https://github.com/florencelarkin/MiniGoStop).  

The reason for the fork was to change the size of the buttons and fonts to make it
easier to run on mobile.  A future enhancement will be to have it adapt to platforms
dynamically.

The main deployment for this task has been using Qualtrics.

## Configuration with Qualtrics

Steps:

1. Create a new Block to hold the task.
2. Create a question.
3. Add the following Javascript. [View the code component here](https://github.com/kelvinlim/MiniGoStop/blob/main/qualtrics_question.js)
   
```
Qualtrics.SurveyEngine.addOnload(function()
{
/*Place your JavaScript here to run when the page loads*/
// Retrieve Qualtrics object and save in qthis
var qthis = this;

// Hide buttons
qthis.hideNextButton();

var task_github = "https://kelvinlim.github.io/MiniGoStop/"; // https://<your-github-username>.github.io/<your-experiment-name>

// requiredResources must include all the JS files that .html uses.
var requiredResources = [
	task_github + "jspsych/jspsych.js",
	task_github + "jspsych/plugin-html-button-response.js", 
	task_github + "jspsych/jspsych.css",
	task_github + "main.js",
	"https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js",
    "https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js",
];

function loadScript(idx) {
    console.log("Loading ", requiredResources[idx]);
    jQuery.getScript(requiredResources[idx], function () {
        if ((idx + 1) < requiredResources.length) {
            loadScript(idx + 1);
        } else {
            initExp();
        }
    });
}



if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
    loadScript(0);
}

// jQuery is loaded in Qualtrics by default
jQuery("<div id = 'display_stage_background'></div>").appendTo('body');
jQuery("<div id = 'display_stage'></div>").appendTo('body');


function initExp(){
    /* start the experiment*/
    var jsPsych = initJsPsych({
		
        /* Change 1: Using `display_element` */
        display_element: 'display_stage',
        on_finish: function() {
            //jsPsych.data.displayData(); // comment out if you do not want to display results at the end of task
            /* Saving task data to qualtrics */
			var GoStop = jsPsych.data.get().json();
			console.log(GoStop)
			GoStop.toString()
			// save to qualtrics embedded data
			Qualtrics.SurveyEngine.setEmbeddedData("GoStop", GoStop);
			
           
            // clear the stage
            jQuery('#display_stage').remove();
            jQuery('#display_stage_background').remove();

            // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
            qthis.clickNextButton();
        }
      }); 
	jsPsych.run(timeline);
    }
//end
});

Qualtrics.SurveyEngine.addOnReady(function()
{
	/*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/

});

```

4. From the Survey tab, select SurveyFlow and add "Set Embedded Data"
5. Add a New Field GoStop and set it's value to -1.  This is how the data from the 
   jspsych task is passed to qualtrics to be saved in the response.  The EmbeddedData GoStop
   corresponds to the entry in the question JavaScript where the data is returned from jspsych.

   The code can be found at line 53 in `qualtrics_question.js`.[View the code component here](https://github.com/kelvinlim/MiniGoStop/blob/main/qualtrics_question.js#L52-L58)
