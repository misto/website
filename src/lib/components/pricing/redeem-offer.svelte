<script lang="ts">
  import LinkButton from "$lib/components/ui-library/link-button";
  import Card from "$lib/components/ui-library/card";
</script>

<style lang="postcss">
  li::marker {
    @apply text-primary;
  }
</style>

<Card
  background="white"
  class="pt-medium pb-xx-small sm:py-small text-center w-11/12 sm:w-auto max-w-[600px]"
  size="medium"
>
  <h2 class="h4 max-w-sm mx-auto px-xx-small">
    Enable the Student Plan by following these steps:
  </h2>
  <ol
    class="text-left list-decimal my-x-small pl-12 pr-xx-small sm:pl-20 sm:pr-small space-y-macro"
  >
    <li>
      <a href="https://gitpod.io/login">Log-in</a> with a free Gitpod account.
    </li>
    <li>
      Make sure that your educational email is your primary email address in
      your GitHub/GitLab/Bitbucket account.
    </li>
    <li>
      Go to the <a href="https://gitpod.io/plans">Plans page</a> and select the Student
      Unlimited Plan.
    </li>
    <li>
      If it doesn't appear, please contact us to register your educational email
      domain.
    </li>
  </ol>
  <LinkButton variant="primary" size="large" href="https://gitpod.io/plans"
    >Check Plans</LinkButton
  >
</Card>
