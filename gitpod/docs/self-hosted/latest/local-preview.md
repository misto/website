---
section: self-hosted/latest
subsection: installation-guides
title: Local Preview of Gitpod Self-Hosted
---

<script context="module"> 
  export const prerender = true;
</script>

# How to Install the Local Preview Gitpod Self-Hosted

> **Note:** Currently, this Local Preview of Gitpod Self-Hosted is in [alpha](../../references/gitpod-releases). **It does not work on Macs with Apple Silicon (e.g. M1).** See [the relevant issue](https://github.com/gitpod-io/gitpod/issues/9075) for more information.

The Local Preview of Gitpod Self-Hosted is the easiest way to try out Gitpod locally without having to spin up a Kubernetes cluster - allowing you to try Gitpod Self-Hosted locally with minimal effort and resource requirements. As a result, this is **not intended for production** usage. Please refer to the [Getting Started](./getting-started) page for instructions on how to install Gitpod for continuous usage.

This install method runs a `k3s` cluster inside a Docker container. Self-signed certificates are automatically created and a Gitpod instance using these certificates will be installed into the `k3s` cluster. See our [TLS](./advanced/tls) page for more information about Gitpod and certificates.

## 1. Running the docker container

First, Create a volume to which the Gitpod container will attach:

```bash
docker volume create gitpod
```

Run the following command to get the `local-preview` Docker container up and running:

```bash
docker run -p 443:443 --privileged --name gitpod --rm -it -v gitpod:/var/gitpod eu.gcr.io/gitpod-core-dev/build/local-preview
```

Unpacking the above command:

- `-p 443:443` to map the `443` container port to host.
- `--privileged` to be able to run docker (and hence `k3s`) inside the container. This is necessary.
- `--name gitpod` to set the name of the docker container for further access.
- `gitpod:/var/gitpod` to store the workspace files, etc into the `gitpod` volume.

> **Note:** By default, `127-0-0-1.nip.io` is the DOMAIN to access Gitpod. To use another host network IP Address, the `DOMAIN` environment can be set accordingly via an `-e` flag in the above command. This is useful to share access to the Gitpod Self-Hosted instance running on your machine within your local network. For Example, `192.168.0.42` Host Network IP would be `192-168-0-42.nip.io`, set by appending `-e DOMAIN=192-168-0-42.nip.io`.

## 2. Accessing Gitpod

As this is a self-signed instance of Gitpod, the Gitpod root CA cert has to be imported into your browser manually to access the full functionality of Gitpod. The certificate can be retrieved by running the following:

```bash
docker cp gitpod:/var/gitpod/gitpod-ca.crt $HOME/gitpod-ca.crt
```

This certificate is saved at `$HOME/gitpod-ca.crt` and can then be loaded into your browser. Most browsers also require a restart before they can start to use the imported certificate.

Once the certificate is loaded, the URL to access the Gitpod instance would be `https://127-0-0-1.nip.io` unless the `DOMAIN` environment is overridden in which
case the same has to be used.

The first screen you see will ask you to configure a git integration. This git integration will also serve as the way that you and your users authenticated against Gitpod. You can find out more in the [integrations](../../integrations) section.

> **Important:** Public (SaaS) Source Control Management Systems (SCMs) (i.e. [GitLab.com](http://Gitlab.com), [GitHub.com](http://github.com/) and [Bitbucket.org](http://Bitbucket.org)) are **not** integrated by default with a Self-Hosted Gitpod instance because OAuth apps are tied to domains. Therefore, these public SCMs need to be integrated manually with an OAuth application you specifically create for your domain. This is done similarly to how it is done for the private/self-hosted versions of each SCM. As such their respective guides also apply here:<br \> - Follow [these](../../gitlab-integration#registering-a-self-hosted-gitlab-installation) steps to integrate [`GitLab.com`](https://gitlab.com/) with your self-hosted Gitpod instance. You will need to enter `gitlab.com` as the `Provider Host Name` in the New Git Integration Modal.<br \>- Follow [these](../../github-enterprise-integration) steps to integrate [`GitHub.com`](http://github.com) with your self-hosted Gitpod instance. You will need to enter `github.com` as the `Provider Host Name` in the New Git Integration Modal. <br \>- Follow [these](../../bitbucket-server-integration) steps to integrate [`Bitbucket.org`](https://bitbucket.org/) with your self-hosted Gitpod instance. Select `Bitbucket` as the `Provider Type` in the New Git Integration Modal. For bitbucket.org this requires configuring an "OAuth consumer" on a "workspace". This is slightly different from the documented Bitbucket Server integration. See [gitpod PR #9894](https://github.com/gitpod-io/gitpod/pull/9894#pullrequestreview-969013833) for an example.

> **Note:** Your first workspace start can take a bit of time because the workspace image first needs to be built and then downloaded. Subsequent workspace starts should be much quicker.
