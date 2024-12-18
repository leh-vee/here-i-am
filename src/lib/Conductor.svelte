<script>
  import { Stage } from 'svelte-konva';
  import Overture from './Overture.svelte';
  import Countdown from './Countdown.svelte';
  import SwanSong from './SwanSong.svelte';
  import VerseNumber from './VerseNumber.svelte';
  import GameOver from './GameOver.svelte';
  import { isDataInitialized } from '../stores/base';

  const movements = ['overture', 'countdown', 'swanSong', 'gameOver'];
  let movementIndex = 0;
  $: movement = movements[movementIndex];

  function nextMovement() { movementIndex += 1 }
</script>

{#if movement !== 'gameOver' }
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
    {#if movement === 'overture' }
      <Overture on:goneNova={ nextMovement } />
    {:else if movement === 'countdown' }
      <Countdown on:groundZero={ nextMovement } />
    {:else if movement === 'swanSong' }
      <SwanSong on:mySelf={ nextMovement } />
    {/if}
  </Stage>
{:else} 
  <GameOver />
{/if}
{#if isDataInitialized}
  <VerseNumber />
{/if}
