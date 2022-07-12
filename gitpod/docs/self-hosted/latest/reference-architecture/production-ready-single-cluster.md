---
section: self-hosted/latest
subsection: installation-guides
title: "Single-Cluster Production-Ready Reference Architecture"
---

<script context="module">
  export const prerender = true;
</script>

<script lang="ts">

  import Overview from "./_chunks/overview.md";
  import Preparations from "./_chunks/preparations.md";
  import Cluster from "./_chunks/cluster.md";
  import Networking from "./_chunks/networking.md";
  import Registry from "./_chunks/registry.md";
  import Database from "./_chunks/database.md";
  import Storage from "./_chunks/storage.md";
  import Install from "./_chunks/install.md";
</script>

# Single-Cluster Production-Ready Reference Architecture

This guide describes a single-cluster production-ready reference architecture for Gitpod. It consists of a Kubernetes cluster, cert-manager, external MySQL database, external OCI image registry, and external object storage. It includes instructions on how to set up this reference architecture on the officially supported cloud providers.

This reference architecture can be used as a blueprint for your Gitpod installation: Start with this reference architecture and adapt it to your needs. The reference architecture as described in this guide is what Gitpod supports, and is used to test against every self-hosted Gitpod release.

To use Gitpod, you also need a Git source code management system (SCM) like GitLab, GitHub, or Bitbucket. You will find the supported SCMs on the [required components guide](../required-components). Installing your own SCM is beyond the scope of this guide. However, you can simply use the cloud versions of GitLab, GitHub, or Bitbucket as well as the possible existing installation in your corporate network.

You can also create a Kubernetes cluster on your bare metal servers for smaller setups. See the [K3s guide](../cluster-set-up/on-k3s) for more information.

## Overview

<Overview />

## Cloud Provider Preparations

<Preparations />

## Kubernetes Cluster

<Cluster />

## Ingress

<Networking />

## OCI Image Registry

<Registry />

## Database

<Database />

## Object Storage

<Storage />

## Install Gitpod

<Install />
