<script lang="ts">
  import { showHideOverflowY } from "$lib/components/ui-library/utils/show-hide-overflow-y";

  import { createEventDispatcher } from "svelte";
  import { focusTrap } from "svelte-focus-trap";

  export let isOpen: boolean = false;

  $: {
    if (typeof document !== "undefined") {
      if (isOpen) {
        showHideOverflowY(true);
      } else {
        showHideOverflowY(false);
      }
    }
  }

  const dispatch = createEventDispatcher();

  let closeEl: HTMLButtonElement;
  let focusedEl: HTMLElement;

  $: if (isOpen) {
    if (typeof document !== "undefined")
      focusedEl = <HTMLElement>document.activeElement;
    closeEl && closeEl.focus();
  }

  const closeModal = () => {
    dispatch("close");
    focusedEl && focusedEl.focus();
    focusedEl = null;
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };
</script>

<style lang="postcss">
  .modal {
    background-color: rgba(0, 0, 0, 0.7);
  }
</style>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div
    class="modal fixed top-0 left-0 w-full h-screen z-50 flex justify-center items-center"
    on:click={closeModal}
    use:focusTrap
  >
    <div class="flex justify-center items-center relative">
      <button
        class="absolute right-6 top-6 z-10 h-10 w-10 md:h-5 md:w-5 flex items-center justify-center"
        bind:this={closeEl}
        aria-label="close this popup"
        on:click={closeModal}
      >
        <img alt="Close" role="presentation" src="/x.svg" class="h-3 w-3" />
      </button>
      <slot />
    </div>
  </div>
{/if}
