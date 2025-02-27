import { logout, checkAuth, createBreak, getAdvice } from '../fetch-utils.js';
import { renderAdvice } from '../render-utils.js';

checkAuth();

const newBreak = document.getElementById('new-break');
const errorTimer = document.getElementById('error-timer');
const adviceSection = document.getElementById('advice-section');
const breakStats = document.getElementById('breakstats-button');

const tannerError = new Audio('/assets/error.m4a');
const tannerBreak = new Audio('/assets/break.m4a');

const breakTimeMinutes = 60;

setInterval(function () {
    tannerBreak.play();
}, breakTimeMinutes * 60 * 1000);

breakStats.addEventListener('click', () => {
    window.location.replace('/break-stats');
});

newBreak.addEventListener('click', async () => {
    const response = await createBreak();
    const params = new URLSearchParams();
    params.set('id', response.id);

    window.location.replace(`/break-menu/?${params.toString()}`);
});

const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', async () => {
    await logout();
});

window.onload = function () {
    breakTimerStart();
};

function breakTimerStart() {
    let hr = 0;
    let min = 0;
    let sec = 0;

    let appendSec = document.getElementById('seconds');
    let appendMin = document.getElementById('minutes');
    let appendHr = document.getElementById('hours');

    setInterval(updateTimer, 1000);

    function updateTimer() {
        sec++;
        if (sec <= 9) {
            appendSec.innerHTML = '0' + sec;
        }

        if (sec > 9) {
            appendSec.innerHTML = sec;
        }

        if (sec > 59) {
            min++;
            appendMin.innerHTML = '0' + min;
            sec = 0;
            appendSec.innerHTML = '0' + 0;
        }

        if (min <= 9) {
            appendMin.innerHTML = '0' + min;
        }

        if (min > 9) {
            appendMin.innerHTML = min;
        }

        if (min > 59) {
            hr++;
            appendHr.innerHTML = '0' + hr;
            min = 0;
            appendMin.innerHTML = '0' + 0;
        }

        if (hr <= 9) {
            appendHr.innerHTML = '0' + hr;
        }

        if (hr > 9) {
            appendHr.innerHTML = hr;
        }
    }
}

let errorButton = document.getElementById('new-error');

async function displayAdvice() {
    adviceSection.textContent = '';
    const adviceList = await getAdvice();

    let listLength = adviceList.length;

    let index = Math.floor(Math.random() * listLength);

    const advice = adviceList[index];
    adviceSection.append(renderAdvice(advice));
}

errorButton.addEventListener('click', gotError);
let interval;

async function gotError() {
    displayAdvice();
    errorButton.textContent = 'Fixed your Error?';
    errorTimer.classList.remove('hidden');
    errorButton.removeEventListener('click', gotError);
    errorButton.addEventListener('click', fixedError);
    errorTimerStart();
}

async function fixedError() {
    errorTimer.classList.add('hidden');
    errorButton.removeEventListener('click', fixedError);
    errorButton.addEventListener('click', gotError);
    errorButton.textContent = 'Have an Error?';
    adviceSection.textContent = '';
    resetTimer();
    clearInterval(interval);
}

function resetTimer() {
    let appendErrorMin = document.getElementById('errorMinutes');
    let appendErrorSec = document.getElementById('errorSeconds');

    appendErrorMin.textContent = '15';
    appendErrorSec.textContent = '00';
}

function errorTimerStart() {
    let min = 15;
    let sec = 0;

    let appendErrorMin = document.getElementById('errorMinutes');
    let appendErrorSec = document.getElementById('errorSeconds');

    interval = setInterval(updateTimer, 1000);

    function updateTimer() {
        sec--;
        if (sec < 0) {
            sec = 59;
            min--;
            // appendErrorSec.innerHTML = sec;
            appendErrorMin.innerHTML = min;
        }
        if (sec >= 10) {
            appendErrorSec.innerHTML = sec;
        }
        if (sec <= 9) {
            appendErrorSec.innerHTML = '0' + sec;
        }
        if (min <= 9) {
            appendErrorMin.innerHTML = '0' + min;
        }
        if (sec === 0 && min === 0) {
            clearInterval(interval);
            errorButton.disabled = false;
            tannerError.play();
        }
    }
}
