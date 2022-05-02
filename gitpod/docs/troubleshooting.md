---
section: troubleshooting
title: Troubleshooting
---

<script context="module">
  export const prerender = true;
</script>

# Troubleshooting

If you cannot find your issue here or in the documentation, please contact Gitpod via our [Support page](/support).

## Gitpod logs in VS Code Web and Desktop

These logs contain information about the workspace, the session, and the Visual Studio Code environment. They are useful for diagnosing connection issues and other unexpected behavior.

- Open the Visual Studio Code Command Palette (<kbd>Shift</kbd> + <kbd>Command</kbd> + <kbd>P</kbd> (Mac) / <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> (Windows)) and type **Export logs**, select **Gitpod: Export all logs** from the list to download a zip file containing all of the logs.

**Important:** The content of these logs should **NOT** be shared publicly as they could contain sensitive information about your workspace. Instead, send them to support@gitpod.io along with a link to a corresponding GitHub issue if needed.

## Why doesn't the "ClearURLs" browser extension work with Gitpod?

The ClearURLs browser extension for [Google Chrome](https://chrome.google.com/webstore/detail/clearurls/lckanjgmijmafbedllaakclkaicjfmnk?hl=en) and [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/clearurls/) inhibits Gitpod workspaces from initialising and the problem manifests with the following symptoms:

- The dark theme doesn't load
- The bottom left Gitpod button is missing
- The VS Code Marketplace does not load
- Settings Sync does not work

This issue can be resolved by disabling "ETag filtering" in ClearURLs’ settings. An [issue has been created](https://gitlab.com/KevinRoebert/ClearUrls/-/issues/977) that requests to whitelist Gitpod by default and we would appreciate your upvotes on the issue.

## What should I do if JetBrains Gateway and Gitpod aren't working?

1. Ensure you are using the latest version of [JetBrains Gateway](https://www.jetbrains.com/help/idea/remote-development-a.html#gateway)
2. Ensure you are using the latest version of the [Gitpod JetBrains Gateway plugin](https://plugins.jetbrains.com/plugin/18438-gitpod-gateway)
