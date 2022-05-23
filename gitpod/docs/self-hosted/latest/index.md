---
section: self-hosted/latest
title: Gitpod Self-Hosted
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
      "Install and run Gitpod with full control on public cloud providers or self-managed Kubernetes clusters. Enterprise-grade security within corporate firewalls and air-gapped networks. Requirements. Installation. Configuration. GKE. EKS. AKS. Open-source.",
    title: "Gitpod Self-Hosted installation guide",
    keywords: "installation",
  }}
/>

# Gitpod Self-Hosted

Gitpod can be deployed and operated on your own infrastructure. It supports different cloud providers, self-managed Kubernetes clusters, corporate firewalls, and even off-grid / air-gapped networks.

## Prerequisites to Install Gitpod Self-Hosted

- **Kubernetes expertise** <br />
  Gitpod is a Kubernetes application that makes heavy use of various Kubernetes features. It is highly recommended to have sufficient Kubernetes experience in order to install Gitpod. These docs expect that you are able to create and maintain a Kubernetes cluster that meets our [requirements](./latest/cluster-set-up) on your own.

- **Compatible Kubernetes cluster** <br />
  To install Gitpod you need to have a Kubernetes cluster up and running. There are a few [requirements](./latest/cluster-set-up) that must be met. For the three main supported cloud providers (_Google Kubernetes Engine_, _Amazon Elastic Kubernetes Service_, and _Microsoft Azure Kubernetes Service_) we provide [samples on how to create compatible clusters](./latest/cluster-set-up#cluster-set-up-guides).

- **Cert-Manager** <br />
  Gitpod expects a properly configured [cert-manager](https://cert-manager.io/) that runs in the cluster. It is used to issue internal certificates for the Gitpod installation and to create certificates for the Gitpod domain (unless you bring your own domain certificates).

- **DNS setup** <br />
  For your Gitpod installation you need a properly configured domain. The domain itself and the wildcard subdomain `*.example.com`, `*.ws.example.com` (replace `example.com` with your Gitpod domain) need to point to the cluster ingress.

- **Gitpod product license** <br />
  To install Gitpod, you need a license. We provide a community license for free (right click and save link as [here](https://raw.githubusercontent.com/gitpod-io/gitpod/main/install/licenses/Community.yaml)). To get an enterprise license, [fill out this form](/enterprise-license).

## Getting Started

The [getting started guide](./latest/getting-started) provides you with step-by-step instructions on how to install Gitpod on your infrastructure.

<!-- ## Advanced Installation

You want to use your own database, registry, object storage, or source control management system? Gitpod should be run in an air-gap network? The [advanced installation page](./latest/advanced) provides you with more information on how to install and configure Gitpod. The page “[required components](./latest/required-components)” gives you an overview of compatible 3rd-party products like databases, registries, and source control management systems. -->

## Troubleshooting

The [troubleshooting guide](./latest/troubleshooting) shows you how to create a support bundle. Take a look at our [support page](/support) to learn how to reach our community and support team.
