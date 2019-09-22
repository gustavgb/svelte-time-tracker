<script>
  import { fly } from 'svelte/transition';
  import { db, auth } from './firebase'
  import { collectionData } from 'rxfire/firestore'
  import { interval } from 'rxjs'
  import format from 'humanize-duration'

  export let logout = () => {};
  export let login = () => {};

  export let userId = false;

  let currentInterval
  let timerString = ''
  let running = false
  let currentEntry

  function startTime () {
    db.collection('entries').add({
      uid: userId,
      start: Date.now(),
      end: null
    })
  }

  function stopTime () {
    if (currentEntry) {
      db.collection('entries').doc(currentEntry).update({
        end: Date.now()
      })
    }
  }

  collectionData(
    db.collection('entries').where('uid', '==', userId).where('end', '==', null).orderBy('start', 'desc'),
    'id'
  ).subscribe(entries => {
    const current = entries[0]

    if (current && !currentInterval) {
      currentEntry = current.id
      running = true
      const startAt = current.start
      timerString = format(Date.now() - startAt, { round: true })
      currentInterval = interval(1000).subscribe(() => {
        timerString = format(Date.now() - startAt, { round: true })
      })
    } else if (!current && currentInterval) {
      currentInterval.unsubscribe()
      currentInterval = null
      running = false
    }
  });
</script>

<style>
  h1 {
    float: left;
    margin: 0;
    flex-grow: 1;
    flex-shrink: 0;
  }

  nav {
    width: 100%;
    padding: 24px;
    background-color: #cc8014;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  nav::after {
    content: "";
    display: table;
    clear: both;
  }

  button {
    float: right;
    margin: 0;
    padding: 8px 24px;
    margin-left: 8px;
  }

  p {
    margin: 0;
  }
</style>

<nav transition:fly="{{ y: -200, duration: 500 }}">
  <h1>
    Time tracker
  </h1>
  {#if userId}
    {#if running}
      <p>{timerString}</p>
      <button on:click={stopTime}>Stop</button>
    {:else}
      <button on:click={startTime}>Start</button>
    {/if}
    <button on:click={logout}>Sign out</button>
  {:else}
    <button on:click={login}>Log in</button>
  {/if}
</nav>
