<script>
    import { isFirstVerseTriad, isFirstVerse, currentPiSlice } from '../stores/text.js';
    import { isVerseNumberVisible } from '../stores/base.js';

    $: verseNumberFontSize = Math.round(window.innerHeight / ($isFirstVerseTriad ? 5 : 3.5));
    
    let verseNumber;
    $: if ($isFirstVerseTriad) {
      let romanNumeral = 'I';
      for (let i = 1; i < Number($currentPiSlice); i++) { romanNumeral += 'I' };
      verseNumber = romanNumeral;
    } else {
      verseNumber = String($currentPiSlice);
    }
</script>

{#if $isVerseNumberVisible}
  <div id='verse-number-wrapper'>
    <span id='verse-number' style='--fontSize:{verseNumberFontSize};'>
      { verseNumber }
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
    font-family: monospace;
  }
</style>