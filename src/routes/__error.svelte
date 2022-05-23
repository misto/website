<script context="module">
  export const prerender = true;

  export function load({ error, status }) {
    return {
      props: { error, status },
    };
  }
</script>

<script lang="ts">
  import { dev } from "$app/env";
  import OpenGraph from "$lib/components/open-graph.svelte";
  import Section from "$lib/components/section.svelte";
  import LinkButton from "$lib/components/ui-library/link-button";

  export let status: number;
  export let error: Error;
</script>

<OpenGraph
  data={{
    description: "404 Oh, no! Something went wrong on our side.",
    title: "Page Not Found",
  }}
/>

<div class="text-center">
  <Section>
    <img
      src="/images/illustration-large.png"
      alt="The Gitpod cube set up as a remote workspace"
      class="mx-auto mb-8 w-96 grayscale-[60%]"
    />
    <h1>{status}</h1>
    <p class="mb-8">Oh, no! Something went wrong on our side.</p>

    {#if dev}
      <p>{error.message}</p>
    {/if}

    <p class="mb-8">
      <a href="/contact/support">Contact Us</a>
      —
      <a href="https://status.gitpod.io/">Gitpod Status</a>
      —
      <a href="https://twitter.com/gitpod">@gitpod</a>
    </p>
    <p class="mb-8">
      <LinkButton variant="cta" size="medium" href="/">Go Home</LinkButton>
    </p>
  </Section>
</div>

{#if dev && error.stack}
  <article
    class="p-xx-small sm:py-small sm:px-x-small md:p-medium rounded-2xl bg-card"
  >
    <pre>{error.stack}</pre>
  </article>
{/if}
