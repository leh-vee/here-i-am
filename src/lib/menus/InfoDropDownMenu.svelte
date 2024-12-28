<script>
  import DropDownMenu from "./DropDownMenu.svelte";
  import { fetchFaqText } from '../../api/client.js';
  import { serializeCouplets } from '../../utils/textJson.js';

  export let isVisible = false;

  let faqs = [];
  let nFaqs;
  fetchFaqText().then(lines => {
    faqs = serializeCouplets(lines);
    nFaqs = faqs.length;
  });

  let faqIndex = 1;
  let hasQuestionArrived = false;
  let hasAnswerArrived = false;

  $: if (faqIndex) {
    setTimeout(() => {
      hasQuestionArrived = true;
    }, getRandomTextInterval());
  }

  $: if (hasQuestionArrived) {
    setTimeout(() => {
      hasAnswerArrived = true;
    }, getRandomTextInterval());
  }

  $: if (hasAnswerArrived) {
    setTimeout(nextQuestion, 1000);
  }
   
  function nextQuestion() {
    if (faqIndex < nFaqs - 1) {
      faqIndex += 1;
      hasQuestionArrived = false;
      hasAnswerArrived = false;
    }
  }

  const flashingDotsReset = [true, false, false]
  let flashingDots = flashingDotsReset;

  setInterval(() => {
    if (flashingDots[0]) {
      flashingDots = [false, true, false];
    } else if (flashingDots[1]) {
      flashingDots = [false, false, true];
    } else {
      flashingDots = flashingDotsReset
    }
  }, 600);

  function getRandomTextInterval() {
    const seconds = Math.random() * (10 - 5) + 5;
    return seconds * 1000;
  }

</script>

<DropDownMenu isHidden={ !isVisible }>
  <div id='info'>
    <h3>Frequently Asked Questions</h3>
    <div id='faq'>
      {#each faqs.slice(0, faqIndex) as qaPair, i}
        {#if i === faqIndex - 1}
          {#if hasQuestionArrived}
            <p class='question'>{ qaPair.a }</p>
          {:else}
            <p class='waiting question'>
              {#each flashingDots as isFlashing}
                <span class='dot' class:flash={isFlashing}>&#x2022;</span>
              {/each}
            </p>
          {/if}
          {#if hasAnswerArrived} 
            <p class='answer'>{ qaPair.b }</p>
          {:else if hasQuestionArrived}
            <p class='waiting answer'>
              {#each flashingDots as isFlashing}
                <span class='dot' class:flash={isFlashing}>&#x2022;</span>
              {/each}
            </p>
          {/if}
        {:else}
          <p class='question'>{ qaPair.a }</p>
          <p class='answer'>{ qaPair.b }</p>
        {/if}
      {/each}
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
    font-size: 3.5vw;
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
    font-size: 2.5vh;
    color: white;
    transition: color 0.7s ease-in-out;
  }

  .dot.flash {
    color: darkgrey;
  }

</style>