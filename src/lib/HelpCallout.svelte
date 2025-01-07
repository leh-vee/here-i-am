<script>
  import { isEllipsisLit, isReaderEngaged } from '../stores/verseState';
  import { isFirstVerse, isFirstVerseWord } from '../stores/text';

  let isEllipsisDiscoveryWindow = true;
  $: isFirstEllipsisLit = $isFirstVerse && $isEllipsisLit;
  $: isEllipsisHelp = isFirstEllipsisLit && !isEllipsisDiscoveryWindow;

  $: if (isFirstEllipsisLit) {
    setTimeout(() => {
      isEllipsisDiscoveryWindow = false;
    }, Math.PI * 1000) 
  }

  let isFirstWordDiscoveryWindow = true;
  let hadWordHelp = false;
  $: isFirstWord = $isFirstVerse && $isFirstVerseWord && $isReaderEngaged;
  $: isWordHelp = isFirstWord && !isFirstWordDiscoveryWindow && !hadWordHelp;

  $: if (isFirstWord) {
    setTimeout(() => {
      isFirstWordDiscoveryWindow = false;
    }, Math.PI * 1000) 
  }

  let helpText = "";
  $: if (isEllipsisHelp) {
    helpText = "Tap on the ellipsis to open a verse.";
  } else if (isWordHelp) {
    helpText = "Swipe over words or tap on markers to step through a verse.";
    hasHadWordHelp();
  }

  function hasHadWordHelp() {
    hadWordHelp = true;
  }

  $: isVisible = isEllipsisHelp || isWordHelp;

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