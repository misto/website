---
layout: false
---

<script lang="ts">
  import CloudPlatformToggle from "$lib/components/docs/cloud-platform-toggle.svelte";
</script>

Gitpod uses an **object storage** to store blob data. This includes workspace backups that will be created when a workspace stops and are used to restore state upon restart. Different user settings like IDE preferencesa are also stored this way.

This reference architecture uses managed object storage by the cloud providers.

<CloudPlatformToggle id="cloud-platform-toggle-object-storage">
<div slot="gcp">

For each Gitpod user, their own bucket will be created at runtime. For this reason, Gitpod needs proper rights to create buckets in the object storage. Create a service account that has the following roles:

| Roles                     |
| ------------------------- |
| roles/storage.admin       |
| roles/storage.objectAdmin |

```bash
OBJECT_STORAGE_SA=gitpod-storage
OBJECT_STORAGE_SA_EMAIL="${OBJECT_STORAGE_SA}"@"${PROJECT_NAME}".iam.gserviceaccount.com
gcloud iam service-accounts create "${OBJECT_STORAGE_SA}" --display-name "${OBJECT_STORAGE_SA}"
gcloud projects add-iam-policy-binding "${PROJECT_NAME}" \
    --member serviceAccount:"${OBJECT_STORAGE_SA_EMAIL}" --role="roles/storage.admin"
gcloud projects add-iam-policy-binding "${PROJECT_NAME}" \
    --member serviceAccount:"${OBJECT_STORAGE_SA_EMAIL}" --role="roles/storage.objectAdmin"
```

Save the service account key to the file `./gs-credentials.json`:

```bash
gcloud iam service-accounts keys create --iam-account "${OBJECT_STORAGE_SA_EMAIL}" \
    ./gs-credentials.json
```

</div>
<div slot="aws">
</div>
</CloudPlatformToggle>
