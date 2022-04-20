---
section: troubleshooting
title: Troubleshooting
---

<script context="module">
  export const prerender = true;
</script>

# Troubleshooting

If you cannot find your issue here or in the documentation, please contact Gitpod via our [Support page](/support).

## Gitpod logs in VS Code Web

These logs contain information about the workspace, the session, and the Visual Studio Code environment. They are useful for diagnosing connection issues and other unexpected behavior.

- Open the Visual Studio Code Command Palette (<kbd>Shift</kbd> + <kbd>Command</kbd> + <kbd>P</kbd> (Mac) / <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> (Windows)) and type **Export logs**, select **Developer: Export all logs** from the list to download a zip file containing all of the logs.
  **Important:** The content of these logs should **NOT** be shared publicly as they could contain sensitive information about your workspace. Instead, send them to support@gitpod.io along with a link to a corresponding GitHub issue if needed.

## Why doesn't the "ClearURLs" browser extension work with Gitpod?

The ClearURLs browser extension for [Google Chrome](https://chrome.google.com/webstore/detail/clearurls/lckanjgmijmafbedllaakclkaicjfmnk?hl=en) and [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/clearurls/) inhibits Gitpod workspaces from initialising and the problem manifests with the following symptoms:

- The dark theme doesn't load
- The bottom left Gitpod button is missing
- The VS Code Marketplace does not load
- Settings Sync does not work

This issue can be resolved by disabling "ETag filtering" in ClearURLs’ settings. An [issue has been created](https://gitlab.com/KevinRoebert/ClearUrls/-/issues/977) that requests to whitelist Gitpod by default and we would appreciate your upvotes on the issue.

## Is there a limit of IDE/editor connections to Gitpod?

There is no hard-limit about how many IDE/editors can be connected to a running Gitpod workspace. All connected IDEs/editors will have access to the same underlying file system and directories.

## What version of VS Code runs in Gitpod (in the browser)?

VS Code in the browser in Gitpod uses a fork of [VS Code](https://github.com/microsoft/vscode) called [openvscode-server](https://github.com/gitpod-io/openvscode-server). Gitpod actively monitors VS Code's release cycle, and releases the latest version of VS Code shortly after the upstream repository is updated. You can find more information about which version of VS Code is running in the browser by navigating to "Help > About" from a running Gitpod workspace.

## Can I use both a desktop IDE and a browser editor in Gitpod?

Yes, you can. Both desktop and browser IDEs/editors have full access to files and directories within the workspace. So, when you connect to your Gitpod workspace from your Desktop you can also access your workspace via your browser. This means browser-based editing can either be used as your first-choice editor, or as a "fall back" alternative option for when you want to make edits on the move. With Gitpod, where and how you edit your code is very flexible.

## What is the preferred IDE/editor for Gitpod?

There are many ways to edit your code in Gitpod, using [supported JetBrains IDE's](/docs/ides-and-editors) via [JetBrains Gateway](ides-and-editors/jetbrains-gateway), or by using [VS Code in the browser](/docs/ides-and-editors/vscode-browser) / [VS Code on desktop](/docs/ides-and-editors/vscode).

## Do I need a license to use JetBrains and Gitpod?

The licensing of Remote Development is handled on the local machine and is covered by your existing active IDE license. See [JetBrains documentation](https://www.jetbrains.com/help/idea/remote-development-starting-page.html#licensing) for more.

## Will Gitpod support all the JetBrains IDE's?

Yes, the plan is to eventually support all of the JetBrains IDE's. Please refer to the [Gitpod roadmap](https://www.gitpod.io/roadmap) for future updates.

## Will Gitpod support JetBrains Fleet?

[JetBrains Fleet](https://www.jetbrains.com/fleet/) is a next-generation IDE from JetBrains. The currently supported method of using JetBrains IDE's with Gitpod is on desktop via [JetBrains Gateway](/docs/ides-and-editors/jetbrains-gateway), please refer to our documentation for current [IDE and editor support](/docs/ides-and-editors) and the [Gitpod roadmap](https://www.gitpod.io/roadmap) for future updates.

## Can I use JetBrains Projector with Gitpod?

Gitpod does not officially support [JetBrains Projector](https://lp.jetbrains.com/projector/). Gitpod has support for [JetBrains Gateway](ides-and-editors/jetbrains-gateway), which is the primary tool for remote development when using JetBrains IDE's.

## What should I do if JetBrains Gateway and Gitpod aren't working?

1. Ensure you are using the latest version of [JetBrains Gateway](https://www.jetbrains.com/help/idea/remote-development-a.html#gateway)
2. Ensure you are using the latest version of the [Gitpod JetBrains Gateway plugin](https://plugins.jetbrains.com/plugin/18438-gitpod-gateway)
