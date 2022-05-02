---
section: self-hosted/latest
title: Updating Gitpod Self-Hosted
---

<script context="module">
  export const prerender = true;
</script>

# Updating your Gitpod Installation

At first, you need to start the installation admin console. In a terminal with configured `kubectl` run the following command (`<namespace>` is the Kubernetes namespace your Gitpod installation has been installed to):

```shell
$ kubectl kots admin-console --namespace <namespace>
```

Open your favorite browser and go to `http://localhost:8800` (port `8800` is opened on your node on `localhost` only--you may want to forward the port to your workstation to access the admin console). Enter your password. Click on “Check for update”. In case an update is available, you will be asked to deploy the new version.

![kots-admin-dashboard](../../static/images/docs/self-hosted/kots-admin-dashboard.png)
