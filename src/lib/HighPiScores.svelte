<script>
  const leaders = [
    {
      name: 'Richard',
      time: '13:07.956',
      date: '04/02/25'
    },
    {
      name: 'Tobias',
      time: '25:21.112',
      date: '03/01/25'
    },
    {
      name: 'Maya',
      time: '31:21.654',
      date: '21/11/24'
    }
  ]

</script>

<div id='high-scores'>
  <h1 id='title'>Masters of <span id='pies'>🥧🥧🥧</span></h1>
  <h5 id='subtitle'><sup>*</sup>those quickest to score 3x</h5>
  {#each leaders as leader, i}
    <div class='leader'>
      <h1 class='name'>{ leader.name }</h1>
      <h1 class='time'>{ leader.time }</h1>
      <h1 class='date'>{ leader.date }</h1>
    </div>
  {/each}
</div>

<style>
  #high-scores {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  } 

  #high-scores #title {
    margin: 0;
    font-family: 'Press Start 2P';
    font-size: 3dvh;
    color: lightgoldenrodyellow;
  }

  #high-scores #subtitle {
    margin-top: 0;
    margin-bottom: 15dvw;
    font-size: 1.5dvh;
    font-family: 'Press Start 2P';
    color: white;
  }
  
  #title #pies {
    font-size: 4.5dvh;
  } 

  #high-scores .leader {
    text-align: center;
    margin-bottom: 10dvw;
  }
  
  .leader h1 {
    margin-top: 0;
    margin-bottom: 2dvw;
  }

  .leader .name {
    font-size: 3.5dvh;
    font-family: 'Love Ya Like A Sister';
  } 

  .leader:nth-of-type(1) .name {
    color: gold;
  }

  .leader:nth-of-type(2) .name {
    color: silver;
  }

  .leader:nth-of-type(3) .name {
    color: #FF5733;
  }

  .leader .time {
    font-size: 4dvh;
    color: white;
    font-family: 'digital';
  }

  .leader .date {
    font-family: 'Homemade Apple';
    font-size: 2.5dvh;
    margin: 0;
    color: lightgray;
  }

</style>