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

```
OBJECT_STORAGE_SA=gitpod-storage
OBJECT_STORAGE_SA_EMAIL="${OBJECT_STORAGE_SA}"@"${PROJECT_NAME}".iam.gserviceaccount.com
gcloud iam service-accounts create "${OBJECT_STORAGE_SA}" --display-name "${OBJECT_STORAGE_SA}"
gcloud projects add-iam-policy-binding "${PROJECT_NAME}" \\
    --member serviceAccount:"${OBJECT_STORAGE_SA_EMAIL}" --role="roles/storage.admin"
gcloud projects add-iam-policy-binding "${PROJECT_NAME}" \\
    --member serviceAccount:"${OBJECT_STORAGE_SA_EMAIL}" --role="roles/storage.objectAdmin"
```

Save the service account key to the file `./gs-credentials.json`:

```
gcloud iam service-accounts keys create --iam-account "${OBJECT_STORAGE_SA_EMAIL}" \\
    ./gs-credentials.json
```

</div>
<div slot="aws">

In this deployment we create one S3 bucket and one IAM User service account to access it. These credentials and bucket are used for both object storage and storing the workspace images via a Registry frontend deployed in Gitpod. The bucket has to have a globally unique name.

```
export S3_BUCKET_NAME="suitably-tired-puma-registry"
echo $S3_BUCKET_NAME
```

### Create the S3 Bucket and ensure it is private

```
aws s3api create-bucket \\
    --bucket $S3_BUCKET_NAME \\
    --region eu-west-1 --create-bucket-configuration LocationConstraint=eu-west-1 \\
    --object-ownership BucketOwnerEnforced
aws s3api put-public-access-block \\
    --bucket $S3_BUCKET_NAME \\
    --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### Create an IAM user for credentials with access just to this bucket

```
aws iam create-user \\
  --user-name gitpod-s3-access \\
  --tags Key=project,Value=gitpod
```

Save the following file as `S3_policy.json`, replacing the resource name with the S3 bucket you created:

```json
{
  "Statement": [
    {
      "Action": [
        "s3:ListBucketMultipartUploads",
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Effect": "Allow",
      "Resource": ["arn:aws:s3:::suitably-tired-puma-registry"],
      "Sid": ""
    },
    {
      "Action": [
        "s3:PutObject",
        "s3:ListMultipartUploadParts",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:AbortMultipartUpload"
      ],
      "Effect": "Allow",
      "Resource": ["arn:aws:s3:::suitably-tired-puma-registry/*"],
      "Sid": ""
    }
  ],
  "Version": "2012-10-17"
}
```

Create the policy, taking note of the ARN in the output:

```
aws iam create-policy \\
    --policy-name gitpod_s3_access_policy \\
    --policy-document file://S3_policy.json \
    --tags Key=project,Value=gitpod

{
    "Policy": {
        "PolicyName": "gitpod_s3_access_policy",
        "PolicyId": "ANPA2B3JAS5KQGN6MQRMW",
        "Arn": "arn:aws:iam::691173103445:policy/gitpod_s3_access_policy",
        "Path": "/",
        "DefaultVersionId": "v1",
        "AttachmentCount": 0,
        "PermissionsBoundaryUsageCount": 0,
        "IsAttachable": true,
        "CreateDate": "2022-06-24T14:31:30+00:00",
        "UpdateDate": "2022-06-24T14:31:30+00:00",
        "Tags": [
            {
                "Key": "project",
                "Value": "gitpod"
            }
        ]
    }
}
```

Attach the policy to the IAM user you just created:

```
aws iam attach-user-policy \\
    --user-name gitpod-s3-access \\
    --policy-arn 'arn:aws:iam::691173103445:policy/gitpod_s3_access_policy'
```

### Create and store user access token

Be prepared to store the `AccessKeyId` and `SecretAccessKey` securely once you execute the following command:

```
aws iam create-access-key --user-name gitpod-s3-access
```

This should result in an output similar to the following:

```
{
    "AccessKey": {
        "UserName": "gitpod-s3-access",
        "AccessKeyId": "---------------",
        "Status": "Active",
        "SecretAccessKey": "-------------------",
        "CreateDate": "2022-06-24T14:37:40+00:00"
    }
}
```

To test that this works, open a new shell session and configure it to use the `AccessKeyId` and `SecretAccessKey` you've just retrieved, and attempt to upload a file and then delete it:

```sh
export AWS_ACCESS_KEY_ID=----------
export AWS_SECRET_ACCESS_KEY="----------------"
aws s3 ls s3://suitably-tired-puma-registry
echo "hello world" > gitpod_test.txt
aws s3 cp gitpod_test.txt s3://suitably-tired-puma-registry
upload: ./gitpod_test.txt to s3://suitably-tired-puma-registry/gitpod_test.txt
aws s3 ls s3://suitably-tired-puma-registry
2022-06-24 15:50:20         12 gitpod_test.txt
aws s3 rm s3://suitably-tired-puma-registry/gitpod_test.txt
delete: s3://suitably-tired-puma-registry/gitpod_test.txt
aws s3 ls s3://suitably-tired-puma-registry
*nothing returns if empty*
```

</div>
</CloudPlatformToggle>
