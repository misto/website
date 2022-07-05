<script lang="ts">
  import { onMount } from "svelte";

  let githubStarsEl: HTMLAnchorElement;

  onMount(async () => {
    const githubButtons = await import("github-buttons");
    githubButtons.render(githubStarsEl, (el) => {
      githubStarsEl.parentNode.replaceChild(el, githubStarsEl);
    });
  });
</script>

<style lang="postcss">
  :global(body.dark) .stars {
    filter: invert(90%);
  }
</style>

<div class="stars h-7">
  <a
    bind:this={githubStarsEl}
    class="github-button"
    href="https://github.com/gitpod-io/gitpod"
    data-icon="octicon-star"
    data-size="large"
    data-show-count="true"
    aria-label="Star the Gitpod Repo on GitHub">Star</a
  >
</div>
