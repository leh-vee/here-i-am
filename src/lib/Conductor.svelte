<script>
  import { Stage } from 'svelte-konva';
  import Overture from './Overture.svelte';
  import Countdown from './Countdown.svelte';
  import SwanSong from './SwanSong.svelte';
  import VerseNumber from './VerseNumber.svelte';
  import Postscript from './Postscript.svelte';
  import { isDataInitialized, screenWidth, screenHeight } from '../stores/base';

  const movements = ['overture', 'countdown', 'swanSong', 'postscript'];
  let movementIndex = 0;
  $: movement = movements[movementIndex];

  function nextMovement() { movementIndex += 1 }
</script>

{#if movement !== 'postscript' }
  <Stage config={{ width: $screenWidth, height: $screenHeight }}>
    {#if movement === 'overture' }
      <Overture on:goneNova={ nextMovement } />
    {:else if movement === 'countdown' }
      <Countdown on:groundZero={ nextMovement } />
    {:else if movement === 'swanSong' }
      <SwanSong on:mySelf={ nextMovement } />
    {/if}
  </Stage>
{:else} 
  <Postscript />
{/if}
{#if isDataInitialized}
  <VerseNumber />
{/if}
