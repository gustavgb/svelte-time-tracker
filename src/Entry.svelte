<script>
  import { fade } from 'svelte/transition'
  import { db, auth } from './firebase'
  import { collectionData } from 'rxfire/firestore'
  import format from 'humanize-duration'
  import date from 'date-and-time';

  export let start = 0;
  export let end = 0;
  export let uid = ''
  export let id = ''

  let edit = false;
  let el = null
  let error = ''

  let entries = []
  const dateTemplate = 'YYYY/MM/DD HH:mm:ss'

  $: startFormatted = date.format(new Date(start), dateTemplate);
  $: endFormatted = date.format(new Date(end), dateTemplate);

  function handleSave () {
    let nextStart, nextEnd
    try {
      nextStart = date.parse(startFormatted, dateTemplate).getTime()
      nextEnd = date.parse(endFormatted, dateTemplate).getTime()
    } catch (e) {
      error = 'Could not parse dates.'

      console.error(e)
      return false
    }

    if (isNaN(nextStart)) {
      error = 'Start date is invalid.'

      return false
    }

    if (isNaN(nextEnd)) {
      error = 'End date is invalid'

      return false
    }

    db.collection('entries').doc(id).update({
      start: nextStart,
      end: nextEnd
    })
    return true
  }

  function handleClose (ev2) {
    if (!el.contains(ev2.target) && handleSave()) {
      error = ''
      edit = false
      document.removeEventListener('click', handleClose);
    }
  }

  function handleEdit (ev) {
    el = ev.target

    if (!el.classList.contains('entry')) {
      return
    }

    document.addEventListener('click', handleClose);

    edit = true
  }

  function handleDelete () {
    if (confirm('Do you want to delete this entry?')) {
      edit = false;
      error = ''
      document.removeEventListener('click', handleClose);
      db.collection('entries').doc(id).delete()
    }
  }
</script>

<style>
  .entry {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-gap: 8px;
    background-color: white;
    box-shadow: 0px 2px 7px -2px rgba(29,29,29,1);
    margin-bottom: 16px;
    border-radius: 3px;
    padding: 16px;
  }

  .from {
    grid-column: 1;
    grid-row: 1;
  }

  .to {
    grid-column: 1;
    grid-row: 2;
  }

  .duration {
    grid-column: 2;
    grid-row: 1 / 3;
    align-self: center;
    justify-self: end;
  }

  .error {
    grid-column: 1 / 3;
    grid-row: 3;
    color: darkred;
    font-size: 14px;
    margin: 8px 0 0;
    padding: 0;
  }
</style>

<div class="entry" on:click={handleEdit} in:fade="{{ duration: 500 }}">
  <div class="from">
    From
    {#if edit}
      <input bind:value={startFormatted} />
    {:else}
      <div>{date.format(new Date(start), dateTemplate)}</div>
    {/if}
  </div>
  <div class="to">
    Until
    {#if edit}
      <input bind:value={endFormatted} />
    {:else}
      <div>{date.format(new Date(end), dateTemplate)}</div>
    {/if}
  </div>
  <div class="duration">
    {format(end - start, { round: true })}
  </div>

  {#if edit}
    <button on:click={handleDelete}>Delete this entry</button>
  {/if}

  <span class="error">{error}</span>
</div>
