<script>
	import { page } from '$app/stores';
	let errorMessage = 'Something wrong happened!';
	if ($page.status  === 404) {
		errorMessage = "This page doesn't exist!";
	}
</script>

<div class="px-4 py-2 justify-center text-center">
	<h1 class="mb-2">Tilt Demo App - Yves Mongo</h1>
	<p class="mb-2">{errorMessage}</p>
	<a href="/">Back to home</a>
</div>
