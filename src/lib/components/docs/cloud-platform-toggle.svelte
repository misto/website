<script lang="ts">
  import Toggle from "../toggle.svelte";
  import Card from "../ui-library/card";

  export let id = "cloud-platform-toggle";

  export let checked = false;
  const handleChange = () => {
    checked = !checked;
  };

  export let open = false;
</script>

<details open={open || null}>
  <summary class="text-p-medium">Cloud provider specific instructions</summary>

  <Toggle
    labelLeft="Google Cloud Platform (GCP)"
    labelRight="Amazon Web Services (AWS)"
    on:change={handleChange}
    {checked}
    class="mb-x-small"
    {id}
  />

  {#if checked}
    <Card
      class="shadow-normal p-xx-small sm:py-small basis-[50%] sm:px-x-small md:p-medium"
      size="small"
    >
      <slot name="aws" />
    </Card>
  {:else}
    <Card
      class="shadow-normal p-xx-small sm:py-small basis-[50%] sm:px-x-small md:p-medium"
      size="small"
    >
      <slot name="gcp" />
    </Card>
  {/if}
</details>
