<script>
    import { wordIndices, countdown, doomCountdown, isFirstVerseWord } from '../stores/text.js';

    function next() {
      if (!isDoomNigh) {
        countdown.increment();
        wordIndices.nextWord();
      }
    } 
    
    function previous() {
      if (!isDoomNigh) {
        countdown.increment();
        wordIndices.previousWord();
      }
    }

    $: isDoomNigh = ($doomCountdown > 0) ? true : false;
</script>

<div class='controller'>
  <span class='back button'
    class:disabled="{ isDoomNigh || $isFirstVerseWord }" 
    on:click={ previous } >&#9756;</span>
  <span class='forward button'
    class:disabled="{ isDoomNigh }"
    on:click={ next } >&#9758;</span>
</div>

<style>
  .controller {
    position: absolute;
    bottom: 0;
    height: 35%;
    width: 100%;
    display: flex;
  }

  .disabled {
    opacity: 0.5;
  }

  .controller .button {
    width: 50vw;
    height: 50vw;
    text-align: center;
    vertical-align: baseline;
    font-size: 40vw;
    border-radius: 50%;
  }

</style>