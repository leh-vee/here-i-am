<script>
  import { Text } from 'svelte-konva';  
  import { millisecsElapsedByVerse, nPiesScored } from '../stores/base';
  import { currentVerseIndex } from '../stores/text.js';

  let pieEl;
  export let isStart = false;
  export let isStop = false;

  const watchFontSize = Math.round(window.innerWidth / 30);
  const isPiSecondsFontSize = Math.round(window.innerWidth / 8);

  let start = new Date();
  $: startTime = start.getTime();

  let current = start;
  $: currentTime = current.getTime();

  $: elapsedMillisecs = currentTime - startTime;
  $: isZero = elapsedMillisecs === 0;

	$: minutes = Math.floor(elapsedMillisecs / 1000 / 60);
  $: mm = zeroPadded(minutes);
	$: seconds = Math.floor(elapsedMillisecs / 1000) % 60;
  $: ss = zeroPadded(seconds);
  $: zeroMsText = "000".slice(0, $nPiesScored); 
  $: ms = isZero ? zeroMsText : getMillisecsText(elapsedMillisecs.toString());

  $: $millisecsElapsedByVerse[$currentVerseIndex] = elapsedMillisecs; 

  $: formattedElapsed = $nPiesScored > 0 ? `${mm}:${ss}.${ms}`: `${mm}:${ss}`;

  let isPiSeconds = false;
  $: if ($nPiesScored === 0) {
    isPiSeconds = elapsedMillisecs > 194000 && elapsedMillisecs < 194999;
  } else if ($nPiesScored === 1) {
    isPiSeconds = elapsedMillisecs > 194100 && elapsedMillisecs < 194199;
  } else if ($nPiesScored === 2) {
    isPiSeconds = elapsedMillisecs > 194150 && elapsedMillisecs < 194159;
  } else if ($nPiesScored === 3) {
    isPiSeconds = elapsedMillisecs === 194159;
  }
  
  $: isPieTrick = $nPiesScored === 3;
  $: piEmojiVisible = isPiSeconds && !isPieTrick; 
  
  function zeroPadded(number) {
    return number >= 10 ? number.toString() : `0${number}`;
  }

  function getMillisecsText(elapsedText) {
    const truncateIndex = 3 - $nPiesScored;
    return elapsedText.slice(-3, -truncateIndex);
  }

  let interval;

  $: if (isStop) {
    clearInterval(interval);
    if ($nPiesScored < 3 && isPiSeconds) {
      pieSpin();
      nPiesScored.set($nPiesScored + 1); 
    }
  }
  $: if (isStart) {
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
  y: Math.round(window.innerHeight / 6),
  text: formattedElapsed,
  width: window.innerWidth,
  height: window.innerHeight / 2,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: watchFontSize,
  fontFamily: 'digital',
  fillEnabled: true,
  fill: 'white',
  strokeWidth: 0
}} />

<Text config={{
  offsetX: window.innerWidth / 2,
  offsetY: window.innerHeight / 4,
  x: window.innerWidth / 2,
  y: window.innerHeight / 4,
  text: "🥧",
  width: window.innerWidth,
  height: window.innerHeight / 2,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: isPiSecondsFontSize,
  fillEnabled: true,
  visible: piEmojiVisible,
}} bind:handle={pieEl} />

