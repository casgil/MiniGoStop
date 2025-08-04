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
3. [Add the following Javascript.](https://github.com/kelvinlim/MiniGoStop/blob/main/qualtrics_question.js)

4. From the Survey tab, select SurveyFlow and add "Set Embedded Data"
5. Add a New Field GoStop and set it's value to -1.  This is how the data from the 
   jspsych task is passed to qualtrics to be saved in the response.  The EmbeddedData GoStop
   corresponds to the entry in the question JavaScript where the data is returned from jspsych.

   The code can be found at line 53 in `qualtrics_question.js`.[View the code component here](https://github.com/kelvinlim/MiniGoStop/blob/main/qualtrics_question.js#L52-L58)
