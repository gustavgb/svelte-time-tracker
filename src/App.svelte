<script>
	import Navigation from './Navigation.svelte';
	import History from './History.svelte';

	import { auth, googleProvider } from './firebase';
	import { authState } from 'rxfire/auth';

	export let name = 'Gustav';

	let user;
	let ready = false;

	const unsubscribe = authState(auth).subscribe(u => {
		ready = true;
		user = u;
	});

	function login() {
		auth.signInWithPopup(googleProvider);
	}

	function logout () {
		auth.signOut();
	}
</script>

<style>
	h1 {
		color: purple;
	}

	:global(body) {
		margin: 0;
		padding: 0;
	}

	:global(body) > :global(*) {
		box-sizing: border-box;
	}
</style>

{#if ready}
	<Navigation userId={user.uid} {login} {logout} />

	<History userId={user.uid} />
{/if}
