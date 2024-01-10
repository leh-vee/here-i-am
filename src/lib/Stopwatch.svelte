<script>
  import { Text } from 'svelte-konva';  
  import { isEllipsis, isFirstVerseWord, isLastVerseWord  } from '../stores/text';

  export let inFlight = false;

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
  $: ms = isZero ? "0" : elapsedMillisecs.toString().slice(-3, -2);

  $: formattedElapsed = `${mm}:${ss}.${ms}`;

  $: isPieVisible = elapsedMillisecs > 194000 && elapsedMillisecs < 194099; 
  
  function zeroPadded(number) {
    return number >= 10 ? number.toString() : `0${number}`;
  }

  $: isPreVerseElliptical = $isEllipsis && $isFirstVerseWord;
  $: isPostVerseElliptical = $isEllipsis && $isLastVerseWord;

  let interval;

  $: if (isPreVerseElliptical) start = current;
  $: if (isPostVerseElliptical) clearInterval(interval);
  $: if (inFlight) {
    start = new Date();
    current = start;
    interval = setInterval(() => {
			current = new Date();
		}, 10);
  }

</script>

<Text config={{
  y: Math.round(window.innerHeight / 5.3),
  text: formattedElapsed,
  width: window.innerWidth,
  height: window.innerHeight / 2,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: 9,
  fontFamily: 'digital',
  fillEnabled: true,
  fill: 'white',
  strokeWidth: 0
}} />

<Text config={{
  y: Math.round(window.innerHeight / 8),
  text: "🥧",
  width: window.innerWidth,
  height: window.innerHeight / 2,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: 50,
  fillEnabled: true,
  visible: isPieVisible
}} />

