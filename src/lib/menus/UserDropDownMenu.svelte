<script>
  import DropDownMenu from "./DropDownMenu.svelte";
  import { fetchFaqText } from '../../api/client.js';
  import { faqLinesToText, faqLineIndex, screenHeight } from "../../stores/base";

  export let isVisible = false;
  let nobodyEl, ellipsisEl;

  $: isFaqLinesLoaded = $faqLinesToText.length > 0;
  $: if (!isFaqLinesLoaded) loadFaq();

  function loadFaq() {
    fetchFaqText().then(lines => {
      $faqLinesToText = [...lines];
    });
  }

  $: isTexting = isVisible && isFaqLinesLoaded;
  $: textType = $faqLineIndex % 2 === 0 ? 'question' : 'answer';
  let isFinalAnswer = false;

  $: if (isFaqLinesLoaded && $faqLineIndex === $faqLinesToText.length - 1) {
    setTimeout(() => {
      isFinalAnswer = true;
    }, Math.PI * 1000);
  }

  let nTextChars = { current: 0, previous: 0 };
  $: if (isTexting && $faqLineIndex < $faqLinesToText.length - 1) {
    nTextChars.previous = nTextChars.current; 
    nTextChars.current = $faqLinesToText[$faqLineIndex].length;
    getNextText();
  }

  let isTyping = false;
  async function getNextText() {
    await delay('thinking');
    isTyping = true;
    await delay('typing');
    isTyping = false;
    $faqLineIndex += 1;
    scrollToEllipsis();
  }
  
  function scrollToEllipsis() {
    const height = $screenHeight;
    const ellipsisTop = ellipsisEl.getBoundingClientRect().top;
    const isEllipsisVisible = ellipsisTop < height;
    const nobodyTop = nobodyEl.getBoundingClientRect().top;
    const isNobodyAtGroundZero = (nobodyTop + 10) < height;
    if (!isNobodyAtGroundZero && isEllipsisVisible) {
      setTimeout(() => {
        nobodyEl.scrollIntoView({ behavior: "smooth" });
      }, 1)
    }
  }

  const textDelayRanges = {
    thinking: {
      question: [500, 750], 
      answer: [750, 900]
    },
    typing: {
      question: [650, 875], 
      answer: [750, 1000]
    } 
  }

  function delay(type) {
    return new Promise((resolve) => {
      const delayFactor = getRandomNumber(...textDelayRanges[type][textType]);
      let nChars = type === 'thinking' ?  nTextChars.previous : nTextChars.current;
      const delayMillisecs = (Math.log(nChars) / Math.log(2)) * delayFactor;
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

<DropDownMenu isHidden={ !isVisible } on:close>
  <div>
    <div id='help'>
      <div id='me' class='section'>
        <h2>About Me</h2>
        <p>Hi, my name is Levi, the dark mirror that reveals what I needs it to.</p>
      </div>
      <div id='faq' class='section'>
        <h2>Frequently Asked Questions</h2>
        <div id='dialogue'>
          {#each $faqLinesToText.slice(0, $faqLineIndex) as text, i}
            <p class='text {getTextType(i)}'>{ text }</p>
          {/each}
          <p class='text {textType} ellipsis' class:show={isEllipsis} bind:this={ ellipsisEl }>
            {#each flashingDots as isFlashing}
              <span class='dot' class:flash={isFlashing}>&#x2022;</span>
            {/each}
          </p>
          <div class='nobody' bind:this={ nobodyEl }></div>
        </div>
      </div>
    </div>
  </div>
</DropDownMenu>

<style>
  #help {
    padding: 0 10px;
    font-family: Helvetica, sans-serif;
    overflow-y: inherit;
  } 

  h2 {
    color: gold;
  }

  #me p {
    color: white;
    font-size: 5vw;
  }

  #dialogue {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
  }
  
  p.text {
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

  p.text.answer {
    align-self: flex-end;
    background-color: rgb(41, 132, 245);
    color: white;
  }

  p.text.ellipsis {
    padding: 0 5px;
    visibility: hidden;
  }

  p.text.ellipsis.show {
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
    height: 1px;
  }

</style>