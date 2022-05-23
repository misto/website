<script context="module">
  export const prerender = true;
</script>

<script>
  import OpenGraph from "$lib/components/open-graph.svelte";
  import { contactActions } from "$lib/contents/contact";
  import Header from "$lib/components/header.svelte";
  import CardSmall from "$lib/components/card/card-small.svelte";
</script>

<style lang="postcss">
  div {
    grid-template-columns: repeat(auto-fill, 320px);

    @media (max-width: 1465px) {
      grid-template-columns: repeat(auto-fill, 314px);
    }

    @media (max-width: 1380px) {
      @apply max-w-4xl mx-auto;
    }

    @media (max-width: 400px) {
      grid-template-columns: none;
    }
  }
</style>

<OpenGraph
  data={{
    title: "Contact",
    description:
      "Get product or account support, talk to a member of our sales team, ask our community or view the documentation.",
  }}
/>

<Header
  title="How can we help you?"
  text="Get in touch and let us know how we can help."
  tight={true}
  fullWidth={true}
>
  <div
    slot="content"
    class="grid gap-micro justify-center mt-small sm:mb-xx-large"
  >
    {#each contactActions as action}
      <CardSmall card={action} btnSize="normal" titleClassNames="h4" />
    {/each}
  </div>
</Header>
