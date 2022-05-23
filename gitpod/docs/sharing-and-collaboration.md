---
section: develop
title: Collaboration & Sharing
---

<script context="module">
  export const prerender = true;
</script>

# Collaboration & Sharing of Workspaces

There are two ways to share your workspaces:

- [Sharing Snapshots](#sharing-snapshots)
- [Sharing Running Workspaces](#sharing-running-workspaces)

`youtube: TrY15zN98p8`

## Sharing Snapshots

You can take a snapshot URL of your workspace at any time and share it with others. Clicking on the snapshot link will open a complete clone of your workspace, including

- all the files in the workspace
- the VS Code layout

Workspaces created from snapshots are treated as restarts, so you can configure them to launch differently than if you had created a fresh workspace from Git. This is useful if you want to create easy-to-consume reproducible workspace state e.g. for issues, support answers, training, or presentations.

Unlike sharing running workspaces, snapshotted workspaces are full copies. This means developers can do whatever they like with the content. And of course, no access to any of your credentials is shared.

Read more about this feature [in this blog post](/blog/workspace-snapshots).

> **Note:** Users must have access to the git repository in the snapshot, in order to open it.

### How To Take a Snapshot URL

To create a snapshot, run `Gitpod: Share Workspace Snapshot` from the hamburger menu at the top left, or from the Gitpod menu at the bottom, or via the command palette.

Once you execute it, the snapshot is taken and the URL is shown in a dialog.

You can also run `gp snapshot` if you prefer to do it from CLI for some automation need.

## Sharing Running Workspaces

Sharing running workspaces makes it possible to quickly look at a workspace together with a (remote) colleague. It is similar to collaborating on Google Docs, in that you can see who is online and look at the same code and processes.

To share your workspace, navigate to the workspaces page at https://gitpod.io/workspaces. From there:

1. Move your mouse over the workspace you want to share (change the filter to All if you don't see your workspace).
1. Click the three dots menu to the right of the highlighted workspace.
1. Click **Share**

This marks your workspace as shared. When you open it, you can copy & share its URL.

> **Security note:**
>
> Beware, anybody with this URL and a Gitpod account will be able to access the workspace as long as
> it is shared and running.
>
> Every action involving Git in a shared workspace happens on behalf of the workspace owner's account without further authorization. This includes access to secrets used in a shared workspace.
> It is highly recommended to give workspace URLs only to trusted users and unshare workspaces as soon as sharing them is no longer necessary.
>
> **A running Gitpod workspace really is your personal machine.**
>
> At present, this feature cannot be disabled. If this is something you are interested in, please [let us know in this issue](https://github.com/gitpod-io/gitpod/issues/6328).

## External Collaboration Plugins

With Gitpod you can also use the following third-party integrations for real-time collaboration:

- [Code Together](https://www.codetogether.com/) - Works on VS Code Desktop, VS Code Browser, and via JetBrains or Eclipse.
- [GitLive](https://git.live/) - Works on VS Code Desktop, VS Code Browser, and via JetBrains.
- [Duckly](https://duckly.com/) - Works on VS Code Desktop and VS Code Browser.
