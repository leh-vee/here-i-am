<script>
  import DropDownMenu from "./DropDownMenu.svelte";
  import { fetchFaqText } from '../../api/client.js';

  export let isVisible = false;
  let groundZeroEl;

  let linesToText = [];
  fetchFaqText().then(lines => {
    linesToText = [...lines];
  });

  let textIndex = 0;
  $: isTexting = isVisible && linesToText !== undefined;
  $: textType = textIndex % 2 === 0 ? 'question' : 'answer';
  $: isFinalAnswer = textIndex === linesToText.length - 1;

  let textCharsCount, previousTextCharsCount;
  $: if (isTexting && textIndex < linesToText.length - 1) {
    textCharsCount = linesToText[textIndex].length;
    previousTextCharsCount = textIndex === 0 ? 0 : linesToText[textIndex - 1].length;
    getNextText();
  }

  let isTyping = false;
  async function getNextText() {
    await delay('thinking');
    isTyping = true;
    groundZeroEl.scrollIntoView({ behavior: "smooth", block: "end" });
    await delay('typing');
    isTyping = false;
    textIndex += 1;
    groundZeroEl.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  const textDelayRanges = {
    thinking: {
      question: [25, 50], 
      answer: [100, 200]
    },
    typing: {
      question: [100, 150], 
      answer: [125, 200]
    } 
  }

  function delay(type) {
    return new Promise((resolve) => {
      const delayFactor = getRandomNumber(...textDelayRanges[type][textType]);
      let nChars = type === 'thinking' ?  previousTextCharsCount : textCharsCount;
      const delayMillisecs = nChars * delayFactor;
      setTimeout(() => {
        resolve(true);
      }, delayMillisecs)
    });
  }

  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  let flashingDots = [true, false, false];
  setInterval(() => {
    if (flashingDots[0]) {
      flashingDots = [false, true, false];
    } else if (flashingDots[1]) {
      flashingDots = [false, false, true];
    } else {
      flashingDots = [true, false, false];
    }
  }, 600);

  function getTextType(index) {
    return index % 2 === 0 ? 'question' : 'answer';
  }

</script>

<DropDownMenu isHidden={ !isVisible }>
  <div id='info'>
    <h3>Frequently Asked Questions</h3>
    <div id='faq'>
      {#each linesToText.slice(0, textIndex) as text, i}
        <p class='{getTextType(i)}'>{ text }</p>
      {/each}
      {#if isTyping || isFinalAnswer }
        <p class='{textType} waiting'>
          {#each flashingDots as isFlashing}
            <span class='dot' class:flash={isFlashing}>&#x2022;</span>
          {/each}
        </p>
      {/if}
      <div class='nobody' bind:this={ groundZeroEl }></div>
    </div>
    
  </div>
</DropDownMenu>

<style>
  #info {
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    padding: 0 10px;
    overflow-y: inherit;
  } 

  h3 {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    text-align: center;
    font-weight: 100;
    color: lightgoldenrodyellow;
  }

  #faq {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
  }
  
  p {
    font-family: Helvetica, sans-serif;
    font-size: 5vw;
    font-weight: 400;
    color: rgb(218, 218, 218);
    background-color: rgb(52, 52, 53);
    padding: 5px 10px;
    margin: 8px 0;
    align-self: baseline;
    max-width: 75%;
    border-radius:10px;
  }

  p.answer {
    align-self: flex-end;
    background-color: rgb(41, 132, 245);
    color: white;
  }

  p.waiting {
    padding: 0 5px;
  }
  
  .dot {
    font-size: 7vw;
    color: white;
    transition: color 0.7s ease-in-out;
  }

  .dot.flash {
    color: darkgrey;
  }

  .nobody {
    width: 100%;
    height: 100px;
  }

</style>