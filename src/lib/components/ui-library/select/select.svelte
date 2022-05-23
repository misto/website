<script lang="ts">
  let className: string = "";

  export { className as class };
  export let options: string[];
  export let value: string;
  export let placeholder: string = "";
  export let hasError: boolean = false;
  export let label: string = "";
  export let element: HTMLElement = null;
  export let name: string;
</script>

<style lang="postcss">
  select {
    background-position: right 1em top 50%, 0 0;
    background-image: url("/arrow-grey.svg");
    background-size: 1.25em auto, 100%;
    background-repeat: no-repeat, repeat;
    -moz-appearance: none;
    -webkit-appearance: none;
  }

  .error {
    @apply text-error border-error;
  }
</style>

{#if label}
  <label class:error={hasError} class="text-body block mb-2" for={label}
    >{@html label}</label
  >
{/if}
<select
  class:error={hasError}
  bind:this={element}
  id={label}
  class="box-border bg-card text-important border-divider border-[1px] px-4 py-2 rounded-lg appearance-none  w-full {className}"
  {name}
  aria-label={name}
  bind:value
  on:change
  {...$$restProps}
>
  <option disabled class="text-body" value="">{placeholder}</option>
  {#each options as option}
    <option value={option}>
      {option}
    </option>
  {/each}
</select>

{#if hasError}
  <legend class:error={hasError} class="block text-body text-xs mt-1 mb-2"
    >Please select a value</legend
  >
{/if}
