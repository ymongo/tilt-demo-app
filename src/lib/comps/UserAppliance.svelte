<script lang="ts">
  import type { UserAppliance } from '$lib/models/appliance';

  export let userAppliance: UserAppliance;
  export let totalConsumed: number;
  export let  allAppliances: UserAppliance[]

  let hiddenUpdate
  // $: allAppliances
  function computeEnergyConsumed(): number {
    return userAppliance.power && userAppliance.workingHours
      ? userAppliance.power * userAppliance.workingHours
      : 0;
  }
  function deleteAppliance() {
    
    const index = allAppliances.findIndex(a =>{ return a.id === userAppliance.id})
    console.log(index, allAppliances)
    allAppliances = allAppliances.splice(index, 1)
    hiddenUpdate.click()   
  }
</script>

<div class="m-4 card w-96 bg-base-100 shadow-xl">
  <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" on:click={deleteAppliance}>✕</button>
  <button type="submit" bind:this={hiddenUpdate}></button>

  <div class="card-body">
    <h2 class="card-title">{userAppliance.name}</h2>
    <p>Type: {userAppliance.type}</p>
    <p>Working hours: {userAppliance.workingHours}</p>
    <p>Power: {userAppliance.power}</p>
    <p>Energy consumed: {computeEnergyConsumed()}</p>
    <p>
      Relative consuption: {Math.round((computeEnergyConsumed() / totalConsumed) * 100)}% of total
      consumption
    </p>
  </div>
</div>
