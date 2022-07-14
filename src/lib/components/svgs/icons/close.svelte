<script lang="ts">
  export let active: boolean = false;
</script>

<style lang="postcss">
  path {
    @apply transition-all duration-200;
  }
</style>

<svg
  viewBox="0 0 25 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  {...$$props}
>
  <path
    d="M0.689819 12.0002C0.689819 5.37283 6.0624 0.000244141 12.6898 0.000244141C19.3172 0.000244141 24.6898 5.37283 24.6898 12.0002C24.6898 18.6277 19.3172 24.0002 12.6898 24.0002C6.0624 24.0002 0.689819 18.6277 0.689819 12.0002Z"
    class={active ? "fill-card dark:fill-sand-dark" : "fill-bg dark:fill-sub"}
  />
  <path
    d="M9.18982 8.00024L17.1898 16.0002"
    class="stroke-sub dark:stroke-card"
    stroke-width="2"
    stroke-linecap="round"
  />
  <path
    d="M17.1898 8.00024L9.18982 16.0002"
    class="stroke-sub dark:stroke-card"
    stroke-width="2"
    stroke-linecap="round"
  />
</svg>
