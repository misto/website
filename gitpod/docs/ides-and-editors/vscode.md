---
section: ides-and-editors
title: VS Code Desktop
---

<script context="module">
  export const prerender = true;
</script>

# {title}

> VS Code Desktop is currently in [Beta](/docs/references/gitpod-releases) · [Send feedback](https://github.com/gitpod-io/gitpod/issues/5712).

`youtube: kI6firDA0Bw`

With VS Code Desktop Support, you can keep your local IDE configurations<sup>1</sup> **and** benefit from Gitpod's high-spec servers & automated prebuilds. As you would expect, your code executes in an ephemeral Gitpod workspace which keeps each of your projects nicely isolated from one another.

To get started:

1. Start a new Gitpod workspace ([learn how](/docs/getting-started) in the docs).
1. Open the command palette (⇧⌘P or Ctrl+Shift+P)
1. Type "Open in VS Code" and hit Enter.

This command will open your local VS Code, connect to the Gitpod workspace and let you develop, test & debug your application as if the code was running locally.

<sup>1</sup> Yes this also means you get to keep your keyboard shortcuts just the way you prefer them. You know, Ctrl/Cmd + W to close an editor tab 😉.

## VS Code Desktop SSH access

VS Code Desktop connects to a Gitpod workspace via SSH, using the official Microsoft [Remote - SSH extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh). If the Remote - SSH extension is not already installed when opening a Gitpod workspace, you will be prompted to install the extension.

If VS Code Desktop cannot connect directly via SSH, the [**Local Companion**](/docs/ides-and-editors/local-companion) is downloaded and used as a fallback to tunnel the SSH connection. If required, you can force VS Code Desktop to always fallback to the Local Companion by setting the property `gitpod.remote.useLocalApp` in your user preferences to `true`.

> **Deprecation Notice:** The fallback SSH connection using Local Companion for VS Code Desktop will be deprecated in a future release of Gitpod. If you cannot connect to your workspaces directly via SSH, e.g. your firewall is blocking the connection, please [contact support](https://gitpod.io/support) with [troubleshooting logs](https://www.gitpod.io/docs/troubleshooting#gitpod-logs-in-vs-code-web-and-desktop).

## Settings Sync

You can optionally enable Settings Sync with Gitpod to have the same extensions, themes and settings on VS Code Browser and Desktop. You can learn more about it as well as how to enable it in [Settings Sync](settings-sync).

## Managing extensions

VS Code runs extensions in one of two places: locally on the UI / client side, or remotely on your Gitpod workspace.

For further details, please refer to the official VS Code docs on how to [manage extensions](https://code.visualstudio.com/docs/remote/ssh#_managing-extensions).

## Installing custom fonts

The process of installing fonts matches how you typically install custom fonts locally:

1. Download the desired font to your local machine and install it locally on your operating system.
1. Open the editor's user settings (e.g. _File_ > _Preferences_ > _Settings_ > _User_)
1. Configure your font with the `editor.fontFamily` setting:
   ```json
   {
     "editor.fontFamily": "Your custom font name"
   }
   ```
