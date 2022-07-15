<script lang="ts">
  import Chat from "./svgs/icons/chat.svelte";
  import File from "./svgs/icons/file.svelte";
  import Headphones from "./svgs/icons/headphones.svelte";
  import Play from "./svgs/icons/play.svelte";
  import LinkButton from "./ui-library/link-button/link-button.svelte";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import Close from "./svgs/icons/close.svelte";

  let areButtonsShown: boolean = false;
  let isToggleShown: boolean = false;
  let linksWrapper: HTMLElement;
  let iconWrapper: HTMLElement;
  let isButtonActive: boolean = false;

  const buttons: {
    text: string;
    href: string;
    icon: any;
  }[] = [
    {
      text: "Schedule a demo",
      href: "/contact/sales?get-a-demo",
      icon: Play,
    },
    {
      text: "Contact Sales",
      href: "/contact/sales",
      icon: Headphones,
    },
    {
      text: "Get support",
      href: "/contact/support",
      icon: Chat,
    },
    {
      text: "View documentation",
      href: "/docs",
      icon: File,
    },
  ];

  const handleClickOutside = (e: Event) => {
    if (e.target !== linksWrapper && e.target !== iconWrapper) {
      areButtonsShown = false;
    }
  };

  onMount(() => {
    window.addEventListener("click", handleClickOutside);
    const query = window.matchMedia("(max-width: 900px)");

    if (query.matches) {
      setTimeout(() => {
        isToggleShown = true;
      }, 5000);
    } else {
      setTimeout(() => {
        isToggleShown = true;

        setTimeout(() => {
          areButtonsShown = true;
        }, 500);
      }, 5000);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  });
</script>

<style lang="postcss">
  :global(body.consent-is-shown) .parent {
    @apply bottom-[105px] md:bottom-2;
  }

  .links {
    @apply relative;

    .before,
    .after {
      @apply absolute bottom-0 right-6 h-6 w-6;
    }

    .before {
      @apply bg-sand-dark dark:bg-card h-[1px] w-[31px] right-[20px];
    }

    .after {
      @apply -z-10;
      transform: translateY(47%) rotate(45deg);
    }
  }

  .icon-wrapper {
    &::before {
      content: "";
      @apply absolute rounded-full top-0 right-0 bottom-0 left-0 z-50;
    }
  }

  button.stroked {
    &:hover,
    &:focus {
      &::after {
        @apply bg-white;
      }
    }
  }

  :global(body.dark) button.stroked {
    &:hover,
    &:focus {
      &::after {
        @apply bg-black;
      }
    }
  }
</style>

<div
  class="fixed bottom-2 right-2 flex flex-col items-end z-50 parent"
  data-analytics={`{"context":"contact_widget"}`}
>
  {#if areButtonsShown}
    <div
      in:fade={{ duration: 600 }}
      out:fade={{ duration: 300 }}
      bind:this={linksWrapper}
      class="stroked stroked-sand flex flex-col rounded-2xl mb-5 sm:mb-xx-small links p-micro pt-x-small shadow-light
      "
    >
      <div data-analytics={`{"label":"Close Contact Widget"}`}>
        <button
          on:click={() => (areButtonsShown = false)}
          aria-label="Close the menu"
          class="absolute h-12 w-12 -top-1 -right-1 flex items-center justify-center rounded-full"
          on:mouseenter={() => {
            isButtonActive = true;
          }}
          on:mouseleave={() => {
            isButtonActive = false;
          }}
          on:focus={() => {
            isButtonActive = true;
          }}
          on:blur={() => {
            isButtonActive = false;
          }}
        >
          <Close class="h-[18px] w-[18px]" active={isButtonActive} />
        </button>
      </div>
      <div class="before" />
      <div class="space-y-macro max-w-[214px]">
        {#each buttons as { href, text, icon }}
          <LinkButton
            {href}
            variant="white"
            textAlign="left"
            class="inline-flex items-center group"
          >
            <svelte:component
              this={icon}
              class="h-4 w-4 mr-3 filter grayscale group-hover:grayscale-0 transition-all duration-200"
              slot="image"
            />
            {text}
          </LinkButton>
        {/each}
      </div>
      <div class="stroked stroked-sand after" />
    </div>
  {/if}

  {#if isToggleShown}
    <div data-analytics={`{"label":"Hide/Show Contact Widget"}`}>
      <button
        in:fade={{ duration: 200 }}
        class="stroked flex group justify-center items-center bg-card h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-normal"
        on:click={() => {
          areButtonsShown = !areButtonsShown;
        }}
      >
        <div class="icon-wrapper" bind:this={iconWrapper}>
          <svelte:component
            this={Chat}
            class="h-6 w-6 sm:h-8 sm:w-8 transition-all duration-200"
            id="toggle-button"
          />
        </div>
      </button>
    </div>
  {/if}
</div>
