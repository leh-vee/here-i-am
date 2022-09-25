<script>
  import { currentWord, ellipsisMode } from '../store.js';
  $: word = ($ellipsisMode ? "." : $currentWord);
</script>

<h1 class='word'>
  { word }
</h1>

<style>
  .word {
    font-size: 70px;
    margin-top: 50%;
  }
</style>