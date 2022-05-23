<script lang="ts">
  import type { Type } from "./input";

  export let value: string | number;
  export let name: string = "";
  export let label: string = "";
  export let element: HTMLElement = null;
  export let hasError: boolean = false;
  let className: string = "";
  export { className as class };
  export let type: Type = "text";
  export let id: string;
</script>

<style lang="postcss">
  .error {
    @apply text-error border-error;
  }
</style>

{#if label}
  <label
    class="text-body cursor-pointer block mb-2"
    class:error={hasError}
    for={id}>{@html label}</label
  >
{/if}
{#if type === "text"}
  <input
    {id}
    class:error={hasError}
    on:change
    bind:value
    bind:this={element}
    class="bg-card text-important box-border w-full rounded-lg py-2 px-4 border-[1px] border-divider {className}"
    type="text"
    {...$$restProps}
  />
{:else if type === "email"}
  <input
    {id}
    class:error={hasError}
    on:change
    bind:value
    bind:this={element}
    class="bg-card text-important box-border w-full rounded-lg py-2 px-4 border-[1px] border-divider placeholder:text-body {className}"
    type="email"
    {...$$restProps}
  />{/if}
{#if hasError}
  <legend class:error={hasError} class="text-xs block mt-1 mb-2">
    Please fill out the {name ? name : ""} field
  </legend>
{/if}
