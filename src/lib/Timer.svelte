<script>
  import { onMount, onDestroy } from 'svelte';
  import { wordIndices } from '../store.js';

  let oneSecondInterval;
  let secondsRemaining;
  let doomSecondsRemaining;

  onMount(() => {
    secondsRemaining = 3;
    doomSecondsRemaining = 3;
    oneSecondInterval = setInterval(() => {
      if (secondsRemaining > 0) {
        secondsRemaining -= 1;
      } else {
        setTimeout(() => {
          wordIndices.nextVerse();
        }, 141);
      }
      if (doomSecondsRemaining > 0) {
        doomSecondsRemaining -= 1;
        wordIndices.nextWord();
      } 
    }, 1000);
	});
  
  onDestroy(() => {
    clearInterval(oneSecondInterval);
	});

  let timerStr = "0:00";
  $: timerMinutes = Math.floor(secondsRemaining / 60);
  $: timerSeconds = secondsRemaining % 60;
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
    top: 10px;
    left: 10px;
    margin: 0;
    font-family: sans-serif;
    font-weight: normal;
  }
</style>