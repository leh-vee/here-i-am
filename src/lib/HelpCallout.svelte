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
    helpText = "Tap the ellipsis to depart";
  } else if (isWordNavHelp) {
    helpText = "Swipe the word or tap the markers to continue";
    hasHadWordHelp();
  } else if (isFillPieHelp) {
    helpText = "Arrive at the stroke of π to score";
    hasHadPieHelp();
  }

  function hasHadWordHelp() {
    hadWordHelp = true;
  }

  function hasHadPieHelp() {
    hadPieHelp = true;
  }

  $: visible = isEllipsisNavHelp || isWordNavHelp || isFillPieHelp;

</script>


<div id='callout' class:visible>
  <p>
    { helpText }
  </p>
</div>

<style>
    #callout {
      position: absolute;
      bottom: 0px;
      left: 0px;
      right: 0px;
      height: 20%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.1s ease-in-out;
    }
    
    #callout p {
      margin: 0;
      font-size: 4vw;
      color: white;
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
    }

    #callout.visible {
      opacity: 1;
    }

</style>