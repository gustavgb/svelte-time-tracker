<script>
  import { fade } from 'svelte/transition'
  import { db, auth } from './firebase'
  import { collectionData } from 'rxfire/firestore'
  import format from 'humanize-duration'

  export let userId = '';

  let entries = []

  collectionData(
    db.collection('entries').where('uid', '==', userId),
    'id'
  ).subscribe(e => entries = e);
</script>

<main transition:fade="{{ duration: 500 }}">
  <h2>Entries</h2>
  {#each entries as entry}
    <div class="entry">
      {format(entry.end - entry.start, { round: true })}
    </div>
  {/each}
</main>
