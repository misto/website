---
section: develop
title: Teams & Projects
---

<script context="module">
  export const prerender = true;
</script>

# {title}

> {title} is currently in [Beta](/docs/references/gitpod-releases) · [Send feedback](https://github.com/gitpod-io/gitpod/issues/5095).

When you sign up for Gitpod the first time, you automatically gain access to a **Personal Account** where you can also add projects.
To collaborate with others on projects you can create a **Team** and invite others as team members.

## Teams

Teams are used to share projects amongst team members. All users with access to a team can view branches and prebuilds for the projects in the team. They can also open new workspaces directly from a branch in the dashboard.

Owners of a team can manage other members, reset the invite URL, and setup [Team Billing](/docs/team-billing).

### View teams

To view all your teams, click on the scope selector on the left of the top bar.

### Create a team

To create a new team:

1. On the top bar, click on the scope selector and select _New Team_.
2. Next, you will be asked for a team name that will serve also as the team slug.

### Add members to a team

Once you create a team you can invite members by using the unique invite URL from the Members page within a team.

### Change member permissions

New members will join with a _Member_ role which you can later change if needed from the Members list using the more actions button. See [Roles](#roles) below.

### Remove a member from a team

You can remove a team member form the Members list using the more actions button while hovering over the user entry.

### Filter members in a team

On the Members page you can filter users by membership role using the filters above the Members list.

### Leaving a team

You can leave a team using the more actions button in the Members list while hovering over your user entry.

## Projects

Projects represent the connection between Gitpod and a remote git repository.
On GitHub, such a connection is established through the [GitHub App](https://github.com/marketplace/gitpod-io) while on GitLab and Bitbucket, the connection exists through an active webhook.

Projects have a stable URL in the dashboard based on the team's slug and the project's name like the following:

> `https://gitpod.io/t/<team>/<project>/`

### View projects

All projects are listed as cards, either on your personal account or on any of the teams you are a member of.

Project cards include information like repository name, repository URL, quick links to project branches and prebuilds as well as branch and timestamp information for the latest prebuild.

### Add a new project

To add a new project:

1. Click on the _New Project_ button on the Projects page.
2. You can select a provider where the repository exists. By default, the wizard will default to the first provider you authorized with when you signed up with Gitpod.
3. You will need to install the GitHub app or have proper permissions to install a webhook for GitLab and Bitbucket before selecting a repository.
4. If you are trying to add a project from your personal account, you'll be prompted to optionally create a team for the new project. By default, the wizard will automatically associate a project to a team if you initiated the process from the team page.
5. Last but not least, you'll be redirected to the configuration page of the new project.

### Configure a project

Once you add a project, Gitpod tries to automatically detect any project configuration by looking for a `.gitpod.yml` file inside the repository. If no such file exists, Gitpod tries to guess the project type and build configuration to suggest a `.gitpod.yml` boilerplate.

If Gitpod can't detect the project type based on the source code of the project, you get a commented `.gitpod.yml` that you need to adjust before running a successful prebuild.

Once you are happy with the configuration, you can try to execute a prebuild and then open a new workspace.

The configuration will be stored in a Gitpod database together with other project information until you decide to persist the changes in the repository by creating a `.gitpod.yml` file at the root of your project. A `.gitpod.yml` file in your project takes precedence over configuration stored in the Gitpod database.

### Remove a project

You can remove a project by using the more actions button while hovering over a project card.

## Roles

| Permission             | Owner | Member |
| ---------------------- | ----- | ------ |
| Manage Team Members    | Yes   | No     |
| Delete Team            | Yes   | No     |
| Manage Team Billing    | Yes   | No     |
| Edit Project Settings  | Yes   | No     |
| Edit Project Variables | Yes   | No     |
| Invite Team Members    | Yes   | Yes    |
| Add Projects.          | Yes   | Yes    |
| Remove Projects.       | Yes   | Yes    |
| Add Projects           | Yes   | Yes    |
| View Branches          | Yes   | Yes    |
| View Prebuilds         | Yes   | Yes    |
| Trigger Prebuilds      | Yes   | Yes    |
