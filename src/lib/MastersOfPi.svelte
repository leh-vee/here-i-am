<script>
  const leaders = [
    {
      name: 'Richard',
      time: '89:21.654',
      date: '04/02/25'
    },
    {
      name: 'Mia',
      time: '75:21.112',
      date: '03/01/25'
    },
    {
      name: 'Dan',
      time: '71:07.956',
      date: '21/11/24'
    }
  ]

</script>

<div id='leader-board'>
  <div id='titles'>
    <h1 id='main'>Masters of π</h1>
    <h5 id='sub'>&mdash; all time slowest hat tricks &mdash;</h5>
  </div>
  <div id='leaders'>
    {#each leaders as leader, i}
      <div class='leader'>
        <h1 class='name'>{ leader.name }</h1>
        <h1 class='time'>{ leader.time }...</h1>
        <h1 class='date'>{ leader.date }</h1>
      </div>
    {/each}
  </div>
</div>

<style>
  #leader-board {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  } 
  
  #leader-board #titles {
    flex: 1;
    margin-top: 4.3dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  #titles #main {
    margin: 0;
    font-family: 'Press Start 2P';
    font-size: 3dvh;
    color: lightgoldenrodyellow;
  }

  #titles #sub {
    margin-top: 5px;
    font-size: 1dvh;
    font-family: 'Press Start 2P';
    color: white;
  }

  #leader-board #leaders {
    flex: 6;
    margin-bottom: 5dvh;
    display: flex;
    flex-direction: column;
  }

  #leader-board .leader {
    flex: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .leader h1 {
    margin-top: 0;
    margin-bottom: 1dvh;
  }

  .leader .name {
    font-size: 3dvh;
    font-family: 'Press Start 2P';
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
    font-size: 6dvh;
    color: white;
    font-family: 'digital';
  }

  .leader .date {
    font-family: 'Press Start 2P';
    font-size: 1.5dvh;
    margin: 0;
    color: lightgray;
  }

</style>