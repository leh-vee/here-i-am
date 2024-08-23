<script>
    import { currentPiSliceRomanized } from '../stores/text.js';
    import { isVerseNumberVisible } from '../stores/base.js';

    const verseNumberFontSize = Math.round(window.innerWidth / 2);
</script>

{#if $isVerseNumberVisible}
  <div id='verse-number-wrapper'>
    <span id='verse-number' style='--fontSize:{verseNumberFontSize};'>
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
    font-size: calc( var(--fontSize) * 1px );
    font-family: Arial, Helvetica, sans-serif;
  }
</style>