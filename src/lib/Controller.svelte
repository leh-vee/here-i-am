<script>
    import { wordIndices } from '../store.js';
</script>

<div class='controller'>
  <span class='back button' on:click={ wordIndices.previousWord } >&#9756;</span>
  <span class='forward button' on:click={ wordIndices.nextWord } >&#9758;</span>
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