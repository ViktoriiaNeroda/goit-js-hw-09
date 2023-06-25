import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Report } from 'notiflix/build/notiflix-report-aio';

let selectedDate = null;
let currentDate = null;
let intervalId = null;

const calendar = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start-timer]');
// startButton.disabled = true;
// const timer = document.querySelector('.timer')
const TIMER_DELAY = 1000;

flatpickr(calendar, {
    enableTime: true,
    time_24hr: true,
    defaultDate: 'today',
    minuteIncrement: 1,
    onClose(selectedDate) {
        if (selectedDate[0].getTime() < Date.now()) {
            Report.failure('Please, choose a date in the future');
        } else {
            Report.success('Congratulation! Click on start!');
        // startButton.disabled = false;
            const setTimer = () => {
            selectedDate = selectedDate[0].getTime();
            timer.start();
            }
        
            startButton.addEventListener('click', setTimer);
        }
    },
});

const timer = {
  rootSelector: document.querySelector('.timer'),start() {
    intervalId = setInterval(() => {
        startButton.disabled = true;
        calendar.disabled = true;
        currentDate = Date.now();
        const delta = selectedDate - currentDate;

        if (delta <= 0) {
            this.stop();
            Report.info(
                'Congratulation! Timer stopped!',
            );
            return;
        }
        const { days, hours, minutes, seconds } = this.convertMs(delta);
        this.rootSelector.querySelector('[data-days]').textContent =
            this.addLeadingZero(days);
        this.rootSelector.querySelector('[data-hours]').textContent =
            this.addLeadingZero(hours);
        this.rootSelector.querySelector('[data-minutes]').textContent =
            this.addLeadingZero(minutes);
        this.rootSelector.querySelector('[data-seconds]').textContent =
        this.addLeadingZero(seconds);
    }, TIMER_DELAY);
},
    stop() {
        clearInterval(intervalId);
        this.intervalId = null;
        startButton.disabled = true;
        calendar.disabled = false;
    },

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = this.addLeadingZero(Math.floor(ms / day));
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  },

  addLeadingZero(value) {
    return String(value).padStart(2, 0);
  },
};