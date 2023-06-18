<script>
    import { wordIndices, countdown } from '../store.js';

    function next() {
      countdown.increment();
      wordIndices.nextWord();
    } 
    
    function previous() {
      countdown.increment();
      wordIndices.previousWord();
    }
</script>

<div class='controller'>
  <span class='back button' on:click={ previous } >&#9756;</span>
  <span class='forward button' on:click={ next } >&#9758;</span>
</div>

<style>
  .controller {
    position: absolute;
    bottom: 0;
    height: 35%;
    width: 100%;
    display: flex;
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