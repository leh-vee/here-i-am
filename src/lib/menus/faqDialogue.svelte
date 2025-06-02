<script>
  import { tick, onMount } from 'svelte';
  import { fetchFaqText } from '../../api/client.js';
  import { faqLinesToText, faqLineIndex, screenHeight, 
    screenWidth } from "../../stores/base";

  export let isVisible = false;
  export let pFontSize;
  let nobodyEl, ellipsisEl;

  $: dotSize = `${Math.round($screenWidth * 0.07)}px`;

  onMount(async () => {
    await tick();
    scrollLastTextIntoView();
  });

  $: isFaqLinesLoaded = $faqLinesToText.length > 0;
  $: if (!isFaqLinesLoaded) loadFaq();

  function loadFaq() {
    fetchFaqText().then(lines => {
      $faqLinesToText = [...lines];
    });
  }

  function scrollLastTextIntoView() {
    if (nobodyEl === null) return null;
    const nobodyElBottom = nobodyEl.getBoundingClientRect().bottom;
    const isLastTextBelowFold = nobodyElBottom > $screenHeight;
    if (isLastTextBelowFold) {
      nobodyEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  let nTextChars = { current: 0, previous: 0 };
  let isFinalEllipsis = false;
  
  $: if ($faqLineIndex < $faqLinesToText.length && isTexting) getNextText();

  $: if ($faqLineIndex === $faqLinesToText.length && isTexting && !isFinalEllipsis) {
    setTimeout(() => {
      isFinalEllipsis = true;
    }, Math.PI * 1000);
  }

  let isTyping = false;
  let isWaitingOnNextText = false;
  async function getNextText() {
    nTextChars.previous = nTextChars.current; 
    nTextChars.current = $faqLinesToText[$faqLineIndex].length;
    await delay('thinking');
    isTyping = true;
    await delay('typing');
    if (ellipsisEl === null) return null;
    isWaitingOnNextText = ellipsisEl.getBoundingClientRect().top < $screenHeight;
    isTyping = false;
    if ($faqLineIndex < $faqLinesToText.length) {
      $faqLineIndex += 1;
      await tick();
      if (isWaitingOnNextText) scrollLastTextIntoView();
    }
  }

  const textDelayRanges = {
    thinking: {
      question: [1000, 1500], 
      answer: [1500, 1800]
    },
    typing: {
      question: [1300, 1650], 
      answer: [1500, 2000]
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

  $: isEllipsis = isTyping || isFinalEllipsis;

  $: isTexting = isFaqLinesLoaded && isVisible;
  $: textType = $faqLineIndex % 2 === 0 ? 'question' : 'answer';
</script>

<div id='dialogue' style="--pFontSize:{pFontSize}; --dotSize:{dotSize};">
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

<style>
  #dialogue {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
  }
  
  p.text {
    font-size: var(--pFontSize);
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
    font-size: var(--dotSize);
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