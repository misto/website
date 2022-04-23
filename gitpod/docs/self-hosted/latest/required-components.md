---
section: self-hosted/latest
title: Required Components
---

<script context="module">
  export const prerender = true;
</script>

# Required Components

Gitpod relies certain components and services for it to function. By default, most of these can be automaitcally installed in-cluster during installation. However, you can also configure Gitpod use your own version of these that may or may not live inside the cluster. <!--- todo: When do we advise these to be run outside of cluster? --->

| Component                                                                                  | Required?                     |
| ------------------------------------------------------------------------------------------ | ----------------------------- |
| [Bucket Storage](./required-components#bucket-storage)                                     | Use default or bring your own |
| [Database](./required-components#database)                                                 | Use default or bring your own |
| [Image Registry](./required-components#image-registry)                                     | Use default or bring your own |
| [Source Control Management System](./required-components#source-control-management-system) | Use default or bring your own |
| [Cert-manager](./required-components#cert-manager)                                         | Yes                           |

## Bucket Storage

By default, MinIO is installed in the cluster to store static content and to back an in-cluster image registry. During the installation process you can also configure Gitpod to use your own storage provider. Support storage services are:

- MinIO
- AWS S3
- Azure Blob Storage
- Google Cloud Storage

## Database

Gitpod uses a MySQL database to store user data. By default Gitpod ships with a MySQL database built-in and data is stored using a Kubernetes PersistentVolume. For production settings, we recommend operating your own MySQL database (version v5.7 or newer). Which database is used can be configured during installation. <!--- todo: Is this true? How do you configure this? --->

## Image Registry

Gitpod relies on a image registry to store images used to start workspaces. By default, a docker based image registry backed by minio is installed in the cluster (this can be configured during the installation). However, Gitpod is also compatible with any registry that implements the [Docker Registry HTTP API V2](https://docs.docker.com/registry/spec/api/) specification.

<details>
  <summary  class="text-p-medium">Using Amazon Elastic Container Registry (ECR)</summary>
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

## Source Control Management System

Gitpod expects to be connected to a Source Control Management System (SCM) such as Gitlab in order to function. You can find out more about which SCMs are supported and how to connect to them in the [Integrations](../../integrations) section. You will also be guided through connecting your SCM once you access your Gitpod installation for the first time.

## Cert Manager

[Cert-manager](https://cert-manager.io/) must be installed in your cluster before you can install Gitpod. Cert-manager is used create and manage certificates needed to secure communication between the various internal Gitpod components. See the [getting started guide](./getting-started#step-2-install-cert-manager) for details on how to install cert-manager.

<!-- ## Required Configuration

The following configuration files are required to run your Self-Hosted Gitpod instance.

### Ingress

Gitpod is designed to serve traffic directly to your local network or internet. Wrapping Gitpod Self-Hosted behind proxies such as nginx or configurations where URLs are rewritten are not supported.



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

<!--
- Gitpod requires trusted HTTPS certificates. While there is no hard requirement on any certificate authority, we recommend using an [ACME certificate](https://caddyserver.com/docs/automatic-https#acme-challenges) issuer (such as [ZeroSSL](https://zerossl.com) or [LetsEncrypt](https://letsencrypt.org)) to automatically renew and install certificates as we do for [gitpod.io](https://gitpod.io).
- Installation of Gitpod with SSL certificates signed with your own CA are not currently supported. This scenario is desired and we would welcome help getting [this community pull-request](https://github.com/gitpod-io/gitpod/pull/2984) merged.
- The HTTPS certificates for your domain must include `your-domain.com`, `*.your-domain.com` and `*.ws.your-domain.com`. Beware that wildcard certificates are valid for one level only (i.e. `*.a.com` is not valid for `c.b.a.com`)
 -->
