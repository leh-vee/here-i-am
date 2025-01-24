<script>
  import { Text } from 'svelte-konva';  
  import { isReaderEngaged, isFullStop, isPostVerse } from '../stores/verseState.js';
  import { millisecsElapsedByVerse, nPiesScored, screenWidth, screenHeight } from '../stores/base';
  import { currentVerseIndex } from '../stores/text';

  $: watchFontSize = Math.round($screenWidth / 5);
  $: pieEmojiFontSize = Math.round($screenHeight / 10);
  let pieEl;

  let start = new Date();
  $: startTime = start.getTime();

  let current = start;
  $: currentTime = current.getTime();

  let mSecsAlreadyElapsedForVerse = 0;
  if ($millisecsElapsedByVerse[$currentVerseIndex] !== undefined) {
    mSecsAlreadyElapsedForVerse = $millisecsElapsedByVerse[$currentVerseIndex];
  };

  $: elapsedMillisecs = (currentTime - startTime) + mSecsAlreadyElapsedForVerse;
  $: isZero = elapsedMillisecs === 0;

	$: minutes = Math.floor(elapsedMillisecs / 1000 / 60);
  $: mm = zeroPadded(minutes);
	$: seconds = Math.floor(elapsedMillisecs / 1000) % 60;
  $: ss = zeroPadded(seconds);
  $: zeroMsText = "000".slice(0, $nPiesScored); 
  $: ms = isZero ? zeroMsText : getMillisecsText(elapsedMillisecs.toString());

  const initialVerseIndex = $currentVerseIndex;
  $: $millisecsElapsedByVerse[initialVerseIndex] = elapsedMillisecs; 

  $: formattedElapsed = $nPiesScored > 0 ? `${mm}:${ss}.${ms}`: `${mm}:${ss}`;

  let isPiSeconds = false;
  $: if ($nPiesScored === 0) {
    isPiSeconds = elapsedMillisecs >= 194000 && elapsedMillisecs <= 194999;
  } else if ($nPiesScored === 1) {
    isPiSeconds = elapsedMillisecs >= 194100 && elapsedMillisecs <= 194199;
  } else if ($nPiesScored === 2) {
    isPiSeconds = elapsedMillisecs >= 194150 && elapsedMillisecs <= 194159;
  } else if ($nPiesScored === 3) {
    isPiSeconds = elapsedMillisecs === 194159;
  }
  
  $: isPieTrick = $nPiesScored === 3;
  $: isPiEmojiVisible = isPiSeconds && !isPieTrick; 
  
  function zeroPadded(number) {
    return number >= 10 ? number.toString() : `0${number}`;
  }

  function getMillisecsText(elapsedText) {
    let text = $nPiesScored === 3 ? elapsedText.slice(-3) : elapsedText.slice(-3, $nPiesScored - 3);
    return text;
  }

  let interval;

  $: if ($isFullStop) clearInterval(interval);

  $: if ($isPostVerse && isPiEmojiVisible) {
    pieSpin();
    nPiesScored.set($nPiesScored + 1); 
  }


  $: if ($isReaderEngaged) {
    start = new Date();
    current = start;
    interval = setInterval(() => {
			current = new Date();
		}, 10);
  }

  function pieSpin() {
    pieEl.to({
      duration: Math.PI / 10,
      rotation: -360
    });
  }

</script>

<Text config={{
  text: formattedElapsed,
  width: $screenWidth,
  height: $screenHeight / 2.5,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: watchFontSize,
  fontFamily: 'digital',
  fill: 'white',
  strokeWidth: 0
}} />

<Text config={{
  offsetX: $screenWidth / 2,
  offsetY: $screenHeight / 2.6,
  x: $screenWidth / 2,
  y: $screenHeight / 2.6,
  text: "🥧",
  width: $screenWidth,
  height: $screenHeight / 1.3,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: pieEmojiFontSize,
  visible: isPiEmojiVisible
}} bind:handle={pieEl} />

