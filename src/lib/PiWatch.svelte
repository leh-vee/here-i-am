<script>
  import { Text } from 'svelte-konva';  
  import { nPiesScored } from '../stores/base';

  let pieEl;
  export let isStart = false;
  export let isStop = false;

  const watchFontSize = Math.round(window.innerWidth / 30);
  const isPiSecondsFontSize = Math.round(window.innerWidth / 8);
  const piScoreBoardFontSize = Math.round(window.innerWidth / 16);

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
  $: zeroMsText = "000".slice(0, $nPiesScored + 1); 
  $: ms = isZero ? zeroMsText : getMillisecsText(elapsedMillisecs.toString(), $nPiesScored);

  $: formattedElapsed = `${mm}:${ss}.${ms}`;

  let isPiSeconds = false;
  $: if ($nPiesScored === 0) {
    isPiSeconds = elapsedMillisecs > 194100 && elapsedMillisecs < 194199;
  } else if ($nPiesScored === 1) {
    isPiSeconds = elapsedMillisecs > 194150 && elapsedMillisecs < 194159;
  } else if ($nPiesScored >= 2) {
    isPiSeconds = elapsedMillisecs === 194159;
  }
  
  
  function zeroPadded(number) {
    return number >= 10 ? number.toString() : `0${number}`;
  }

  function getMillisecsText(elapsedText, nPiesScored) {
    let text = elapsedText.slice(-3, -2);
    if (nPiesScored === 1) {
      text = elapsedText.slice(-3, -1);
    } else if (nPiesScored >= 2) {
      text = elapsedText.slice(-3);
    }
    return text;
  }

  let interval;

  $: if (isStop) {
    console.log('stop watch');
    clearInterval(interval);
    if (isPiSeconds) {
      pieSpin();
      nPiesScored.set($nPiesScored + 1); 
    }
  }
  $: if (isStart) {
    console.log('start watch');
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
  text: pieEmoji,
  width: window.innerWidth,
  height: window.innerHeight / 2,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: isPiSecondsFontSize,
  fillEnabled: true,
  visible: isPiSeconds
}} bind:handle={pieEl} />

<Text config={{
  y: Math.round(window.innerHeight / 2.7),
  text: getPieScoreBoardText(),
  width: window.innerWidth,
  height: window.innerHeight / 2,
  fontSize: piScoreBoardFontSize,
  align: "center",
  fillEnabled: true
}} />

