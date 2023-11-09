<!-- src/routes/account/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import AddAppliance from '$lib/comps/AddAppliance.svelte';
  import UserAppliance from '$lib/comps/UserAppliance.svelte';
  import type { SubmitFunction } from '@sveltejs/kit';
  export let data;
  export let form;

  let { session, supabase, profile, appliancesInfo } = data;
  $: ({ session, supabase, profile, appliancesInfo } = data);

  

  let profileForm: HTMLFormElement;
  let loading = false;
  let username: string = profile?.username ?? '';

  let totalConsumed: number = 0;

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    return async () => {
      loading = false;
    };
  };

  const handleSignOut: SubmitFunction = () => {
    loading = true;
    return async ({ update }) => {
      loading = false;
      update();
    };
  };
</script>

<div class="form-widget">
  <form
    class="form-widget"
    method="post"
    action="?/update"
    use:enhance={handleSubmit}
    bind:this={profileForm}
  >
    <div>
      <label for="email">Email</label>
      <input id="email" type="text" value={session.user.email} disabled />
    </div>

    <div>
      <label for="username">Username</label>
      <input id="username" name="username" type="text" value={form?.username ?? username} />
    </div>
    <div>
      {#if profile.appliances}
        {#each profile.appliances as userAppliance}
          <UserAppliance {userAppliance} {totalConsumed} />
        {/each}
      {:else}
        No appliances!
      {/if}
      <AddAppliance {appliancesInfo} />
    </div>
  </form>

  <form method="post" action="?/signout" use:enhance={handleSignOut}>
    <div>
      <button class="button block" disabled={loading}>Sign Out</button>
    </div>
  </form>
</div>
