<script>
  import { isEllipsisLit, isReaderEngaged } from '../stores/verseState';
  import { isFirstVerse, isFirstVerseWord, isLastVerseWord, isFirstVerseTriad } from '../stores/text';
  import { millisecsElapsedForCurrentVerse, hasVerseNumberMenuOpened } from '../stores/base';

  const actionsCalledOut = [];

  let isEllipsisDiscoveryWindow = true;
  $: isFirstEllipsisLit = $isFirstVerse && $isEllipsisLit;
  $: isEllipsisNavHelp = isFirstEllipsisLit && !isEllipsisDiscoveryWindow;

  $: if (isFirstEllipsisLit) {
    setTimeout(() => {
      isEllipsisDiscoveryWindow = false;
    }, Math.PI * 1000) 
  }

  let isFirstWordDiscoveryWindow = true;
  $: isFirstWord = $isFirstVerse && $isFirstVerseWord && $isReaderEngaged;
  $: isWordNavHelp = isFirstWord && !isFirstWordDiscoveryWindow && !actionsCalledOut.includes('score');

  $: if (isFirstWord) {
    setTimeout(() => {
      isFirstWordDiscoveryWindow = false;
    }, Math.PI * 1000) 
  }

  $: isPiWatchDiscoveryWindow = $millisecsElapsedForCurrentVerse > 150000 &&
    $millisecsElapsedForCurrentVerse < 210000; 
  $: isScoreCall = (isPiWatchDiscoveryWindow || $isLastVerseWord) && !actionsCalledOut.includes('score');

  $: isVerseCallTime = !$isFirstVerseTriad && $isEllipsisLit && !$hasVerseNumberMenuOpened; 
  $: isVerseCall =  isVerseCallTime && !actionsCalledOut.includes('verse');


  let helpText = "";
  $: if (isEllipsisNavHelp) {
    helpText = "Tap the ellipsis to depart";
  } else if (isWordNavHelp) {
    helpText = "Swipe the word or tap the markers to continue";
    actionsCalledOut.push('word');
  } else if (isScoreCall) {
    helpText = "Arrive at the stroke of π to score";
    actionsCalledOut.push('score');
  } else if (isVerseCall) {
    helpText = "Tap the current verse number for a list of all of them";
    actionsCalledOut.push('verse');
  }

  $: visible = isEllipsisNavHelp || isWordNavHelp || isScoreCall || isVerseCall;

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