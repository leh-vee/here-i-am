<script>
  import DropDownMenu from "./DropDownMenu.svelte";
  import { fetchFaqText } from '../../api/client.js';

  export let isVisible = false;
  let nobodyEl;

  let linesToText = [];
  fetchFaqText().then(lines => {
    linesToText = [...lines];
  });

  let textIndex = 0;
  $: isTexting = isVisible && linesToText !== undefined;
  $: textType = textIndex % 2 === 0 ? 'question' : 'answer';
  $: isFinalAnswer = textIndex === linesToText.length - 1;

  let nTextChars = { current: 0, previous: 0}
  $: if (isTexting && textIndex < linesToText.length - 1) {
    nTextChars.previous = nTextChars.current; 
    nTextChars.current = linesToText[textIndex].length;
    getNextText();
  }

  let isTyping = false;
  async function getNextText() {
    await delay('thinking');
    isTyping = true;
    await delay('typing');
    isTyping = false;
    textIndex += 1;
    scrollToEllipsis();
  }
  
  function scrollToEllipsis() {
    console.log('scroll');
    setTimeout(() => {
      nobodyEl.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 1)
  }

  const textDelayRanges = {
    thinking: {
      question: [15, 50], 
      answer: [30, 60]
    },
    typing: {
      question: [15, 50], 
      answer: [30, 60]
    } 
  }

  function delay(type) {
    return new Promise((resolve) => {
      const delayFactor = getRandomNumber(...textDelayRanges[type][textType]);
      let nChars = type === 'thinking' ?  nTextChars.previous : nTextChars.current;
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

  $: isEllipsis = isTyping || isFinalAnswer;

</script>

<DropDownMenu isHidden={ !isVisible }>
  <div id='info'>
    <h3>Frequently Asked Questions</h3>
    <div id='faq'>
      {#each linesToText.slice(0, textIndex) as text, i}
        <p class='{getTextType(i)}'>{ text }</p>
      {/each}
      <p class='{textType} ellipsis' class:show={isEllipsis}>
        {#each flashingDots as isFlashing}
          <span class='dot' class:flash={isFlashing}>&#x2022;</span>
        {/each}
      </p>
      <div class='nobody' bind:this={ nobodyEl }></div>
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

  p.ellipsis {
    padding: 0 5px;
    visibility: hidden;
  }

  p.ellipsis.show {
    visibility: visible;
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
    height: 10px;
  }

</style>