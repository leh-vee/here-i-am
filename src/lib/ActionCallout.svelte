<script>
  import { isEllipsisLit, isReaderEngaged } from '../stores/verseState';
  import { isLastVerseWord, isFirstVerseTriad } from '../stores/text';
  import { hasVerseNumberMenuOpened, isScoreCallout, isVerseCallout,
    hasReadAhead, hasTappedEllipsis, hasCompletedVerse } from '../stores/base';

  let calloutIndex;
  $: {
    calloutIndex = undefined;
    if (!$hasTappedEllipsis && $isEllipsisLit) {
      calloutIndex = 0;
    } else if (!$hasReadAhead && $isReaderEngaged) {
      calloutIndex = 1;
    } else if (!$hasCompletedVerse && $isLastVerseWord && $isReaderEngaged) {
      calloutIndex = 2;
    } else if (!$isFirstVerseTriad && $isEllipsisLit && !$hasVerseNumberMenuOpened) {
      calloutIndex = 3;
    } else {
      calloutIndex = undefined;
    }
  }

  const callouts = [
    {
      id: 'ellipsis',
      text: 'Tap the ellipsis to depart'
    },
    {
      id: 'word',
      text: 'Swipe the word or tap the markers to continue'
    },
    {
      id: 'score',
      text: "Arrive at 03:14, the stroke of <span id='pi'>π</span>, to score"
    },
    {
      id: 'verse',
      text: 'Tap the current verse number to list them all'
    }
  ]

  let calloutText = '';
  let calloutId = '';
  $: if (calloutIndex !== undefined) {
    let callout = callouts[calloutIndex];
    calloutText = callout.text;
    calloutId = callout.id;
  } else {
    calloutText = '';
    calloutId = '';
  }

  $: $isScoreCallout = calloutId === 'score';
  $: $isVerseCallout = calloutId === 'verse';
  
  $: visible = calloutIndex !== undefined;

</script>


<div id={ calloutId } class='callout' class:visible> 
  <p>{@html calloutText }</p>
</div>

<style>
    .callout#ellipsis {
      transition: opacity 1s ease-in 10s;
    }

    .callout#word {
      transition: opacity 1s ease-in 15s;
    }

    .callout#score {
      transition: opacity 1s ease-in 0.5s;
    }

    .callout#verse {
      transition: opacity 1s ease-in;
    }

    .callout {
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
    }

    .callout.visible {
      opacity: 1;
    }
    
    .callout p {
      margin: 0;
      font-size: 4vw;
      color: white;
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
    }

    

</style>