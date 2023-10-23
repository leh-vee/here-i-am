<script>
  import { Text } from 'svelte-konva';
  import { currentPiSlice, isFirstVerseTriad } from '../stores/text.js';

  $: verseNumber = isFirstVerseTriad ? asRomanNumeral($currentPiSlice) : String($currentPiSlice);

  function asRomanNumeral(n) {
    let romanNumeral = "";
    for (let i = 0; i < n; i++) romanNumeral += "I";
    return romanNumeral;
  }
</script>

<Text config={{
  text: verseNumber,
  width: window.innerWidth,
  height: window.innerHeight,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: 200,
  fontFamily: 'Source Code Pro',
  fillEnabled: true,
  fill: 'black',
  stroke: 'black',
  strokeWidth: 1
}} />