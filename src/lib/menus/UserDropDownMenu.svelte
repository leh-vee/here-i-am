<script>
  import DropDownMenu from "./DropDownMenu.svelte";
  import { fetchFaqText, fetchAboutMeText } from '../../api/client.js';
  import { faqLinesToText, faqLineIndex, aboutMeText,
    screenWidth, screenHeight } from "../../stores/base";
  import { tick, onMount } from 'svelte';

  onMount(async () => {
    await tick();
    scrollLastTextIntoView();
  });

  export let isVisible = false;

  let nobodyEl, ellipsisEl;

  $: meFontSize = `${Math.round($screenWidth * 0.06)}px`;
  $: textFontSize = `${Math.round($screenWidth * 0.05)}px`;
  $: hFontSize = `${Math.round($screenWidth * 0.06)}px`;
  $: dotSize = `${Math.round($screenWidth * 0.07)}px`;

  $: isAboutMeTextLoaded = $aboutMeText.length > 0;
  $: if (!isAboutMeTextLoaded) loadAboutMeText(); 

  function loadAboutMeText() {
    fetchAboutMeText().then(lines => {
      $aboutMeText = [...lines];
    });
  }

  $: isFaqLinesLoaded = $faqLinesToText.length > 0;
  $: if (!isFaqLinesLoaded) loadFaq();

  function loadFaq() {
    fetchFaqText().then(lines => {
      $faqLinesToText = [...lines];
    });
  }

  $: isTexting = isVisible && isFaqLinesLoaded && isFaqVisible;
  $: textType = $faqLineIndex % 2 === 0 ? 'question' : 'answer';
  
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
  
  function scrollLastTextIntoView() {
    if (nobodyEl === null) return null;
    const nobodyElBottom = nobodyEl.getBoundingClientRect().bottom;
    const isLastTextBelowFold = nobodyElBottom > $screenHeight;
    if (isLastTextBelowFold) {
      nobodyEl.scrollIntoView({ behavior: "smooth" });
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

  let isMeVisible = true;
  $: isFaqVisible = !isMeVisible;

  function showSection(e) {
    const isMeButtonClicked = e.currentTarget.classList.contains('me');
    isMeVisible = isMeButtonClicked;
  }

</script>

<DropDownMenu isHidden={ !isVisible } on:close>
  <div style="--meFontSize:{meFontSize}; --textFontSize:{textFontSize}; --hFontSize:{hFontSize}; --dotSize:{dotSize}">
    <div id='user-menu'>
      <div class='tabs'>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <h2 class='me button' class:pressed={isMeVisible} on:click={ showSection }>About Me</h2>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <h2 class='faq button' class:pressed={isFaqVisible} on:click={ showSection }>FAQ</h2>
      </div>
      <div id='me' class='section' class:visible={isMeVisible}>
        {#each $aboutMeText as aboutMeParagraph}
          <p>{ aboutMeParagraph }</p>
        {/each}
      </div>
      <div id='faq' class='section' class:visible={isFaqVisible}>
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
  #user-menu {
    padding: 0 3%;
    font-family: Helvetica, sans-serif;
    overflow-y: inherit;
  } 

  .tabs {
    display: flex;
    justify-content: center;
  }

  h2.button {
    font-size: var(--hFontSize);
    border: 1px dimgrey solid;
    border-radius: 5px;
    padding: 3%;
    margin-right: 8%;
  }
  
  h2.button.pressed {
    color: gold;
    border-width: 0;
  }

  .section {
    display: none;
  }

  .section.visible {
    display: block;
  }

  #me {
    margin: 0 5%;
  }

  #me p {
    color: ghostwhite;
    line-height: 1.5;
    font-family: 'Love Ya Like A Sister';
    font-size: var(--meFontSize);
  }

  #dialogue {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
  }
  
  p.text {
    font-size: var(--textFontSize);
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