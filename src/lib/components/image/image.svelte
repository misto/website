<script lang="ts">
  import Base from "./base.svelte";

  export let src: string;
  export let alt: string;

  let clazz = "";
  export { clazz as class };

  import IntersectionObserver from "./Intersection-observer.svelte";
</script>

<IntersectionObserver once={true} let:intersecting>
  {#if intersecting}
    <Base {alt} {src} class={clazz} />
  {/if}
</IntersectionObserver>
