<script lang="ts">
  import '../app.css';
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;

  // let { supabase, session } = data;
  $: ({ supabase, session } = data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<svelte:head>
  <title>Tilt Demo App - Yves Mongo</title>
</svelte:head>
<div class="min-h-screen flex flex-col">
  <div class="container  mx-auto flex-grow bg-base-200">
    <slot />
  </div>
</div>
