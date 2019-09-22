<script>
	import Navigation from './Navigation.svelte';
	import History from './History.svelte';

	import { auth, googleProvider } from './firebase';
	import { authState } from 'rxfire/auth';

	export let name = 'Gustav';

	let uid;
	let ready = false;

	const unsubscribe = authState(auth).subscribe(u => {
		ready = true;
		if (u) {
			uid = u.uid;
		} else {
			uid = null;
		}
	});

	function login() {
		auth.signInWithPopup(googleProvider);
	}

	function logout () {
		auth.signOut();
	}
</script>

<style>
	:global(body) {
		margin: 0;
		padding: 0;

		background-color: #f8f7f8;
	}

	:global(body) > :global(*) {
		box-sizing: border-box;
	}

	p {
		text-align: center;
		margin: 100px 0;
	}
</style>

{#if ready}
	<Navigation userId={uid} {login} {logout} />

  {#if !uid}
    <p>Login to see your entries.</p>
  {:else}
		<History userId={uid} />
	{/if}
{/if}
