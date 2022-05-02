---
section: ides-and-editors
title: Command Line (e.g. Vim)
---

<script context="module">
  export const prerender = true;
</script>

# {title}

You can currently copy/paste a simple SSH command to get command line access to your workspace from the Gitpod dashboard.

1. Visit [your workspace list](https://gitpod.io/workspaces) in Gitpod
2. View a running Gitpod workspace and click the more actions menu
3. Select "connect via SSH"
4. Copy paste the selected command

<figure>
    <img src="/images/docs/ssh-copy-paste-dashboard.gif" alt="Copy pasting the SSH command from the dashboard">
    <figcaption>Copy pasting the SSH command from the dashboard</figcaption>
</figure>

You can also copy/paste your SSH access from the workspace start page, which is shown to users who have selected a desktop IDE or editor as their [preference](https://gitpod.io/preferences).

<figure>
    <img src="/images/docs/ssh-copy-paste-workspace-start.gif" alt="Copy pasting the SSH command from the workspace start page">
    <figcaption>Copy pasting the SSH command from the workspace start page</figcaption>
</figure>

You will need an existing private key on your machine for the access to work. If needed, you can generate one using [ssh-keygen](https://en.wikipedia.org/wiki/Ssh-keygen).

**Note:** Whilst it is possible to access your Gitpod workspaces via the command line using [local companion](/docs/ides-and-editors/local-companion). As the local companion is still in beta the above method is the current preferred approach.
