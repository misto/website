<script lang="ts">
  import { page } from "$app/stores";
  import { getMenuContext } from "$lib/contents/docs/menu";
  import docsSiebareStore from "$lib/stores/docs-sidebar";
  $: menuCtx = getMenuContext($page.url.pathname, $docsSiebareStore);
</script>

<div
  class="flex mx-4 justify-between pt-xx-small border-t border-solid border-divider"
>
  {#if menuCtx.prev}
    <a
      href={menuCtx.prev.path}
      title={`Previous: ${menuCtx.prev.title}`}
      class="font-thin"
    >
      Previous
    </a>
  {:else}
    <div />
  {/if}
  {#if menuCtx.next}
    <a
      href={menuCtx.next.path}
      title={`Next: ${menuCtx.next.title}`}
      class="font-thin"
    >
      Next
    </a>
  {:else}
    <div />
  {/if}
</div>
