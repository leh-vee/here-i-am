<script>
  import { isEllipsisLit, isReaderEngaged, isFullStop } from '../stores/verseState';
  import { isFirstVerse, isFirstVerseWord, isLastVerseWord, 
    isFirstVerseTriad } from '../stores/text';
  import { hasVerseNumberMenuOpened, isScoreCallout, 
    isVerseCallout, hasCalledOutScoreAction } from '../stores/base';

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
  $: isWordNavHelp = isFirstWord && !isFirstWordDiscoveryWindow && !actionsCalledOut.includes('word');

  $: if (isFirstWord) {
    setTimeout(() => {
      isFirstWordDiscoveryWindow = false;
    }, Math.PI * 1000) 
  }

  $: $isScoreCallout = $isLastVerseWord && $isReaderEngaged && !$hasCalledOutScoreAction;
  $: if ($isFullStop && actionsCalledOut.includes('score')) {
    $hasCalledOutScoreAction = true;
  }

  $: isVerseCallTime = !$isFirstVerseTriad && $isEllipsisLit && !$hasVerseNumberMenuOpened; 
  $: $isVerseCallout =  isVerseCallTime && !actionsCalledOut.includes('verse');

  let helpText = "";
  $: if (isEllipsisNavHelp) {
    helpText = "Tap the ellipsis to depart";
  } else if (isWordNavHelp) {
    helpText = "Swipe the word or tap the markers to continue";
    actionsCalledOut.push('word');
  } else if ($isScoreCallout) {
    helpText = "Arrive at 03:14, the stroke of π, to score";
    actionsCalledOut.push('score');
  } else if ($isVerseCallout) {
    helpText = "Tap the current verse number to list them all";
    actionsCalledOut.push('verse');
  }

  $: visible = isEllipsisNavHelp || isWordNavHelp || $isScoreCallout || $isVerseCallout;

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