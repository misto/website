---
author: iqqbot, mustard-mh, loujaybee
# date: Monday, 11 July 2022 11:00:00 UTC
excerpt: For more secure and easier to use workspace access, you can now upload a public SSH key to Gitpod to access Gitpod workspaces using your own dedicated SSH key.
image: header.jpg
slug: ssh-key-upload
subtitle: For more secure and easier to use workspace access, you can now upload a public SSH key to Gitpod to access Gitpod workspaces using your own dedicated SSH key.
teaserImage: header.jpg
title: "Introducing workspace SSH support using your own private key(s)"
---

<script context="module">
  export const prerender = true;
</script>

SSH (secure shell) is a critical protocol for remote development.

Both [JetBrains](https://www.jetbrains.com/help/idea/remote-development-a.html) IDEs and the [VS Code](https://code.visualstudio.com/docs/remote/remote-overview) editor use SSH their remote development foundation. So, a big focus at Gitpod has been on improving performance and usability for connecting and using SSH.

Which is why today **we're excited to announce that in Gitpod you can now upload your own public keys to access your workspace.** In addition, we've also removed the requirement for a mandatory public key to be available when access Gitpod using SSH with an Access Token.

With SSH public key upload you can now:

1. Re-connect to workspaces without needing to go back to the Gitpod dashboard.
2. Benefit from improved security when accessing your workspace with a private key.

### Getting Started with SSH key access

1. Navigate to the [keys](https://gitpod.io/keys) page in your Gitpod preferences

![SSH page of the Gitpod dashboard](/images/docs/ssh-key-upload-dark-theme.png)
![SSH page of the Gitpod dashboard](/images/docs/ssh-key-upload-light-theme.png)

2. Upload a public SSH key (See: [SSH](https://www.gitpod.io/docs/configure/ssh) documentation)

![Adding an SSH Key to Gitpod](/images/docs/new-ssh-key-light-theme.png)
![Adding an SSH Key to Gitpod](/images/docs/new-ssh-key-dark-theme.png)

3. Go to your workspace list and copy the SSH command

![Copy SSH key from modal](/images/docs/ssh-key-modal-dark-light-theme.png)
![Copy SSH key from modal](/images/docs/ssh-key-modal-dark-theme.png)

Or, get the SSH connection from the workspace start page (when using a [Desktop IDE or editor](/docs/ides-and-editors))

![SSH to a workspace via the workspace splash page](/images/docs/ssh-connect-splash-dark-theme.png)
![SSH to a workspace via the workspace splash page](/images/docs/ssh-connect-splash-light-theme.png)

For more information, see the [configuring SSH](/docs/configure/ssh) documentation, and using Gitpod with [command-line](/docs/ides-and-editors/command-line) access. And for any feedback see the related [GitHub issue](https://github.com/gitpod-io/gitpod/issues/9932), or [raise a new one](https://github.com/gitpod-io/gitpod/issues/new/choose).

### What's next for SSH in Gitpod?

1. **Easier copying of SSH credentials** - We want to make it easier for you to access your SSH credentials, either through direct IDE or editor integration, or via the [gp CLI](/docs/command-line-interface).
2. **Integration with third-parties** - We're investigating integration with other 3rd party services which hold users public keys, such as [GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

We hope you enjoy the new, easier SSH access in Gitpod, and we'd love to hear your feedback in the [Gitpod community](https://www.gitpod.io/community).
