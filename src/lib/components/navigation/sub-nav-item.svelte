<script lang="ts">
  export let navItem: { title: string; slug: string };
  export let active: boolean = false;
</script>

<style lang="postcss">
  .active {
    @apply border-current font-semibold text-secondary;
  }
</style>

<a
  class:active
  id={navItem.slug}
  class="block border-l pl-4 -ml-px border-transparent dark:hover:border-divider-light hover:border-light-black"
  href="#{navItem.slug}">{navItem.title}</a
>
