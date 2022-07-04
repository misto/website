---
layout: false
---

<script lang="ts">
  import CloudPlatformToggle from "$lib/components/docs/cloud-platform-toggle.svelte";
</script>

Gitpod uses a **relational database management system** to store structural data. Gitpod supports MySQL. The database is a central component in Gitpod where all metadata about users and workspaces as well as settings of the Gitpod instance (as auth providers) are stored. That makes the database a critical component. In case of a database outage, you will not be able to log in, use the Gitpod dashboard, or start workspaces.

In this reference architecture, we use the managed databases by the cloud providers.

<CloudPlatformToggle id="cloud-platform-toggle-database">
<div slot="gcp">

As relational database, we create a [Google Cloud SQL instance](https://cloud.google.com/sql) with MySQL 5.7. Use the following commands to create the database instance:

```
MYSQL_INSTANCE_NAME=gitpod-mysql
gcloud sql instances create "${MYSQL_INSTANCE_NAME}" \\
    --database-version=MYSQL_5_7 \\
    --storage-size=20 \\
    --storage-auto-increase \\
    --tier=db-n1-standard-2 \\
    --region="${REGION}" \\
    --replica-type=FAILOVER \\
    --enable-bin-log

gcloud sql instances patch "${MYSQL_INSTANCE_NAME}" --database-flags \\
            explicit_defaults_for_timestamp=off
```

After that, we create the database named `gitpod` as well as a dedicated Gitpod database user with a random password.

```
gcloud sql databases create gitpod --instance="${MYSQL_INSTANCE_NAME}"

MYSQL_GITPOD_USERNAME=gitpod
MYSQL_GITPOD_PASSWORD=$(openssl rand -base64 20)
gcloud sql users create "${MYSQL_GITPOD_USERNAME}" \\
    --instance="${MYSQL_INSTANCE_NAME}" \\
    --password="${MYSQL_GITPOD_PASSWORD}"
```

Finally, you need to create a service account that has the `roles/cloudsql.client` role:

```
MYSQL_SA=gitpod-mysql
MYSQL_SA_EMAIL="${MYSQL_SA}"@"${PROJECT_NAME}".iam.gserviceaccount.com
gcloud iam service-accounts create "${MYSQL_SA}" --display-name "${MYSQL_SA}"
gcloud projects add-iam-policy-binding "${PROJECT_NAME}" \\
    --member serviceAccount:"${MYSQL_SA_EMAIL}" --role="roles/cloudsql.client"
```

Save the service account key to the file `./mysql-credentials.json`:

```
gcloud iam service-accounts keys create --iam-account "${MYSQL_SA_EMAIL}" \\
    ./mysql-credentials.json
```

</div>
<div slot="aws">

A RDS MySQL db.m6g.large instance with a standby instance for failover is suggested starting point for installations.

</div>
</CloudPlatformToggle>
