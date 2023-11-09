<script lang="ts">
  import { ApplianceType, type ApplianceInfo } from '$lib/models/appliance';

  export let appliancesInfo: ApplianceInfo[] = [];
  let selectedAppliance: ApplianceInfo|undefined;
  let addApplianceModal: any;


  let power = 0;
  let minWorkingHours = 0;
  let maxWorkingHours = 0;
  let workingHoursIncrement = 0;
  let workingHoursRange: number[] = [];
  let workingHours = 0;
  let dailyConsumtpion = 0;

  function updateApplianceValues() {
    selectedAppliance = selectedAppliance!
    power = selectedAppliance.power;
    minWorkingHours = selectedAppliance.minWorkingHours;
    maxWorkingHours = selectedAppliance.maxWorkingHours;
    workingHoursIncrement = selectedAppliance.workingHoursIncrement;
    workingHours = minWorkingHours;
    workingHoursRange = [];
    for (let i = minWorkingHours + 1; i < maxWorkingHours; i += workingHoursIncrement) {
      workingHoursRange.push(i);
    }
    dailyConsumtpion = setConsumption();
  }

  function setConsumption() {
    return workingHours * power;
  }
</script>

<button
  class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  type="button"
  on:click={() => {
    addApplianceModal.showModal();
  }}
>
  Add Appliances
</button>
  <dialog id="add-appliance-modal" class="modal" bind:this={addApplianceModal}>
    <div class="modal-box">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        on:click={() => {
          addApplianceModal.close()}}>✕</button
      >

      <h3 class="font-bold text-lg">Add new appliance:</h3>
          <form>

      <div class="form-control w-full max-w-xs">
        <label class="label" for="appliance-name">
          <span class="label-text">What is your appliance name?</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
          name="appliance-name"
        />
      </div>

      <div class="form-control w-full max-w-xs">
        <label class="label" for="appliance-type">
          <span class="label-text">What is your appliance type?</span>
        </label>
        <select
          bind:value={selectedAppliance}
          class="select w-full max-w-xs"
          name="appliance-type"
          on:change={() => updateApplianceValues()}
        >
          <option disabled selected value={undefined}>Pick your appliance type</option>
          {#each appliancesInfo as appliance}
            <option value={appliance}
              >{Object.values(ApplianceType)[
                Object.keys(ApplianceType).indexOf(appliance.type)
              ]}</option
            >
          {/each}
        </select>
      </div>

      {#if selectedAppliance}
        <div class="form-control w-full max-w-xs">
          <label class="label" for="appliance-power">
            <span class="label-text">Your appliance power:</span>
          </label>
          <div class="join w-full max-w-xs">
            <input
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full max-w-xs"
              name="appliance-power"
              disabled
              value={power}
            />
            <div class="flex px-4 join-item text-center bg-neutral-focus">
              <div class="my-auto">W</div>
            </div>
          </div>
        </div>

        <div class="form-control w-full max-w-xs">
          <label class="label" for="appliance-working-hours">
            <span class="label-text">What are your appliance working hours? {workingHours}</span>
          </label>
          <input
            type="range"
            min={minWorkingHours}
            max={maxWorkingHours}
            class="range range-xs"
            step={workingHoursIncrement}
            name="appliance-working-hours"
            bind:value={workingHours}
            on:change={() => {
              dailyConsumtpion = setConsumption();
            }}
          />
          <div class="w-full flex justify-between text-xs px-2">
            <span>{minWorkingHours}</span>
            {#each workingHoursRange as interHours}
              <span>|</span>
            {/each}
            <span>{maxWorkingHours}</span>
          </div>
        </div>

        <div class="form-control w-full max-w-xs">
          <label class="label" for="appliance-daily-consumption">
            <span class="label-text">Your appliance daily consumption is:</span>
          </label>
          <div class="join w-full max-w-xs">
            <input
              type="number"
              name="appliance-daily-consumption"
              class="input input-bordered w-full max-w-xs"
              disabled
              bind:value={dailyConsumtpion}
            />
            <div class="flex px-4 join-item text-center bg-neutral-focus">
              <div class="my-auto">Wh/day</div>
            </div>
          </div>
        </div>
      {/if}
    </form>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-primary mr-2">Add Appliance</button>
          <button class="btn" on:click={()=>{selectedAppliance=undefined}}>Cancel</button>
        </form>
      </div>
    </div>
  </dialog>
