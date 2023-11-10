<!-- src/routes/account/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import AddAppliance from '$lib/comps/AddAppliance.svelte';
  import UserAppliance from '$lib/comps/UserAppliance.svelte';
  import type {UserAppliance as UserApplianceType}   from '$lib/models/appliance.js';
  import type { SubmitFunction } from '@sveltejs/kit';
  export let data;
  export let form;

  let { session, supabase, profile, appliancesInfo } = data;
  $: ({ session, supabase, profile, appliancesInfo } = data);


  let profileForm: HTMLFormElement;
  let loading = false;
  let username: string = profile?.username ?? '';

  let totalConsumed: number = 0;
  $: totalConsumed = getTotalConsumption();

  // let allAppliances = profile?.appliances ?? []
  // $: allAppliances

  function getTotalConsumption(): number {
    let total = 0;
    if(profile?.appliances){
      total = profile.appliances.reduce((a: number,b:UserApplianceType) => a + (b.power * b.workingHours), 0)
    }
    return total;
  }

  let dataAllApp

  dataAllApp = function getAllAppliances() {
    return JSON.stringify(profile?.appliances)
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
      {#if profile?.appliances}
      {#key profile.appliances}
      <select hidden name="appliances">
        <option value={JSON.stringify(profile.appliances)}></option>
      </select>
        <p>You have {profile.appliances.length} appliances, consumming {totalConsumed}kWh/day</p>
        {#each profile.appliances as userAppliance}
          <UserAppliance {userAppliance} {totalConsumed} allAppliances={profile.appliances} />
        {/each}
        {/key}

      {:else}
        No appliances!
      {/if}

      <AddAppliance {appliancesInfo} />
    </div>
  </form>

  <form method="post" action="?/signout" use:enhance={handleSignOut}>
    <div>
      <button class="btn block" disabled={loading}>Sign Out</button>
    </div>
  </form>
</div>
