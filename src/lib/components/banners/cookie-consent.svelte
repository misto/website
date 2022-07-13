<script lang="ts">
  import Cookies from "js-cookie";
  import { cookies } from "$lib/constants";

  import CookieSettings from "../cookie-settings.svelte";
  import Modal from "../ui-library/modal/modal.svelte";
  import Banner from "./base.svelte";

  let isModalOpen: boolean = false;

  const handleClose = () => (isModalOpen = false);
</script>

<div data-analytics={`{"position":"cookie-consent"}`}>
  <Banner
    location="bottom"
    storageKey="cookie-consent-bar"
    let:closeBanner
    class="border-t border-divider border-solid flex flex-col space-y-micro lg:space-y-0 lg:flex-row"
  >
    <p
      class="text-xs sm:text-sm lgx:text-lg text-center lg:text-left md:mr-micro"
    >
      This website uses cookies to enhance the user experience. Read our <a
        href="/privacy">privacy policy</a
      > for more info.
    </p>

    <div class="flex items-center space-x-micro">
      <button
        class="underline"
        on:click={() => {
          isModalOpen = true;
          closeBanner();
        }}
      >
        Cookie settings
      </button>
      <button
        on:click={() => {
          Cookies.set(cookies.ANALYTICAL, "true", { expires: 365 });
          Cookies.set(cookies.TARGETING, "true", { expires: 365 });
          closeBanner();
        }}
        class="px-3 py-1 bg-card dark:bg-bg rounded-lg md:px-6 hover:bg-white hover:dark:bg-black"
      >
        Accept Cookies
      </button>
      <button
        on:click={closeBanner}
        class="px-3 py-1 bg-card dark:bg-bg rounded-lg md:px-6 hover:bg-white hover:dark:bg-black"
      >
        Reject all
      </button>
    </div>
  </Banner>
</div>

<Modal on:close={handleClose} isOpen={isModalOpen}>
  <CookieSettings {handleClose} />
</Modal>
