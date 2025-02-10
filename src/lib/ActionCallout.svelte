<script>
  import { isEllipsisLit, isReaderEngaged } from '../stores/verseState';
  import { isLastVerseWord, isFirstVerseTriad } from '../stores/text';
  import { hasVerseNumberMenuOpened, isScoreCallout, isVerseCallout,
    hasReadAhead, hasTappedEllipsis, hasCompletedVerse, screenWidth } from '../stores/base';

  $: fontSize = `${Math.round($screenWidth * 0.04)}px`;

  let calloutIndex;
  $: if (!$hasTappedEllipsis && $isEllipsisLit) {
    updateCalloutIndex(0);
  } else if (!$hasReadAhead && $isReaderEngaged) {
    updateCalloutIndex(1);
  } else if (!$hasCompletedVerse && $isLastVerseWord && $isReaderEngaged) {
    updateCalloutIndex(2);
  } else if (!$isFirstVerseTriad && $isEllipsisLit && !$hasVerseNumberMenuOpened) {
    updateCalloutIndex(3);
  } else {
    updateCalloutIndex(undefined);
  }

  function updateCalloutIndex(i) {
    calloutIndex = undefined;
    setTimeout(() => {
        calloutIndex = i;
      }, 250); // add delay between consecutive callout states for css transition
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
      text: "Arrive at <span style='font-family: digital; font-size: larger'>03:14</span>, the stroke of " +
        "<span style='font-family: Times New Roman; font-size: xx-large'>π</span>, to score"
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
  <p style="--fontSize:{fontSize}">
    {@html calloutText }
  </p>
</div>

<style>
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
      transition: opacity 200ms ease-in;
    }

    .callout.visible {
      opacity: 1;
    }
    
    .callout p {
      margin: 0;
      font-size: var(--fontSize);
      color: white;
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
    }
</style>