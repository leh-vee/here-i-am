<script>
  import { isEllipsisLit, isReaderEngaged } from '../stores/verseState';
  import { isFirstVerse, isFirstVerseWord, isLastVerseWord } from '../stores/text';
  import { millisecsElapsedForCurrentVerse } from '../stores/base';

  let isEllipsisDiscoveryWindow = true;
  $: isFirstEllipsisLit = $isFirstVerse && $isEllipsisLit;
  $: isEllipsisNavHelp = isFirstEllipsisLit && !isEllipsisDiscoveryWindow;

  $: if (isFirstEllipsisLit) {
    setTimeout(() => {
      isEllipsisDiscoveryWindow = false;
    }, Math.PI * 1000) 
  }

  let isFirstWordDiscoveryWindow = true;
  let hadWordHelp = false;
  $: isFirstWord = $isFirstVerse && $isFirstVerseWord && $isReaderEngaged;
  $: isWordNavHelp = isFirstWord && !isFirstWordDiscoveryWindow && !hadWordHelp;

  $: if (isFirstWord) {
    setTimeout(() => {
      isFirstWordDiscoveryWindow = false;
    }, Math.PI * 1000) 
  }

  let hadPieHelp = false;
  $: isPiWatchDiscoveryWindow = $millisecsElapsedForCurrentVerse > 150000 &&
    $millisecsElapsedForCurrentVerse < 210000; 
  $: isFillPieHelp = (isPiWatchDiscoveryWindow || $isLastVerseWord) && !hadPieHelp;

  let helpText = "";
  $: if (isEllipsisNavHelp) {
    helpText = "To open a verse tap the ellipsis.";
  } else if (isWordNavHelp) {
    helpText = "To read a verse swipe its words or tap their markers.";
    hasHadWordHelp();
  } else if (isFillPieHelp) {
    helpText = "Closing a verse at the stroke of π fills a pie on high.";
    hasHadPieHelp();
  }

  function hasHadWordHelp() {
    hadWordHelp = true;
  }

  function hasHadPieHelp() {
    hadPieHelp = true;
  }

  $: isVisible = isEllipsisNavHelp || isWordNavHelp || isFillPieHelp;

</script>

{#if isVisible}
  <div id='callout'>
    { helpText }
  </div>
{/if}

<style>
    #callout {
      position: absolute;
      bottom: 3%;
      left: 10%;
      right: 10%;
      background-color: dimgrey;
      color: gold;
      font-size: larger;
      padding: 5px 12px;
    }

</style>