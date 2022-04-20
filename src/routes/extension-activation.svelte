<script context="module">
  export const prerender = true;
</script>

<script lang="ts">
  import Feature from "$lib/components/feature.svelte";
  import { feature } from "$lib/contents/extension-activation";
  import Config from "$lib/components/extension-activation/config.svelte";
  import OpenGraph from "$lib/components/open-graph.svelte";
  import Header from "$lib/components/header.svelte";
  import Card from "$lib/components/card/card.svelte";

  const currentBrowser = ["Opera", "Chrome", "Firefox", "IE"].find(
    (browser) =>
      typeof window !== "undefined" &&
      window.navigator.userAgent.includes(browser)
  );

  const cards = [
    {
      icon: "/images/extension-activation/prebuild.svg",
      title: "Skip the Waiting",
      description:
        "Gitpod continuously builds your git branches like a CI server. This means no more waiting for dependencies to be downloaded and builds to finish.",
    },
    {
      icon: "/images/extension-activation/collaborate.svg",
      title: "Code Together",
      description:
        "Do code reviews within Gitpod, work together in one workspace in real-time and share reproducible workspaces with your team.",
    },
    {
      icon: "/images/extension-activation/fresh.svg",
      title: "Work Remotely",
      description:
        "You no longer need an over-powered laptop, Gitpod works just as smoothly on a Chromebook or iPad. All you need is a browser.",
    },
  ];
</script>

<OpenGraph
  data={{
    description:
      "The Gitpod browser extension has been successfully installed.",
    title: "Extension Activation",
    norobots: true,
  }}
/>

<Header
  title="Gitpod for {currentBrowser} is Now Active"
  text="The browser extension has been installed."
/>

<Feature {feature} />

<Config />

<section
  class="flex items-center justify-center lg:items-stretch flex-col lg:flex-row sm:pb-huge space-y-small lg:space-y-0 lg:space-x-xx-small"
>
  {#each cards as { title, description, icon }}
    <Card
      card={{
        title: title,
        text: description,
        icon: {
          src: icon,
          alt: "",
          transform: "scale(1.5)",
        },
      }}
    />
  {/each}
</section>
