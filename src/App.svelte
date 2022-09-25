<script>
  import Word from "./lib/Word.svelte";
  import VerseMap from "./lib/VerseMap.svelte";
  import { wordIndices } from './store.js';
</script>

<div class='reader'>
  <div class='word-control previous' on:click={ wordIndices.previousWord }></div>
  <div class='word-control next' on:click={ wordIndices.nextWord }></div>
  <div class='magnifier'>  
    <Word />
  </div>
  <div class='verse-map'>
    <VerseMap />
  </div>
</div>

<style>
  .reader {
    height: 100%;
    display: flex;
		flex-direction: column;
    text-align: center;
  }

  .word-control {
    position: absolute;
    height: 100%;
    width: 50%;
    font-size: 50px;
  }

  .next {
    right: 0;
  }
  
  .magnifier {
    flex-grow: 1;
  }

  .verse-map {
    margin: 10px auto;
    height: 80%;
    height: 100px;
  }
</style>