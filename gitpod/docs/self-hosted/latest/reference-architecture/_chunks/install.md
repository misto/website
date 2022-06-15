---
layout: false
---

<script lang="ts">
  import CloudPlatformToggle from "$lib/components/docs/cloud-platform-toggle.svelte";
</script>

Congratulations. You have set up your cluster. Now, you are ready to install Gitpod. Follow the instructions of [step 4 of the Getting Started Guide](../getting-started#step-4-install-gitpod).

<CloudPlatformToggle id="cloud-platform-toggle-install">
<div slot="gcp">

If you followed the steps to create your infrastructure on GCP of this guide, you need to use the following config settings for your Gitpod installation:

| General settings |                         |
| ---------------- | ----------------------- |
| Domain name      | value of `$DOMAIN_NAME` |

Un-select the in-cluster container registry checkbox.

| Container registry          |                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| In-cluster                  | no                                                                                                       |
| Container registry URL      | `gcr.io/${PROJECT_NAME}/gitpod`<br/>(replace `${PROJECT_NAME}` with your GCP project name)               |
| Container registry server   | `gcr.io`                                                                                                 |
| Container registry username | `_json_key`                                                                                              |
| Container registry password | Content of file `./gs-credentials.json`<br/>Remove linebreaks, e.g. with `jq -c . ./gs-credentials.json` |

Un-select the in-cluster MySQL checkbox.

| Database                 |                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| In-cluster               | no                                                                                           |
| Google Cloud SQL Proxy   | yes                                                                                          |
| CloudSQL connection name | `${PROJECT_NAME}:${REGION}:${MYSQL_INSTANCE_NAME}`<br/>Replace variables with actual values! |
| Username                 | value of `${MYSQL_GITPOD_USERNAME}`                                                          |
| Password                 | value of `${MYSQL_GITPOD_PASSWORD}`                                                          |
| GCP service account key  | Upload file `./mysql-credentials.json`                                                       |

Select `GCP` as object storage provider.

| Object storage      |                                     |
| ------------------- | ----------------------------------- |
| Storage provider    | GCP                                 |
| Storage region      | value of `${REGION}`                |
| Project ID          | value of `${PROJECT_NAME}`          |
| Service account key | Upload file `./gs-credentials.json` |

Keep cert-manager selected for the TLS certificates options.

| TLS certificates            |                         |
| --------------------------- | ----------------------- |
| Self-signed TLS certificate | no                      |
| cert-manager                | yes                     |
| Issuer name                 | `gitpod-issuer`         |
| Issuer type                 | Select “cluster issuer” |

</div>

<div slot="aws"></div>
</CloudPlatformToggle>
