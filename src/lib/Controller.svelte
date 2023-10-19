<script>
  import { wordIndices, isFirstVerseWord, currentVerseIndex, nVerseWords } from '../stores/text.js';
  
  let isAutoScanningVerse = false;

  $: {
    console.log('scanning verse', $currentVerseIndex);
    scanVerse();
  }

  function scanVerse() {
    isAutoScanningVerse = true;
    const piSecondsInMilliseconds = Math.PI * 1000;
    const t = piSecondsInMilliseconds / $nVerseWords;
    const totalScans = $nVerseWords - 1;
    let nWordsScanned = 0;
    const scanNextWord = () => {
      wordIndices.nextWord();
      nWordsScanned += 1;
      if (nWordsScanned < totalScans) {
        setTimeout(() => { scanNextWord() }, t);
      } else {
        isAutoScanningVerse = false;
      }
    }
    scanNextWord()
  } 
</script>


<div class='controller'>
  <span class='back button'
    class:disabled="{ $isFirstVerseWord || isAutoScanningVerse }" 
    on:click={ wordIndices.previousWord } >&#9756;</span>
  <span class='forward button'
    class:disabled="{ isAutoScanningVerse }"
    on:click={ wordIndices.nextWord } >&#9758;</span>
</div>

<style>
  .controller {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    z-index: 1;
  }

  .disabled {
    opacity: 0.5;
  }

  .controller .button {
    width: 50vw;
    height: 50vw;
    text-align: center;
    vertical-align: baseline;
    font-size: 15vw;
    border-radius: 50%;
  }

</style>