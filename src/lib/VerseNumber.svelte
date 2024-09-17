<script>
    import { currentPiSliceRomanized } from '../stores/text';
    import { isVerseNumberVisible } from '../stores/verseState';
</script>

{#if $isVerseNumberVisible}
  <div id='verse-number-wrapper'>
    <span id='verse-number'>
      { $currentPiSliceRomanized }
    </span>
  </div>
{/if}

<style>
  #verse-number-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

  }

  #verse-number {
    color: black;
    font-size: 25vh;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>