---
section: ides-and-editors
title: Configure your IDE/editor
---

<script context="module">
  export const prerender = true;
</script>

# {title}

Customise the IDE or editor experience for a project, or yourself.

## Per Project

Updating per-project settings are shared with anyone who starts a new gitpod workspace.

- Update the projects [.gitpod.yml](/docs/config-gitpod-file) file to install [VS Code extensions](/docs/references/gitpod-yml#vscode), or [JetBrains plugins](/docs/references/gitpod-yml#jetbrains).
- Update the projects [start tasks](/docs/config-start-tasks) in `.gitpod.yml`
- Add a custom [base image](/docs/config-docker) to your project

## Per User

Updating per-user settings are shared only with the current user of a gitpod workspace.

To configure a specific IDE or editor as a default user preference for all new workspaces, you will need to update your [user preferences](https://gitpod.io/preferences). There is currently no way to configure Gitpod to open different editors or IDEs for different projects. IDE and editor preferences only take effect for new or restarted workspaces. Changing your editor or IDE preference will not affect running workspaces.

Set up additional per-user configurations using [dotfiles](/docs/config-dotfiles).

## Per Team

There are currently no ways to configure IDE/editor's on a per-team basis.
