<script>
  import Word from "./lib/Word.svelte";
  import VerseMap from "./lib/VerseMap.svelte";
</script>

<div class='reader'>
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
  
  .magnifier {
    flex-grow: 1;
  }

  .verse-map {
    margin: 10px auto;
    height: 80%;
    height: 100px;
  }
</style>