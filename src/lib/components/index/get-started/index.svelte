<script lang="ts">
  import Toggle from "$lib/components/toggle.svelte";
  import Section from "../../section.svelte";
  import HostGitpodYourself from "./host-gitpod-yourself.svelte";
  import LaunchExampleWorkspace from "./launch-example-workspace.svelte";
  import LinkGitRepository from "./link-git-repository.svelte";
  import Card from "$lib/components/ui-library/card";

  let checked: boolean = false;

  const handleChange = () => {
    checked = !checked;
  };
</script>

<style lang="postcss">
  h2 {
    @apply mb-x-small;
  }

  .cards-container {
    @apply flex;

    @media (max-width: 1075px) {
      @apply flex-col mx-auto;
      max-width: 600px;
    }
  }
</style>

<Section id="get-started" class="pt-20">
  <h2 class="mb-small text-center text-h2">Get started now</h2>
  <Toggle
    labelLeft="SaaS"
    labelRight="Self-Hosted"
    on:change={handleChange}
    {checked}
    class="mb-x-small"
    id="saas-self-hosted"
  />
  <div
    class="cards-container gap-4"
    class:justify-center={checked}
    class:justify-between={!checked}
  >
    {#if checked}
      <Card
        class="shadow-normal p-xx-small sm:py-small basis-[50%] sm:px-x-small md:p-medium text-center"
        size="small"
      >
        <HostGitpodYourself />
      </Card>
    {:else}
      <Card
        class="shadow-normal p-xx-small sm:py-small basis-[50%] sm:px-x-small md:p-medium text-center"
        size="small"
      >
        <LinkGitRepository />
      </Card>
      <Card
        class="shadow-normal p-xx-small sm:py-small  basis-[50%] sm:px-x-small md:p-medium text-center"
        size="small"
      >
        <LaunchExampleWorkspace />
      </Card>
    {/if}
  </div>
</Section>
