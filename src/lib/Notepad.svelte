<script>
    import { Group, Text } from 'svelte-konva';
    import { currentVerse, wordIndices, isLineBreak, currentWordId,
      currentVerseIndex, isCaesura, isInBetweenWords, isLineA } from '../stores/text.js';
      
    export let visible = false;
    let padEl;
    let stashedWordEl = null;
    const wordAttrs = {
      width: window.innerWidth,
      height: window.innerHeight,
      align: 'center',
      verticalAlign: 'middle',
      fontSize: Math.round(window.innerWidth / 9),
      fontFamily: 'Love Ya Like A Sister',
      fillEnabled: true,
      fill: 'gold',
      strokeWidth: 0
    }

    $: nWordsLineA = $currentVerse['a'].length;
    $: nWordsLineB = $currentVerse['b'].length;
    $: maxWordsPerLine = Math.max(nWordsLineA, nWordsLineB); 
    $: groupWidth = maxWordsPerLine * window.innerWidth;
    $: wordBoxMarginA = Math.round(groupWidth / nWordsLineA - window.innerWidth);
    $: wordBoxMarginB = Math.round(groupWidth / nWordsLineB - window.innerWidth);

    $: margin = $isLineA ? wordBoxMarginA : wordBoxMarginB;
    $: textElWidth = (window.innerWidth + margin);
    $: xPadPosition =  -$wordIndices.wordIndex * textElWidth;
    $: yPadPosition =  $isLineA ? 0 : -window.innerHeight; 
    
    const wordPanDuration = Math.PI / 10;
    const lineBreakPanDuration = Math.PI / 2;
    $: if (visible) {
      const d = $isLineBreak ? lineBreakPanDuration : wordPanDuration;
      movePadToCurrentWord(xPadPosition, yPadPosition, d);
    }

    function movePadToCurrentWord(x, y, duration) {
      if (padEl !== undefined) {
        isInBetweenWords.set(true);
        padEl.to({ 
          duration, x, y,
          onFinish: () => {
            if (stashedWordEl !== null) unstashWord();
            isInBetweenWords.set(false);
          }
        });
      }
    }

    $: if ($isCaesura) stashWord();

    function stashWord() {
      const duration = Math.PI / 5;
      stashedWordEl = padEl.findOne(`#${$currentWordId}`);
      stashedWordEl.to({ 
        duration, 
        x: -textElWidth,
        onFinish: () => {
          stashedWordEl.visible(false);
        } 
      });
    }  
    
    function unstashWord() {
      stashedWordEl.visible(true);
      stashedWordEl = null;
    }
</script>

<Group config={{ 
  width: groupWidth, 
  height: window.innerHeight * 2,
  x: textElWidth, y: 0, visible
}} bind:handle={padEl}>
  {#each $currentVerse['a'] as word, i}
    <Text config={{
      text: word,
      x: i * (window.innerWidth + wordBoxMarginA),
      id: `${$currentVerseIndex}-a-${i}`,
      ...wordAttrs
    }} />
  {/each}
  {#each $currentVerse['b'] as word, i}
    <Text config={{
      text: word,
      x: i * (window.innerWidth + wordBoxMarginB),
      y: window.innerHeight,
      id: `${$currentVerseIndex}-b-${i}`,
      ...wordAttrs
    }} />
  {/each}
</Group>