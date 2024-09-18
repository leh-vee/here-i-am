<script>
  import { Group, Text } from 'svelte-konva';
  import { currentVerse, wordIndices, currentWordId, isLineA,
    currentVerseIndex, isCaesura, isInBetweenWords, likePiSlices } from '../stores/text';
  import { isReaderEngaged, isFullStop, isNotepadVisible } from '../stores/verseState';

  let stashedWordEl = null;
  let padEl;

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

  $: isLineBAndLikeSlices = !$isLineA && $likePiSlices;
  $: margin = $isLineA ? wordBoxMarginA : wordBoxMarginB;
  $: textElWidth = (window.innerWidth + margin);
  $: xPadPosition =  isLineBAndLikeSlices ? ($wordIndices.wordIndex - (nWordsLineB - 1)) * textElWidth : -$wordIndices.wordIndex * textElWidth;
  $: yPadPosition =  $isLineA ? 0 : -window.innerHeight; 

  $: lineBWords = $likePiSlices ? structuredClone($currentVerse['b']).reverse() : $currentVerse['b'];

  let xPositionWidth;
  $: if (padEl !== undefined) xPositionWidth = padEl.width() - textElWidth;
  $: if ($isReaderEngaged && padEl !== undefined) movePadToCurrentWord(xPadPosition, yPadPosition);

  function movePadToCurrentWord(x, y) {
    isInBetweenWords.set(true);
    padEl.to({ 
      duration: movePadDuration(), 
      x, y,
      onFinish: () => {
        if (stashedWordEl !== null) unstashWord();
        isInBetweenWords.set(false);
      }
    });
  }

  function movePadDuration() {
    const xCurrentPosition = padEl.position()['x'];
    const xDistance = Math.abs(xCurrentPosition - xPadPosition);
    const xDistancePercent = xDistance / xPositionWidth;

    const yCurrentPosition = padEl.position()['y'];
    const yIsChanging = yCurrentPosition !== yPadPosition;

    const duration = yIsChanging ? xDistancePercent + 0.1 : xDistancePercent;
    return duration;
  }

  $: if ($isCaesura || $isFullStop) stashWord();

  function stashWord() {
    const duration = Math.PI / 10;
    stashedWordEl = padEl.findOne(`#${$currentWordId}`);
    const currentX = stashedWordEl.attrs.x;
    const x = isLineBAndLikeSlices ? currentX + textElWidth : currentX - textElWidth;
    stashedWordEl.to({ 
      duration, x,
      onFinish: () => {
        stashedWordEl.visible(false);
      } 
    });
  }  
  
  function unstashWord() {
    stashedWordEl.visible(true);
    stashedWordEl = null;
  }

  function wordId(i, line='b') {
    let id = `${$currentVerseIndex}-${line}-${i}`;
    if (line === 'b' && $likePiSlices) {
      const reverseIndex = nWordsLineB - 1 - i; 
      id = `${$currentVerseIndex}-${line}-${reverseIndex}`
    }
    return id;
  }
</script>

<Group config={{ 
  width: groupWidth, 
  height: window.innerHeight * 2,
  x: textElWidth, y: 0,
  visible: $isNotepadVisible
}} bind:handle={padEl}>
  {#each $currentVerse['a'] as word, i}
    <Text config={{
      text: word,
      x: i * (window.innerWidth + wordBoxMarginA),
      id: `${$currentVerseIndex}-a-${i}`,
      ...wordAttrs
    }} />
  {/each}
  {#each lineBWords as word, i}
    <Text config={{
      text: word,
      x: i * (window.innerWidth + wordBoxMarginB),
      y: window.innerHeight,
      id: wordId(i),
      ...wordAttrs
    }} />
  {/each}
</Group>