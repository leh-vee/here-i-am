<script>
  import { Text } from 'svelte-konva';  
  import { onMount } from 'svelte';

  let start = new Date();
  $: startTime = start.getTime();

  let current = new Date();
  $: currentTime = current.getTime();

  $: elapsedSecs = currentTime - startTime;

	$: minutes = Math.floor(elapsedSecs / 60000);
  $: mm = zeroPadded(minutes);
	$: seconds = Math.floor(elapsedSecs / 1000);
  $: ss = zeroPadded(seconds);
  $: ms = elapsedSecs.toString().slice(-3, -1);

  $: formattedElapsed = `${mm}:${ss}.${ms}`;

  function zeroPadded(number) {
    return number >= 10 ? number.toString() : `0${number}`;
  }

  onMount(() => {
		const interval = setInterval(() => {
			current = new Date();
		}, 10);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<Text config={{
  text: formattedElapsed,
  width: window.innerWidth,
  height: window.innerHeight / 2,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: 50,
  fontFamily: 'Inconsolata',
  fillEnabled: true,
  fill: 'white',
  stroke: 'white',
  strokeWidth: 1
}} />

