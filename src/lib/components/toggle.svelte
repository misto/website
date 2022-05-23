<script lang="ts">
  let clazz = "";
  export { clazz as class };

  export let labelLeft: string;
  export let labelRight: string;
  export let isInversed: boolean = false;
  export let checked: boolean;
  export let id: string;
</script>

<style lang="postcss">
  .switch-container {
    &,
    &::before,
    &::after {
      @apply transition-all duration-200;
    }
  }

  label {
    @apply mb-0 cursor-pointer text-h6 font-bold py-1.5 h-10 px-xx-small rounded-5xl transition-all duration-300 hover:text-important focus:text-important;
  }

  label:first-of-type {
    @apply bg-tertiary;
  }

  .checked label {
    &:first-of-type {
      @apply bg-card;
    }

    &:last-of-type {
      @apply bg-tertiary text-important;
    }
  }

  .inversed label {
    &:first-of-type {
      @apply bg-card;
    }

    &:last-of-type {
      @apply bg-tertiary text-important;
    }
  }

  .inversed.checked label {
    &:first-of-type {
      @apply bg-tertiary text-important;
    }

    &:last-of-type {
      @apply bg-card;
    }
  }

  :global(body.dark) .switch-container {
    @apply bg-card;

    label:first-of-type {
      @apply bg-primary text-black;
    }

    &.checked label {
      &:first-of-type {
        @apply bg-transparent text-body;
      }

      &:last-of-type {
        @apply bg-primary text-black;
      }
    }

    &.inversed {
      label:first-of-type {
        @apply bg-transparent text-body;

        &:hover,
        &:focus {
          @apply text-important;
        }
      }

      label:last-of-type {
        @apply bg-primary text-black;
      }

      &.checked {
        label:first-of-type {
          @apply bg-primary text-black;
        }

        label:last-of-type {
          @apply bg-transparent text-body;
        }
      }
    }
  }
</style>

<div class="text-center">
  <div
    class="switch-container stroked inline-flex justify-center items-center space-x-0.5 {clazz} mx-auto bg-card py-1 px-1 rounded-5xl transition-all duration-200"
    class:checked
    class:inversed={isInversed}
  >
    <label for={id} class:text-important={!checked && !isInversed}>
      {labelLeft}
    </label>
    <div class="relative flex items-center cursor-pointer">
      <input
        {id}
        type="checkbox"
        on:change
        class="h-full w-full toggle"
        data-analytics={`{"label":"` +
          labelLeft +
          ` <> ` +
          labelRight +
          ` Toggle"}`}
      />
    </div>
    <label for={id}>
      {labelRight}
    </label>
  </div>
</div>
