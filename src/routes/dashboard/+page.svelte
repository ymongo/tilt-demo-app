<script lang="ts">
  import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
  import AddAppliance from '$lib/comps/AddAppliance.svelte';
  import UserAppliance from '$lib/comps/UserAppliance.svelte';
  import type {UserAppliance as UserApplianceType}   from '$lib/models/appliance.js';
  import type { SubmitFunction } from '@sveltejs/kit';
  export let data;
  export let form;

  let { session, supabase, profile, appliancesInfo, totalConsumed } = data;
  $: ({ session, supabase, profile, appliancesInfo, totalConsumed } = data);


  let profileForm: HTMLFormElement;
  let loading = false;
  let username: string = profile?.username ?? '';

  async function deleteAppliance(id:string) {
    const data = new FormData(profileForm)
    profile.appliances = profile.appliances.filter((a:any) =>{ return a.id !== id})
    data.set('appliances', JSON.stringify(profile.appliances))
    const response = await fetch(profileForm.action, {
      method: 'POST',
      body: data
    })  
    invalidateAll()
  }

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

<div class="p-4 flex flex-col items-center">
  <form
    method="post"
    action="?/update"
    use:enhance={handleSubmit}
    bind:this={profileForm}
  >
    <div class="p-2">
      <label for="email">Email</label>
      <input id="email" type="text" value={session.user.email} disabled />
    </div>

    <div class="p-2">
      <label for="username">Username</label>
      <input id="username" name="username" type="text" value={form?.username ?? username} />
    </div>

    <div class="p-2">
      {#if profile?.appliances?.length}
        <p>You have {profile.appliances.length} appliances, consumming {totalConsumed}Wh/day</p>
        {#each profile.appliances as userAppliance}
          <UserAppliance {userAppliance} {totalConsumed} deleteFunction={deleteAppliance} />
        {/each}

      {:else}
        <div class="flex flex-row p-2"><div class="mx-auto">No appliances!</div></div>
      {/if}

      <AddAppliance {appliancesInfo} {totalConsumed} />
    </div>
  </form>

  <form method="post" action="?/signout" use:enhance={handleSignOut}>
    <div>
      <button class="btn block" disabled={loading}>Sign Out</button>
    </div>
  </form>
</div>
