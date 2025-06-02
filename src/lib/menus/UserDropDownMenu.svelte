<script>
  import DropDownMenu from "./DropDownMenu.svelte";
  import FaqDialogue from "./faqDialogue.svelte";
  import { fetchAboutMeText } from '../../api/client.js';
  import { aboutMeText, screenWidth } from "../../stores/base";
  
  export let isVisible = false;

  $: pFontSize = `${Math.round($screenWidth * 0.05)}px`;
  $: hFontSize = `${Math.round($screenWidth * 0.06)}px`;

  $: isAboutMeTextLoaded = $aboutMeText.length > 0;
  $: if (!isAboutMeTextLoaded) loadAboutMeText(); 

  function loadAboutMeText() {
    fetchAboutMeText().then(lines => {
      $aboutMeText = [...lines];
    });
  }

  let isMeVisible = true;
  $: isFaqVisible = !isMeVisible;

  function showSection(e) {
    const isMeButtonClicked = e.currentTarget.classList.contains('me');
    isMeVisible = isMeButtonClicked;
  }

</script>

<DropDownMenu isHidden={ !isVisible } on:close>
  <div style="--pFontSize:{pFontSize}; --hFontSize:{hFontSize};">
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
        <FaqDialogue isVisible={ isVisible && isFaqVisible } pFontSize={ pFontSize } />
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
    padding: 2%;
    margin-right: 8%;
  }
  
  h2.button.pressed {
    border-color: gold;
    color: gold;
  }

  .section {
    display: none;
  }

  .section.visible {
    display: block;
  }

  .section {
    margin: 0 1%;
  }

  #me p {
    color: ghostwhite;
    line-height: 1.5;
    font-size: var(--pFontSize);
  }
</style>