<script>
  export let username;
  export let socialMediaImgClasses;
</script>

<!-- We use the GitHub profile image because the Twitter profile image needs an authenticated API call -->
<img
  src="https://github.com/{username}.png"
  alt="Avatar of {username}"
  title="Avatar of {username}"
  height="28"
  width="28"
  class="inline rounded-full border border-solid border-card {socialMediaImgClasses}"
/>
