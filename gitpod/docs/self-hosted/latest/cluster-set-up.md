---
section: self-hosted/latest
title: Cluster Set-Up
---

<script context="module">
  export const prerender = true;
</script>

# Cluster Set-Up

Gitpod is a Kubernetes application running with certain expectations on the characteristics of the cluster it is running on. In order to create a cluster that meets these expectations, you can either use one of our automated set up scripts or manually go through the requirements below.

### Automated Cluster Set-up

> These guides are inteded as a starting point for most users, but will not cover edge cases. In these situations, please see the requirements below to create your own cluster.

Our automated guides help you set up the infrastructure needed to run Gitpod Self-Hosted. These will not create any of the [required components](./required-components) - unless otherwise specified, these can be automatically created during the installation of Gitpod itself.

There are guides for the most popular cloud providers:

- [Amazon Elastic Kubernetes Service (EKS)](./installation/on-amazon-eks)
- [Google Kubernetes Engine (GKE)](./installation/on-gke)
- [Microsoft Azure Kubernetes Service (AKS)](./installation/on-microsoft-aks)

After completing the guides you will still need to [installed cert-manager](./requirements#cert-manager) and register [DNS](./requirements#dns) and have [certificates](./requirements#ssl) ready in order to proceed with the installation.<!--- todo: add link to installation docs--->

## Compute Resources

We recommend nodes with a size of at least 4 vCPU and 8GB of ram. We further recommend at least two nodes in your cluster to get started - this should allow you to run around two workspaces in parallel. The exact number will depend on what exactly you are running.

## Supported Kubernetes distributions

Gitpod requires Kubernetes as an orchestration technology in order to spin up and down workspaces - ideally in combination with cluster autoscaling to minimise cost. We strongly recommend deploying a dedicated kubernetes cluster just for Gitpod Self-Hosted.

> Kubernetes version `1.21` or above is required

Gitpod Self-Hosted runs well on:

- Amazon Elastic Kubernetes Service
- Google Kubernetes Engine
- Microsoft Azure Kubernetes Service
- K3s

### Incompatible Kubernetes distributions

These platforms do not currently work with Gitpod Self-Hosted but we would like to support them in the future. Gitpod is an open-source project, maybe you could contribute the required changes to help get them working sooner?

- [Red Hat® OpenShift®](https://github.com/gitpod-io/gitpod/issues/5409)
- [Rancher Kubernetes Engine (RKE)](https://github.com/gitpod-io/gitpod/issues/5410)

If you are considering purchasing a commerical license for Gitpod Self-Hosted and need one of the above platforms then please [contact us](/contact/sales) to start discussions about making support for them happen sooner.

## Node Affinity Labels reqirements

Your Kubernetes nodes must have the following labels applied to them:

- `gitpod.io/workload_meta=true`
- `gitpod.io/workload_ide=true`
- `gitpod.io/workload_workspace_services=true`
- `gitpod.io/workload_workspace_regular=true`
- `gitpod.io/workload_workspace_headless=true`

It is recommended to have a minimum of two node pools, grouping the `meta`
and `ide` nodes together and the `workspace` nodes together.

## Node and container requirements

These are the components expected on each node:

- Either Ubuntu 18.04 with ≥ v5.4 kernel or Ubuntu 20.04 with ≥ v5.4 kernel
- Calico for the networking overlay and network policy
- Containerd ≥ 1.5
