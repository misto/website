---
section: ides-and-editors
title: VS Code Settings Sync
---

<script context="module">
  export const prerender = true;
</script>

# {title}

VS Code is so beloved hugely because of its endless possibilities for customization. A problem arises when there are multiple machines or VS Code instances you'd like to have with the same extensions, themes and settings.

[Settings Sync](https://code.visualstudio.com/docs/editor/settings-sync) allows you to share VS Code settings and extensions between Gitpod and other instances of VS Code. Each start of [Gitpod workspace](https://www.gitpod.io/docs/workspaces) is its own instance of VS Code.

## How does it work?

Once enabled, Settings Sync polls the backend for changes on an interval and at the same time makes sure that after any change to your preferences, these changes are pushed back. After the initial (first) sync, only the changed items are pushed to the backend server to save bandwidth and make the synchronization nearly instant.

The following items are synced when you use Settings Sync:

- Settings - your VS Code preferences [[docs](https://code.visualstudio.com/docs/getstarted/settings)]
- Keybindings - your keyboard shortcuts [[docs](https://code.visualstudio.com/docs/getstarted/keybindings)]
- Snippets - [[docs](https://code.visualstudio.com/docs/editor/userdefinedsnippets)]
- Tasks [[docs](https://code.visualstudio.com/Docs/editor/tasks#_user-level-tasks)]
- Extensions - your installed extensions
- Global State - used by extensions to preserve state

### About synced extensions

By default, every extension you install on Gitpod or, if set up, on your local VS Code instance gets synced. This comes with a few exceptions, though.

Extensions don't get synced if:

- when installing, instead of clicking on `Install` you open the dropdown and select `Install (Do Not Sync)`
- they are defined in a configuration file like [`gitpod.yml`](https://www.gitpod.io/docs/config-gitpod-file/) or [`devcontainer.json`](https://code.visualstudio.com/docs/remote/devcontainerjson-reference)
- they are installed manually from a `vsix` file

## On the web

### On Gitpod

If you are using Gitpod with VS Code Web, Settings Sync should already work out of the box with no additional configuration needed. You can verify this by opening the Account menu in VS Code and checking that the last line says `Settings Sync is On`.

### On Codespaces, vscode.dev and others

We don't have support for these environments, yet, but are actively looking into it.

## Locally

By default, your local VS Code installation is _most likely_ equipped with a pre-configured setup to sync all of your IDE-related settings via a GitHub or a Microsoft account. This means that your preferences are synced to Microsoft's servers and that means Gitpod has no access to them.

You can change this fact and sync all of your preferences to Gitpod instead. You will not lose any data by doing this, but if you still want to sync your settings across machines we recommend you to do the same on all of them as well.

1. Make sure the [Gitpod extension](https://marketplace.visualstudio.com/items?itemName=gitpod.gitpod-desktop) is installed and enabled.
2. Hit <kbd>F1</kbd> to open the Command Palette and run `Settings Sync: Enable signing in with Gitpod`.
3. Complete the login process by clicking on the `Accounts` menu and selecting `Turn on Settings Sync...`. This will open Gitpod where you can just follow the steps to allow Settings sync from your local VS Code.
4. Yay, it's done 🎉! Extensions and other preferences should start syncing right away. For troubleshooting you can take a look at `OUTPUT` > `Log (Settings Sync)`.

If you want to read more about Settings Sync and how it works please refer to [VS Code's Settings Sync documentation](https://code.visualstudio.com/docs/editor/settings-sync).
