<script>
  import { Text } from 'svelte-konva';  
  import { isEllipsis, isFirstVerseWord, isLastVerseWord  } from '../stores/text';
  import { nPiesScored } from '../stores/base';


  export let inFlight = false;
  let pieEl;

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

  $: isPiSeconds = elapsedMillisecs > 194000 && elapsedMillisecs < 194099;
  
  function zeroPadded(number) {
    return number >= 10 ? number.toString() : `0${number}`;
  }

  $: isPreVerseElliptical = $isEllipsis && $isFirstVerseWord;
  $: isPostVerseElliptical = $isEllipsis && $isLastVerseWord;

  let interval;

  $: if (isPreVerseElliptical) start = current;
  $: if (isPostVerseElliptical) {
    clearInterval(interval);
    if (isPiSeconds) {
      pieSpin();
      nPiesScored.set($nPiesScored + 1); 
    }
  }
  $: if (inFlight) {
    start = new Date();
    current = start;
    interval = setInterval(() => {
			current = new Date();
		}, 10);
  }

  const pieEmoji = "🥧";

  function getPieScoreBoardText() {
    let text = "";
    for (let i = 0; i < $nPiesScored; i++) {
      text = `${text} ${pieEmoji}`;
    }
    return text.trim();
  }

  function pieSpin() {
    pieEl.to({
      duration: Math.PI / 10,
      rotation: -360
    });
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
  offsetX: window.innerWidth / 2,
  offsetY: window.innerHeight / 4,
  x: window.innerWidth / 2,
  y: window.innerHeight / 4,
  text: pieEmoji,
  width: window.innerWidth,
  height: window.innerHeight / 2,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: 50,
  fillEnabled: true,
  visible: isPiSeconds
}} bind:handle={pieEl} />

<Text config={{
  y: Math.round(window.innerHeight / 2.7),
  text: getPieScoreBoardText(),
  width: window.innerWidth,
  height: window.innerHeight / 2,
  fontSize: 25,
  align: "center",
  fillEnabled: true
}} />

