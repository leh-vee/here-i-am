<script>
  import { onMount, onDestroy } from 'svelte';
  import { countdown, wordIndices } from '../store.js';

  let oneSecondInterval;
  let doomCountdown;

  onMount(() => {
    countdown.reset();
    doomCountdown = 3;
    oneSecondInterval = setInterval(() => {
      if ($countdown > 0) {
        countdown.decrement();
      } else {
        setTimeout(() => {
          wordIndices.nextVerse();
        }, 141);
      }
      if (doomCountdown > 0) {
        doomCountdown -= 1;
        wordIndices.nextWord();
      } 
    }, 1000);
	});
  
  onDestroy(() => {
    clearInterval(oneSecondInterval);
	});

  let timerStr = "0:00";
  $: timerMinutes = Math.floor($countdown / 60);
  $: timerSeconds = $countdown % 60;
  $: {
    if (timerSeconds < 10) {
      timerStr = `${timerMinutes}:0${timerSeconds}`;
    } else {
      timerStr = `${timerMinutes}:${timerSeconds}`;
    }
  }
</script>

<h3 class="timer">{ timerStr }</h3>

<style>
  .timer {
    position: absolute;
    width: 100%;
    top: 12vh;
    left: 0;
    margin: 0;
    font-family: sans-serif;
    font-weight: normal;
    font-size: 40vw;
    font-family: 'Inconsolata', monospace;
    text-align: center;
  }
</style>