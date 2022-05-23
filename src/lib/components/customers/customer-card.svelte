<script lang="ts">
  import Card from "$lib/components/ui-library/card";
  export let card: {
    image: string;
    details: {
      industry: string;
      plan: string;
      people: {
        title: string;
        text: string;
      };
      website: {
        href: string;
        text: string;
      };
    };
  };

  const { image, details } = card;
</script>

<style lang="postcss">
  .text > div {
    width: 136px;
  }

  .h5 {
    @apply text-important font-bold mb-macro;
  }
</style>

<Card size="small" class=" overflow-hidden max-w-xs sm:max-w-sm min-w-fit">
  <div
    class="h-60 bg-cover bg-center "
    style="background-image: url({image})"
  />
  <div
    class="text grid grid-cols-2 gap-y-xx-small gap-x-micro sm:gap-y-small p-xx-small sm:p-x-small"
  >
    <div>
      <p class="h5">Industry</p>
      <p>{details.industry}</p>
    </div>
    <div>
      <p class="h5">Plan & Delivery</p>
      <p>{details.plan}</p>
    </div>
    <div>
      <p class="h5">{details.people.title}</p>
      <p>{details.people.text}</p>
    </div>
    <div>
      <p class="h5">Website</p>
      <p>
        <a href={details.website.href} target="_blank">
          {details.website.text}
        </a>
      </p>
    </div>
  </div>
</Card>
