<script>
  import { fade } from 'svelte/transition'
  import { db } from './firebase'
  import { collectionData } from 'rxfire/firestore'
  import Entry from './Entry.svelte'

  export let userId = '';

  let entries = []

  collectionData(
    db.collection('entries').where('uid', '==', userId),
    'id'
  ).subscribe(e => entries = e);
</script>

<style>
  main {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  h2 {
    margin: 32px 0 16px;
  }
</style>

<main in:fade="{{ duration: 500 }}">
  <h2>Entries</h2>
  {#each entries as entry}
    <Entry {...entry} />
  {/each}
</main>
