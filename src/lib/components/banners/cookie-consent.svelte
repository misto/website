<script>
  import Banner from "./base.svelte";
</script>

<div data-analytics={`{"position":"cookie-consent"}`}>
  <Banner
    location="bottom"
    storageKey="cookie-consent"
    let:closeBanner
    class="border-t border-divider border-solid"
  >
    <p class="w-7/12 md:w-9/12">
      This website uses cookies to enhance the user experience. Read our <a
        href="/privacy">privacy policy</a
      > for more info.
    </p>
    <button
      on:click={closeBanner}
      class="px-3 py-1 bg-card dark:bg-bg rounded-lg md:px-6 hover:bg-white hover:dark:bg-black"
      >Accept Cookies</button
    >
  </Banner>
</div>
