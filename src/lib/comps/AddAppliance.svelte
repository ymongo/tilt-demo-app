<script lang="ts">
  import { enhance } from '$app/forms';
  import { ApplianceType, type ApplianceInfo } from '$lib/models/appliance';
  import type { SubmitFunction } from '@sveltejs/kit';

  export let appliancesInfo: ApplianceInfo[] = [];
  // export let totalConsumed: number

  let selectedAppliance: string | undefined;
  let addApplianceModal: any;
  let applianceForm: HTMLFormElement;
  let power = 0;
  let minWorkingHours = 0;
  let maxWorkingHours = 0;
  let workingHoursIncrement = 0;
  let workingHoursRange: number[] = [];
  let workingHours = 0;
  let dailyConsumtpion = 0;

  function updateApplianceValues(): void {
    let selectedApplianceObj = JSON.parse(selectedAppliance!);
    power = selectedApplianceObj.power;
    minWorkingHours = selectedApplianceObj.minWorkingHours;
    maxWorkingHours = selectedApplianceObj.maxWorkingHours;
    workingHoursIncrement = selectedApplianceObj.workingHoursIncrement;
    workingHours = minWorkingHours;
    workingHoursRange = [];
    for (let i = minWorkingHours + 1; i < maxWorkingHours; i += workingHoursIncrement) {
      workingHoursRange.push(i);
    }
    dailyConsumtpion = setConsumption();
  }

  function setConsumption(): number {
    return workingHours * power;
  }

  function closeResetModal(): void {
    selectedAppliance = undefined;
    applianceForm.reset();
    addApplianceModal.close();
  }

  const handleSubmit: SubmitFunction = () => {
    return async ({ update }) => {
      update();
      selectedAppliance = undefined;
      addApplianceModal.close();
    };
  };

  function isOverMAxConsumption(): boolean {
    let isOver = false;
    if (selectedAppliance) {
      const appliance = JSON.parse(selectedAppliance!) as ApplianceInfo;
      // isOver = appliance.power *appliance.workingHours + totalConsumed >10
    }
    return isOver;
  }
</script>

<!-- class="btn btn-primary text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" -->
<div class="flex flex-row p-2">
  <div class="mx-auto"><button
    class="btn btn-primary"
    type="button"
    on:click={() => {
      addApplianceModal.showModal();
    }}
  >
    Add Appliance
  </button></div>
</div>
<dialog id="add-appliance-modal" class="modal" bind:this={addApplianceModal}>
  <div class="modal-box">
    <button
      class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
      on:click={closeResetModal}>✕</button
    >

    <h3 class="font-bold text-lg">Add new appliance:</h3>
    <form
      method="POST"
      use:enhance={handleSubmit}
      action="?/addappliance"
      bind:this={applianceForm}
    >
      <div class="form-control w-full max-w-xs">
        <label class="label" for="appliance-name">
          <span class="label-text">What is your appliance name?</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
          name="appliance-name"
          required
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
          on:change={(e) => updateApplianceValues()}
          required
        >
          <option disabled selected value={undefined}>Pick your appliance type</option>
          {#each appliancesInfo as appliance}
            <option value={JSON.stringify(appliance)}
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
              readonly
              value={power}
            />
            <div class="flex px-4 join-item text-center bg-neutral-focus">
              <div class="my-auto">W</div>
            </div>
          </div>
        </div>

        <div class="form-control w-full max-w-xs">
          <label class="label" for="appliance-working-hours">
            <span class="label-text">What are your appliance working hours?</span>
          </label>
          <div class="join w-full max-w-xs mb-2">
            <input
              type="number"
              name="appliance-working-hours"
              class="input input-bordered w-full max-w-xs"
              readonly
              bind:value={workingHours}
            />
            <div class="flex px-4 join-item text-center bg-neutral-focus">
              <div class="my-auto">h</div>
            </div>
          </div>

          <input
            type="range"
            min={minWorkingHours}
            max={maxWorkingHours}
            class="range range-xs"
            step={workingHoursIncrement}
            name="appliance-working-hours-range"
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

      <div class="modal-action">
        <!-- <form method="post" action=?/addappliance> -->
        <button class="btn btn-primary mr-2" disabled={!selectedAppliance || isOverMAxConsumption()}
          >Add Appliance</button
        >
        <button type="button" class="btn" on:click={closeResetModal}>Cancel</button>
        <!-- </form> -->
      </div>
    </form>
  </div>
</dialog>
