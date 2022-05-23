---
section: self-hosted/latest
title: Gettings Started with Gitpod Self-Hosted
---

<script context="module">
  export const prerender = true;
</script>

# Getting Started with Gitpod Self-Hosted

> **Note:** Setting up a self-hosted Gitpod instance needs some Kubernetes experience. Detailed guidance on how to setup and maintain a Kubernetes cluster is behind the scope of these docs. See also [_Prerequisites to Install Gitpod Self-Hosted_](../latest#prerequisites-to-install-gitpod-self-hosted).

## Step 1: Create a Kubernetes Cluster

Gitpod is a Kubernetes application that uses Kubernetes internally to provision workspaces as Kubernetes pods. Before you can start installing Gitpod, you need to create a compatible Kubernetes cluster. Since the steps that are needed to create a proper cluster differ between the cloud providers, it's up to you to setup a cluster that meets the proper [requirements](./cluster-set-up). We have created a [list of examples and scripts](./cluster-set-up#cluster-set-up-guides) that will help you to get started with your favorite cloud provider.

## Step 2: Install Cert-Manager

Once you have created your Kubernetes cluster you need to install [cert-manager](https://cert-manager.io/). cert-manager is needed in any case even when you bring your own TLS certificate for your domain. Please consider the [cert-manager documentation](https://cert-manager.io/docs/) on how to install it.

**Creating TLS certs for your domain with cert-manager**

cert-manager provides the Gitpod installation with certificates for internal communication. Besides this, cert-manager can also create a TLS certificate for your domain. Since Gitpod needs wildcard certificates, you must use the [DNS-01 challenge](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge). Please consult the [cert-manager documentation](https://cert-manager.io/docs/configuration/acme/dns01) for instructions. You can use either an [`Issuer` or `ClusterIssuer`](https://cert-manager.io/docs/concepts/issuer).

Following the cert-manager instructions, you will have an `Issuer` or `ClusterIssuer` with a configured `dns01` solver (most probably with a proper secret with credentials for your DNS provider) as well a `Certificate` with the following `dnsNames`:

- `example.com`
- `*.example.com`
- `*.ws.example.com`

_(replace `example.com` with your Gitpod domain)_

## Step 3: Configure DNS

To install Gitpod you need a domain with a TLS certificate. The DNS setup to your domain needs to be configured such that it points to the ingress of your Kubernetes cluster. You need to configure your actual domain (say `example.com`) as well as the wildcard subdomains `*.example.com` as well as `*.ws.example.com`.

## Step 4: Install Gitpod

At this point, you should have:

- a running Kubernetes cluster
- cert-manager installed in this cluster
- a TLS certificate for your domain (incl. wildcard subdomains) _or_ a configured `Issuer`/`ClusterIssuer` plus `Certificate` for cert-manager
- a domain with proper DNS setup

To start with installing Gitpod, you need a terminal where you can run `kubectl` to access your cluster. At first, install the KOTS kubectl plugin:

```shell
$ curl https://kots.io/install | bash
```

Now, you are ready to install Gitpod. Run the following command in your terminal:

```shell
$ kubectl kots install gitpod
```

You will be asked for the namespace you want to install Gitpod to as well as a password for the admin console. After some time, you will see the following output:

```
  • Press Ctrl+C to exit
  • Go to http://localhost:8800 to access the Admin Console
```

Open your favorite browser and go to `http://localhost:8800` (port `8800` is opened on your node on `localhost` only--you may want to forward the port to your workstation in order to access the admin console).

The first page will ask you to upload your Gitpod license. We provide a community license for free (right click and save link as [here](https://raw.githubusercontent.com/gitpod-io/gitpod/main/install/licenses/Community.yaml)). To get an enterprise license, [fill out this form](/enterprise-license). For more information about our licenses and respective pricing plans, please visit our [self-hosted pricing page](https://www.gitpod.io/self-hosted).

After uploading the license, you will be forwarded to the config page. On this page, you need to enter your domain name for your Gitpod installation. You can also configure to use [external components](./required-components) (by default internal ones are installed) as well as your TLS certs setup. Click “Continue” to proceed with the installation.

![kots-install-config](../../static/images/docs/self-hosted/kots-install-config.png)

In the next step, the installer runs a preflight check. This validates your cluster to meet the minimum requirements. Everything is green? Awesome! Click “Continue” to proceed.

![kots-preflights-results](../../static/images/docs/self-hosted/kots-preflights-results.png)

Now, you are seeing the installation admin page. Once the installation has been finished successfully, you will see the status “Ready” with a small green indicator next to the Gitpod logo. You see which version you installed and which license you are using.

![kots-admin-dashboard](../../static/images/docs/self-hosted/kots-admin-dashboard.png)

Open your Gitpod domain in your browser to access your running Gitpod instance.

> Note that your first workspace start can take a bit of time because an image first needs to be built and then downloaded. Subsequent workspace starts should be much quicker.
