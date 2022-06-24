<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { tick } from "svelte";
  import { releases } from "$lib/contents/docs/releases";
  import topicsState from "./states/topics-state";
  export let version: string;

  async function versionChangeHandler() {
    await tick();
    const test = $page.url.pathname.split("/");
    test[3] = version;
    goto(test.join("/"));
  }
</script>

<style lang="postcss">
  select {
    background-position: right 1em top 50%, 0 0;
    background-image: url("/arrow-grey.svg");
    background-size: 1em auto, 100%;
    background-repeat: no-repeat, repeat;
    -moz-appearance: none;
    -webkit-appearance: none;
  }

  .switcher:not(.topics-active) {
    @apply hidden lg:block;
  }
</style>

<div class="w-full sm:px-4 switcher {$topicsState ? 'topics-active' : ''}">
  <select
    id="version-switch"
    class="box-border bg-card rounded-2xl text-important border-divider border px-4 py-2 appearance-none w-full mb-4"
    on:change={versionChangeHandler}
    bind:value={version}
  >
    <option disabled>Self-Hosted Version</option>
    {#each releases as release}
      <option value={release.name}>{release.name}</option>
    {/each}
  </select>
</div>
