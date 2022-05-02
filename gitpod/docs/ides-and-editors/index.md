---
section: ides-and-editors
title: IDEs & Editors
---

<script context="module">
  export const prerender = true;
</script>

<script lang="ts">
    import OpenGraph from "$lib/components/open-graph.svelte";
</script>

<OpenGraph
data={{
    description:
      "Connect and integrate Gitpod workspaces with your favourite IDE or editor. VS Code Browser and Desktop. JetBrains. IntelliJ. GoLand. PhpStorm. PyCharm. Vim. Emacs. SSH.",
    title: "Gitpod integrates with VS Code, JetBrains and SSH.",
    keywords: "online IDEs, JetBrains, VS Code, webstorm, IntelliJ, PHPStorm, PyCharm,Rider, RubyMine, Webstorm CLion, Datagrip etc.",
  }}
/>

# {title}

In line with [our ambition to "remove all friction from the developer experience"](https://www.notion.so/gitpod/Values-Attributes-2ed4c2f93c84499b98e3b5389980992e), Gitpod currently supports many popular IDE/editors e.g. JetBrains and VS Code through both the browser and on desktop. You can even use the command-line directly for editors like Vim (via SSH). There are many ways to [configure your IDE/editor in Gitpod](ides-and-editors/configure-your-editor-ide) to match your preferred workflow or setup.

## Connecting an IDE/editor to Gitpod

Currently, there are five ways to connect an IDE, editor or command-line session to access your Gitpod workspace:

1. **Browser (VS Code)** - Open a Gitpod workspace directly in your browser. The default editor in the browser is VS Code ([configure VS Code with Gitpod](ides-and-editors/vscode-browser)).
2. **Desktop (SSH copy/paste)** - Simply [copy/paste an SSH command](ides-and-editors/command-line) for a running workspace from the Gitpod dashboard.
3. **Desktop (VS Code Desktop or JetBrains Gateway)** - Open a Gitpod workspace on desktop using [VS Code Desktop](ides-and-editors/vscode) or using the [JetBrains Gateway](/docs/ides-and-editors/jetbrains-gateway) custom Gitpod plugin.
4. **Desktop (Local Companion)** - You can also connect to a Gitpod workspace via SSH by installing the [Local Companion](/docs/ides-and-editors/local-companion).
5. **Browser (Docker Image)** - As [Gitpod supports Docker](config-docker), you can install a custom IDE/editor via a Docker image, and run the IDE/editor as a web server.

### Supported IDE/editors

- [VS Code Browser](ides-and-editors/vscode-browser)
- [VS Code Desktop](ides-and-editors/vscode)
- [IntelliJ](ides-and-editors/intellij)
- [GoLand](ides-and-editors/goland)
- [PhpStorm](ides-and-editors/phpstorm)
- [PyCharm](ides-and-editors/pycharm)
- [Command Line (e.g. Vim)](ides-and-editors/command-line)
