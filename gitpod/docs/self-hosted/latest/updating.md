---
section: self-hosted/latest
subsection: operational-guides
title: Updating Gitpod Self-Hosted
---

<script context="module">
  export const prerender = true;
</script>

# How to Update your Gitpod Installation

At first, you need to start the installation admin console. In a terminal with configured `kubectl` run the following command (`<namespace>` is the Kubernetes namespace your Gitpod installation has been installed to):

```shell
$ kubectl kots admin-console --namespace <namespace>
```

Open `http://localhost:8800` (port `8800` is opened on your node on `localhost` only—you may want to forward the port to your workstation to access the admin console). Enter your password. Click on “Check for update”.

> **Note:** For air gapped installations, you need to click `Upload a new version` to upload a new version and then deploy it. A new version is made available to you to download via the download portal provided to you by Gitpod.

When an update is available, you will be asked to deploy the new version. You can run preflight checks on the new version and when you press deploy your current running version will be updated.

In most cases, updates should work without further effort - and your existing data is carried over. In some cases (with breaking changes) we will provide instructions on how to upgrade to a specific version in our [Update Guides](../latest/releases#upgrade-guides).

![kots-admin-dashboard](../../static/images/docs/self-hosted/kots-admin-dashboard.png)

## Update Strategies

You can deploy different strategies to update your Gitpod instance. Each strategy comes with trade-offs regarding downtime, risk, and cost. In any case, you should ensure that the chosen strategy matches your (company’s) risk profile and that every part of your update strategy (incl. rollbacks) is regularly practiced.

### Maintenance Window (Higher downtime, low risk and medium cost) - Recommended

In this strategy, you have scheduled maintenance windows where you take down your entire Gitpod installation, update it, test it, and then make it available again. Ideally, this is done during times of low demand, e.g. outside of work hours.

### Secondary Staging Deployment (medium downtime, lower risk, higher cost)

In this strategy, you run the newest version of Gitpod on a secondary (staging) cluster to ensure compatibility/fitness of the newest version within your specific environment. Given that you are testing on a secondary cluster, you save on downtime in your primary cluster. If you are confident in the release, you can then also apply the update to your primary cluster. Given that workspace startups may fail for a brief period _during_ the update process, a maintenance window (albeit smaller) may still be required.

### Live update (No downtime, higher risk, low cost)

In this strategy, an update is applied to the live cluster hosting your production Gitpod installation. This incurs no downtime and no complexities around having to install Gitpod on two clusters, however, if something does go wrong you will need to be able to roll back (this is possible via the installation admin console). This strategy may not work if there are breaking changes that need to be addressed by you from one release to the next (see [Update Guides](../latest/releases#upgrade-guides)).
