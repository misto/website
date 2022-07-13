<script lang="ts">
  import Section from "../section.svelte";
  import LinkButton from "$lib/components/ui-library/link-button";

  const imgSrc = "/images/media-kit/founders.jpg";
</script>

<Section class="text-center">
  <h2 class="mb-small">The founders</h2>
  <div
    class="shadow-normal stroked rounded-4xl bg-card p-small sm:p-x-large mb-small sm:mb-x-large"
  >
    <img src={imgSrc} alt="Gitpod founders group" class="rounded-4xl mx-auto" />
    <p class="py-xx-small">Download founders group picture</p>
    <LinkButton variant="cta" size="large" href={imgSrc} download="founders"
      >PNG</LinkButton
    >
  </div>
  <p class="text-large">
    Please <a href="/contact/support">contact us</a> for any intended use not covered
    by these guidelines.
  </p>
</Section>
