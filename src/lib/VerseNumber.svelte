<script>
    import { currentPiSliceRomanized } from '../stores/text';
    import { isVerseNumberVisible } from '../stores/verseState';
    import { screenWidth } from '../stores/base'; 

    $: fontSize = `${Math.round($screenWidth * 0.5)}px`;
</script>

{#if $isVerseNumberVisible}
  <div id='verse-number-wrapper' style="--fontSize:{fontSize}">
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
    font-size: var(--fontSize);
    font-family: Arial, Helvetica, sans-serif;
  }
</style>