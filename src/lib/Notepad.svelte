<script>
    import { Group, Text } from 'svelte-konva';
    import { currentVerse, wordIndices } from '../stores/text.js';

    let padEl;
    const padWordEls = { a: [], b: [] };
    const wordAttrs = {
      width: window.innerWidth,
      height: window.innerHeight,
      align: 'center',
      verticalAlign: 'middle',
      fontSize: 50,
      fontFamily: 'Love Ya Like A Sister',
      fillEnabled: true,
      fill: 'gold',
      strokeWidth: 0,
    }

    $: nWordsLineA = $currentVerse['a'].length;
    $: nWordsLineB = $currentVerse['b'].length;
    $: maxWordsPerLine = Math.max(nWordsLineA, nWordsLineB); 
    $: groupWidth = maxWordsPerLine * window.innerWidth;
    $: wordBoxMarginA = Math.round(groupWidth / nWordsLineA - window.innerWidth);
    $: wordBoxMarginB = Math.round(groupWidth / nWordsLineB - window.innerWidth);

    $: isLineA = $wordIndices.line === 'a';
    $: margin = isLineA ? wordBoxMarginA : wordBoxMarginB;
    $: xPadPosition =  -$wordIndices.wordIndex * (window.innerWidth + margin);
    $: yPadPosition =  isLineA ? 0 : -window.innerHeight; 

    $: if (padEl) {
      const isNewLine = padEl.y() !== yPadPosition;
      const duration = isNewLine ? Math.PI / 2 : Math.PI / 10;
      padEl.to({
        duration,
        x: xPadPosition,
        y: yPadPosition
      });
    }

</script>

<Group config={{ 
  width: groupWidth, 
  height: window.innerHeight * 2,
  x: 0, y: 0
}} bind:handle={padEl}>
  {#each $currentVerse['a'] as word, i}
    <Text config={{
      text: word,
      x: i * (window.innerWidth + wordBoxMarginA),
      ...wordAttrs
    }} bind:handle={padWordEls['a'][i]} />
  {/each}
  {#each $currentVerse['b'] as word, i}
    <Text config={{
      text: word,
      x: i * (window.innerWidth + wordBoxMarginB),
      y: window.innerHeight,
      ...wordAttrs
    }} bind:handle={padWordEls['b'][i]} />
  {/each}
</Group>