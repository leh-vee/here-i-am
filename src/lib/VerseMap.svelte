<script>
  import { currentVerse } from '../store.js';
</script>

<div class='couplet'>
  <div class='a-line'>
    {#each $currentVerse['a'] as word}
      <span class='marker'></span>
    {/each}
  </div>
  <div class='b-line'>
    {#each $currentVerse['b'] as word}
      <span class='marker'></span>
    {/each}
  </div>
</div>

<style>
  .marker {
    background-color: black;
    opacity: 0.3;
    border-radius: 50%;
    display: inline-block;
    margin: 0 4px;
    height: 10px;
    width: 10px;
  }
</style>