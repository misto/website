---
section: self-hosted/latest
title: Installation requirements for Gitpod Self-Hosted
---

<script context="module">
  export const prerender = true;
</script>

# Required Infrastucture Set-Up for a

This page details the software and hardware requirements for installing Gitpod Self-Hosted on your own infrastructure. An overview of what is needed can be seen in the following diagram:

![Self Hosted Requirements](../../static/images/docs/self-hosted-environment-requirements.png)

## Checklist for a minimal installation

To facilitate this, here is a checklist of what the minimal set of Infrastructure and components required before you can take the next step of installing Gitpod:

<!--- todo: link to next steps --->
<!--- todo: had to use this weird way to link here because it was the only way to get a link to work within a label - not sure why I need the &nbsp but without them spaces are missing --->
  <div>
    <input type="checkbox" id="infra" name="infra" unchecked>
    <label for="infra"> Set up your &nbsp<a href="./requirements#required-infrastructure">Kubernetes cluster</a>&nbsp using an automatic guide or manually</label>
  </div>

  <div>
    <input type="checkbox" id="certman" name="certman" unchecked>
    <label for="certman">Make sure you have  &nbsp<a href="./requirements#cert-manager">cert-manager installed</a>&nbsp in the cluster</label>
  </div>

  <div>
    <input type="checkbox" id="DNS" name="DNS" unchecked>
    <label for="DNS">Make sure you have a &nbsp<a href="./requirements#dns">DNS set up</a></label>
  </div>

  <div>
    <input type="checkbox" id="certs" name="certs" unchecked>
    <label for="certs">Make sure you have the &nbsp<a href="./requirements#ssl">required TLS certificates</a></label>
  </div>

Proceed with the installation of Gitpod Self-Hosted.

<!--- todo: link to next steps --->

## Required Infrastructure

Gitpod requires a Kubernetes cluster with certain characteristics that are described below. You can use one of our automated set up scripts that set up a compatible cluster for you.

### Automated Cluster Set-up

> These guides are inteded as a starting point for most users, but will not cover edge cases. In these situations, please see the requirements below to create your own cluster.

Our automated guides help you set up the infrastructure needed to run Gitpod Self-Hosted. These will not create any of the [required components](./requirements#required-components) - unless otherwise specified, these can be automatically created during the installation of Gitpod itself.

There are guides for the most popular cloud providers:

- [Amazon Elastic Kubernetes Service (EKS)](./installation/on-amazon-eks)
- [Google Kubernetes Engine (GKE)](./installation/on-gke)
- [Microsoft Azure Kubernetes Service (AKS)](./installation/on-microsoft-aks)

After completing the guides you will still need to [installed cert-manager](./requirements#cert-manager) and register [DNS](./requirements#dns) and have [certificates](./requirements#ssl) ready in order to proceed with the installation.<!--- todo: add link to installation docs--->

### Compute Resources

We recommend nodes with a size of at least 4 vCPU and 8GB of ram. We further recommend at least two nodes in your cluster to get started - this should allow you to run around two workspaces in parallel. The exact number will depend on what exactly you are running.

### Supported Kubernetes distributions

Gitpod requires Kubernetes as an orchestration technology in order to spin up and down workspaces - ideally in combination with cluster autoscaling to minimise cost. We strongly recommend deploying a dedicated kubernetes cluster just for Gitpod Self-Hosted.

> Kubernetes version `1.21` or above is required

Gitpod Self-Hosted runs well on:

- Amazon Elastic Kubernetes Service
- Google Kubernetes Engine
- Microsoft Azure Kubernetes Service
- K3s

#### Incompatible Kubernetes distributions

These platforms do not currently work with Gitpod Self-Hosted but we would like to support them in the future. Gitpod is an open-source project, maybe you could contribute the required changes to help get them working sooner?

- [Red Hat® OpenShift®](https://github.com/gitpod-io/gitpod/issues/5409)
- [Rancher Kubernetes Engine (RKE)](https://github.com/gitpod-io/gitpod/issues/5410)

If you are considering purchasing a commerical license for Gitpod Self-Hosted and need one of the above platforms then please [contact us](/contact/sales) to start discussions about making support for them happen sooner.

### Cluster set up

<!--- todo:  ensue this reflects the truth - are we really still calling it meta?--->

It is recommended to have a minimum of two node pools, grouping the `meta`
and `ide` nodes together and the `workspace` nodes together.

Your Kubernetes nodes must have the following labels applied to them:

- `gitpod.io/workload_meta`
- `gitpod.io/workload_ide`
- `gitpod.io/workload_workspace_services`
- `gitpod.io/workload_workspace_regular`
- `gitpod.io/workload_workspace_headless`

### Node and container requirements

These are the components expected on each node:

- Either Ubuntu 18.04 with ≥ v5.4 kernel or Ubuntu 20.04 with ≥ v5.4 kernel
- Calico for the networking overlay and network policy
- containerd ≥ 1.5

## Required Services

Gitpod relies certain services for it to function. By default all of these are automaitcally installed in-cluster, but they can be configured to use services external to the cluster. <!--- todo: When do we advise these to be run outside of cluster? --->

### Cert Manager

[Cert-manager](https://cert-manager.io/) MUST be installed to your cluster. Cert-manager is used to secure communication between the various components, the application creates internally which are created using the cert-manager Certificate and Issuer Custom Resource Definitions.

<details>
  <summary><b>You can find up-to-date instructions on how to install cert-manager <a href="https://cert-manager.io/docs/installation/kubectl/#installing-with-regular-manifests"> here</a>, but in short:</b></summary>

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.8.0/cert-manager.yaml
```

</details>

### Storage

By default, minio is installed in a cluster to serve as a way to store static content and to back an in-cluster image registry. This can be configured during the installation. Outside of minio, AWS S3, Azure Blob Storage and Google Cloud Storage are supported.

### Database

Gitpod uses a MySQL database to store user data.By default Gitpod ships with a MySQL database built-in and data is stored using a Kubernetes PersistentVolume. For production settings, we recommend operating your own MySQL database (version v5.7 or newer). This can be configured during installation. <!--- todo: Is this true? How do you configure this? --->

### Image Registry

By default, a docker based image registry backed by minio is installed in the cluster (this can be configured during the installation). However, Gitpod is also compatible with any registry that implements the Docker Registry HTTP API V2 specification.

<details>
  <summary><b>Using Amazon Elastic Container Registry (ECR)</b></summary>
  Amazon ECR does not implement this spec fully. The spec expects
  that, if an image is pushed to a repository that doesn't exist, it creates the
  repository before uploading the image. Amazon ECR does not do this - if the
  repository doesn't exist, it will error on push.

To configure Gitpod to use Amazon, you will need to use the in-cluster
registry and configure it to use S3 storage as the backend storage.

```yaml
containerRegistry:
  inCluster: true
  s3storage:
    bucket: <name of bucket>
    certificate:
      kind: secret
      name: s3-storage-token
```

The secret expects to have two keys:

- `s3AccessKey`
- `s3SecretKey`

</details>

### Source Control Management System

Gitpod expects to be connected to a Source Control Management System (SCM) such as Gitlab in order to function. You can find out more about which SCMs are supported and how connect them in the [Integrations](../../integrations) section. You will also be guided through this once you access your Gitpod installation for the first time.

### Ingress

Gitpod is designed to serve traffic directly to your local network or internet. Wrapping Gitpod Self-Hosted behind proxies such as nginx or configurations where URLs are rewritten are not supported.

## Required Configuration

The following configuration files are required to run your Self-Hosted Gitpod instance.

### DNS

Gitpod requires a domain (or sub-domain on a domain) that is resolvable by your name servers. As Gitpod launches services and workspaces on additional subdomains it also needs two wildcard domains.

For example:

```
your-domain.com
*.your-domain.com
*.ws.your-domain.com
```

or

```
gitpod.your-domain.com
*.gitpod.your-domain.com
*.ws.gitpod.your-domain.com
```

### SSL

<!--- todo: Make sure this section matches reality, specifically regarding the custom certs support we are introducing --->

- Gitpod requires trusted HTTPS certificates. While there is no hard requirement on any certificate authority, we recommend using an [ACME certificate](https://caddyserver.com/docs/automatic-https#acme-challenges) issuer (such as [ZeroSSL](https://zerossl.com) or [LetsEncrypt](https://letsencrypt.org)) to automatically renew and install certificates as we do for [gitpod.io](https://gitpod.io).
- Installation of Gitpod with SSL certificates signed with your own CA are not currently supported. This scenario is desired and we would welcome help getting [this community pull-request](https://github.com/gitpod-io/gitpod/pull/2984) merged.
- The HTTPS certificates for your domain must include `your-domain.com`, `*.your-domain.com` and `*.ws.your-domain.com`. Beware that wildcard certificates are valid for one level only (i.e. `*.a.com` is not valid for `c.b.a.com`)
