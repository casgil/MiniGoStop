const stopTrials = 4;
const targetTrials = 4;
const novelTrials = 4;
const stimDuration = 500;
const fixDuration = 1000;
const interval = 150;

function getStim() {
    const number = Math.floor(Math.random() * 90000) + 10000;
    return number;
}

// Shared on_finish handler reused across trials
function onFinishTrial(data){
    data.correct = data.response === data.correct_response;
}

function buildTrialVariables(stopCount, targetCount, novelCount){
    const vars = [];
    for (let i = 0; i < stopCount; i++) vars.push({ stimulus: getStim(), kind: 'stop' });
    for (let i = 0; i < targetCount; i++) vars.push({ stimulus: getStim(), kind: 'target' });
    for (let i = 0; i < novelCount; i++) vars.push({ stimulus: getStim(), kind: 'novel' });
    return vars;
}

const timeline = [];

const instructions1 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p style="font-size:25px;"><b>GoStop Task</b></p>
    <p style="font-size:20px;">The goal of this task is to correctly respond when the number presented on the screen is the same as the number that was presented right before it.</p>
    <p style="font-size:20px;">Press next for more instructions.</p>
  `,
  choices: ['NEXT'],
  button_html: '<button class="button button--sm">%choice%</button>',
  response_ends_trial: true,

  post_trial_gap: 1000
};
timeline.push(instructions1);

const instructions2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p style="font-size:20px;">When you see a number that is the same as the number presented right before it, press the blue button as quickly as possible.</p>
    <p style="font-size:20px;">However, some numbers will turn orange a short time after they appear. Do NOT press the blue button in this case.</p>
    <p style="font-size:20px;">Try to be as accurate as possible while still keeping up with the numbers. </p>
    <p style="font-size:20px;">Press the button below to begin.</p>
  `,
  button_html: '<button class="button button--md">%choice%</button>',
  choices: ['START'],
  response_ends_trial: true,
  post_trial_gap: 1000
};
timeline.push(instructions2);

const task_procedure = {
    timeline_variables: buildTrialVariables(stopTrials, targetTrials, novelTrials),
    randomize_order: true,
    timeline: [
        {
            type: jsPsychHtmlButtonResponse,
            choices: ['Match'],
            button_html: '<button class="button button--task">%choice%</button>',
            response_ends_trial: false,
            stimulus: function(){
                const s = jsPsych.timelineVariable('stimulus');
                return '<p style="font-size:60px;font-weight:bold;color:#3f48cc">'+s+'</p>';
            },
            trial_duration: stimDuration,
            stimulus_duration: stimDuration,
            data: { type: 'novel', correct_response: null },
            on_finish: onFinishTrial
        },
        {
            type: jsPsychHtmlButtonResponse,
            choices: ['Match'],
            button_html: '<button class="button button--task">%choice%</button>',
            response_ends_trial: false,
            stimulus: '<p style="font-size:60px;font-weight:bold;color:#3f48cc">+</p>',
            trial_duration: fixDuration,
            stimulus_duration: fixDuration,
            data: { type: 'fixation', correct_response: null },
            on_finish: onFinishTrial
        },
        {
            timeline: [
                {
                    type: jsPsychHtmlButtonResponse,
                    choices: ['Match'],
                    button_html: '<button class="button button--task">%choice%</button>',
                    response_ends_trial: false,
                    stimulus: function(){
                        const s = jsPsych.timelineVariable('stimulus');
                        return '<p style="font-size:60px;font-weight:bold;color:#3f48cc">'+s+'</p>';
                    },
                    trial_duration: interval,
                    stimulus_duration: interval,
                    data: { type: 'stop', correct_response: null },
                    on_finish: onFinishTrial
                },
                {
                    type: jsPsychHtmlButtonResponse,
                    choices: ['Match'],
                    button_html: '<button class="button button--task">%choice%</button>',
                    response_ends_trial: false,
                    stimulus: function(){
                        const s = jsPsych.timelineVariable('stimulus');
                        return '<p style="font-size:60px;font-weight:bold;color:#ffc90e">'+s+'</p>';
                    },
                    trial_duration: stimDuration - interval,
                    stimulus_duration: stimDuration - interval,
                    data: { type: 'stop', correct_response: null },
                    on_finish: onFinishTrial
                },
                {
                    type: jsPsychHtmlButtonResponse,
                    choices: ['Match'],
                    button_html: '<button class="button button--task">%choice%</button>',
                    response_ends_trial: false,
                    stimulus: '<p style="font-size:60px;font-weight:bold;color:#3f48cc">+</p>',
                    trial_duration: fixDuration,
                    stimulus_duration: fixDuration,
                    data: { type: 'fixation', correct_response: null },
                    on_finish: onFinishTrial
                }
            ],
            conditional_function: function(){
                return jsPsych.timelineVariable('kind') === 'stop';
            }
        },
        {
            timeline: [
                {
                    type: jsPsychHtmlButtonResponse,
                    choices: ['Match'],
                    button_html: '<button class="button button--task">%choice%</button>',
                    response_ends_trial: false,
                    stimulus: function(){
                        const s = jsPsych.timelineVariable('stimulus');
                        return '<p style="font-size:60px;font-weight:bold;color:#3f48cc">'+s+'</p>';
                    },
                    trial_duration: stimDuration,
                    stimulus_duration: stimDuration,
                    data: { type: 'target', correct_response: 0 },
                    on_finish: onFinishTrial
                },
                {
                    type: jsPsychHtmlButtonResponse,
                    choices: ['Match'],
                    button_html: '<button class="button button--task">%choice%</button>',
                    response_ends_trial: false,
                    stimulus: '<p style="font-size:60px;font-weight:bold;color:#3f48cc">+</p>',
                    trial_duration: fixDuration,
                    stimulus_duration: fixDuration,
                    data: { type: 'fixation', correct_response: null },
                    on_finish: onFinishTrial
                }
            ],
            conditional_function: function(){
                return jsPsych.timelineVariable('kind') === 'target';
            }
        }
    ]
}
timeline.push(task_procedure);


const complete_screen = {
  type: jsPsychHtmlButtonResponse,
  choices: ['FINISH'],
  stimulus: `
    <p style="font-size:20px;">Press the button below to complete the task. Thank you!</p>
  `,
  button_html: '<button class="button button--md">%choice%</button>',
  response_ends_trial: true

  };

timeline.push(complete_screen); 

// Initialize jsPsych after the timeline is built
const jsPsych = initJsPsych({
    on_finish: function() {
        // Signal completion to parent (e.g., Qualtrics) with data payload
        try {
            if (window.parent) {
                window.parent.postMessage({
                    type: 'MINIGOSTOP_DONE',
                    payload: jsPsych.data.get().values()
                }, '*');
            }
        } catch (e) {}

        // Show data only when not embedded
        try {
            var isEmbedded = /[?&]embed=1(?!\w)/.test(window.location.search);
            if (!isEmbedded) {
                jsPsych.data.displayData();
            }
        } catch (e) {}
    }
});

// Run the experiment when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){
        addButtonPressFeedback();
        jsPsych.run(timeline);
    });
} else {
    addButtonPressFeedback();
    jsPsych.run(timeline);
}

// Adds visual feedback for quick taps on mobile by toggling a pressed class
function addButtonPressFeedback(){
    // Delegate events to document so dynamically created buttons are handled
    document.addEventListener('pointerdown', function(ev){
        const el = ev.target.closest('button.button');
        if (!el) return;
        el.classList.add('button--pressed');
    }, { passive: true });
    document.addEventListener('pointerup', function(ev){
        const el = ev.target.closest('button.button');
        if (!el) return;
        el.classList.remove('button--pressed');
    }, { passive: true });
    document.addEventListener('pointercancel', function(ev){
        const el = ev.target.closest('button.button');
        if (!el) return;
        el.classList.remove('button--pressed');
    }, { passive: true });
    // Also remove on scroll/blur just in case
    window.addEventListener('blur', function(){
        document.querySelectorAll('button.button.button--pressed').forEach(function(btn){
            btn.classList.remove('button--pressed');
        });
    });
}
