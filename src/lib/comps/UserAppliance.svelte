<script lang="ts">
  import type { UserAppliance } from '$lib/models/appliance';

  export let userAppliance: UserAppliance;
  export let totalConsumed: number;
  function computeEnergyConsumed(): number {
    return userAppliance.power && userAppliance.workingHours ? userAppliance.power * userAppliance.workingHours : 0;
  }
</script>

<div class="card w-96 bg-base-100 shadow-xl">
  <!-- <figure><img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure> -->
  <div class="card-body">
    <h2 class="card-title">{userAppliance.label}</h2>

    <!-- <select class="select w-full max-w-xs">
      <option disabled selected>Pick your favorite Simpson</option>
      <option>Homer</option>
      <option>Marge</option>
      <option>Bart</option>
      <option>Lisa</option>
      <option>Maggie</option>
    </select> -->

    <p>Type: {userAppliance.type}</p>
    <p>Running hours</p>
    <label class="label" for="hours-range">
      <span class="label-text">Running hours</span>
    </label>
    <input type="range" min="0" max="100" value="25" class="range" step="25" name="hours-range" />
    <div class="w-full flex justify-between text-xs px-2">
      <span>|</span>
      <span>|</span>
      <span>|</span>
      <span>|</span>
      <span>|</span>
    </div>
    <p>Power: {userAppliance.power}</p>
    <p>Working hours</p>
    <p>Energy consumed: {computeEnergyConsumed()}</p>
    <p>Relative consuption: {(computeEnergyConsumed()/totalConsumed)/100}% of total consumption</p>

    <div class="card-actions justify-end">
      <button class="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
