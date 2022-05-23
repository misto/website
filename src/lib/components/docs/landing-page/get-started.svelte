<script lang="ts">
  import Card from "$lib/components/ui-library/card";
  import LinkButton from "$lib/components/ui-library/link-button";
  import { getStartedItems } from "$lib/contents/docs/landing-page/get-started";
</script>

<Card size="medium" background="white" class="flex items-center p-12 gap-12">
  <img
    src="/images/docs/book.png"
    class="hidden lg:block"
    width="136"
    height="140"
    alt="book"
  />
  <div class="min-w-0">
    <div class="text-[28px] text-important inline-block font-semibold">
      How would you like to get started with Gitpod?
    </div>
    <p>
      Learn how to spin up dev environments the way that suits you best –
      reading, watching or start directly with a template.
    </p>
    <div class="flex flex-wrap gap-4 justify-start md:justify-center">
      {#each getStartedItems as getStartedItem}
        <LinkButton sveltekit:prefetch href={getStartedItem.href} variant="cta"
          >{getStartedItem.label}</LinkButton
        >
      {/each}
    </div>
  </div>
</Card>
