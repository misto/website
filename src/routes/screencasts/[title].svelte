<script lang="ts" context="module">
  import { screencasts } from "$lib/contents/screencasts";

  export const prerender = true;
  export const load = async function ({ params }) {
    const { title } = params;
    const screencast = screencasts.find(
      (s) => stringToBeautifiedFragment(s.title.slice(0, -3)) === title
    );
    return { props: { screencast } };
  };
</script>

<script lang="ts">
  import type { Screencast as ScreencastType } from "$lib/types/screencasts.type";
  import YouTubeEmbed from "$lib/components/youtube-embed.svelte";
  import { stringToBeautifiedFragment } from "$lib/utils/helpers";
  import OpenGraph from "$lib/components/open-graph.svelte";
  import Duration from "$lib/components/screencasts/duration.svelte";
  import CalloutSecondary from "$lib/components/callout-secondary.svelte";
  import Explore from "$lib/components/explore.svelte";
  import SectionCommon from "$lib/components/section-common.svelte";
  import ScreencastsGrid from "$lib/components/screencasts/screencasts-grid.svelte";
  import LinkButton from "$lib/components/ui-library/link-button";
  import { beforeUpdate, onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import Header from "$lib/components/header.svelte";

  export let screencast: ScreencastType;

  let nextScreencasts = screencasts.slice(screencasts.indexOf(screencast) + 1);

  beforeUpdate(() => {
    nextScreencasts = screencasts.slice(screencasts.indexOf(screencast) + 1);
  });

  let isAMobileDevice = false;

  onMount(() => {
    let query = window.matchMedia("(max-width: 768px)");
    const handler = () => {
      if (query.matches) {
        isAMobileDevice = true;
      } else {
        isAMobileDevice = false;
      }
    };
    query.addEventListener("change", handler);

    return () => {
      query.removeEventListener("change", handler);
    };
  });

  afterNavigate(() => {
    window.scrollTo(0, 0);
  });
</script>

<OpenGraph
  data={{
    description: screencast.description,
    title: screencast.title,
  }}
/>

<Header title={screencast.title} text={screencast.description} tight={true} />

<YouTubeEmbed embedId={screencast.youtubeId} title={screencast.title} />

<div class="max-w-lg mx-auto mt-24">
  <Duration duration={screencast.duration} />
  <p class="h5 text-important font-bold mt-macro mb-xx-small">
    {screencast.description}
  </p>
  {#if screencast.relatedDocs}
    <p class="mt-xx-small mb-x-small">
      Related docs:
      {#each screencast.relatedDocs as relatedDoc, i}
        <a href={relatedDoc.path}>{relatedDoc.title}</a>
        {screencast.relatedDocs.length > 0 &&
        screencast.relatedDocs[i + 1] &&
        !screencast.relatedDocs[i + 2]
          ? " and "
          : screencast.relatedDocs.length > 0 && screencast.relatedDocs[i + 1]
          ? ", "
          : ""}
      {/each}
    </p>
  {/if}
  {#if screencast.nextScreencast}
    <div class="text-center">
      <LinkButton
        variant="primary"
        size="large"
        href="/screencasts/{stringToBeautifiedFragment(
          screencasts[screencast.nextScreencast].title.slice(0, -3)
        )}">View next screencast</LinkButton
      >
    </div>
  {/if}
</div>

{#if nextScreencasts.length}
  <SectionCommon title="Next up...">
    <ScreencastsGrid
      screencasts={nextScreencasts.slice(0, isAMobileDevice ? 3 : 6)}
      slot="content"
    />
  </SectionCommon>
{/if}

<CalloutSecondary
  title="View full screencast playlist"
  text="Have a look at our full playlist to learn even more about specific topics."
  link={{
    href: "/screencasts",
    text: "View all screencasts",
  }}
/>

<Explore />
