---
layout: false
---

<script lang="ts">
  import CloudPlatformToggle from "$lib/components/docs/cloud-platform-toggle.svelte";
</script>

The heart of this reference architecture is a **Kubernetes cluster** where all Gitpod components are deployed to. This cluster consists of two node pools:

1. **Services Node Pool**: On these nodes, the Gitpod “app” with all its services are deployed to. These services provide the users with the dashboard and manages the provisioning of workspaces.
2. **Workspaces Node Pool**: On the workspace nodes, Gitpod deploys the actual workspaces (where the actual developer work is happening). Because workspaces have vastly differing resource and security isolation requirements compared to Gitpod’s own services, they run on a dedicated node pool.

To enforce that the Gitpod components are scheduled to the proper node pools, you need to assign the following labels to the node pools:

| Node Pool            | Labels                                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Services Node Pool   | `gitpod.io/workload_meta=true`,<br/>`gitpod.io/workload_ide=true`                                                                               |
| Workspaces Node Pool | `gitpod.io/workload_workspace_services=true`,<br/>`gitpod.io/workload_workspace_regular=true`,<br/>`gitpod.io/workload_workspace_headless=true` |

The following table gives an overview of the node types for the different cloud providers that are used by this reference architecture.

|                      | GCP               | AWS           |
| -------------------- | ----------------- | ------------- |
| Services Node Pool   | `n2d-standard-8`  | `m6i.xlarge`  |
| Workspaces Node Pool | `n2d-standard-16` | `m6i.2xlarge` |

<CloudPlatformToggle id="cloud-platform-toggle-cluster">

<div slot="gcp">

First, we [create a **service account**](https://cloud.google.com/iam/docs/creating-managing-service-accounts) for the cluster. The service account needs to have the following roles:

| Roles                         |
| ----------------------------- |
| roles/storage.admin           |
| roles/logging.logWriter       |
| roles/monitoring.metricWriter |
| roles/container.admin         |

Run the following commands to create the service account:

```
GKE_SA=gitpod-gke
GKE_SA_EMAIL="${GKE_SA}"@"${PROJECT_NAME}".iam.gserviceaccount.com
gcloud iam service-accounts create "${GKE_SA}" --display-name "${GKE_SA}"
gcloud projects add-iam-policy-binding "${PROJECT_NAME}" --member serviceAccount:"${GKE_SA_EMAIL}" --role="roles/storage.admin"
gcloud projects add-iam-policy-binding "${PROJECT_NAME}" --member serviceAccount:"${GKE_SA_EMAIL}" --role="roles/logging.logWriter"
gcloud projects add-iam-policy-binding "${PROJECT_NAME}" --member serviceAccount:"${GKE_SA_EMAIL}" --role="roles/monitoring.metricWriter"
gcloud projects add-iam-policy-binding "${PROJECT_NAME}" --member serviceAccount:"${GKE_SA_EMAIL}" --role="roles/container.admin"
```

After that, we [create a **Kubernetes cluster**](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-regional-cluster).

|                           |                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Image Type                | `UBUNTU_CONTAINERD`                                                                                         |
| Machine Type              | `e2-standard-2`                                                                                             |
| Cluster Version           | Choose latest from [regular channel](https://cloud.google.com/kubernetes-engine/docs/release-notes-regular) |
| Enable                    | Autoscaling,<br/>Autorepair,<br/>IP Alias,<br/>Network Policy                                               |
| Disable                   | Autoupgrade<br/>`metadata=disable-legacy-endpoints=true`                                                    |
| Create Subnetwork         | `gitpod-${CLUSTER_NAME}`                                                                                    |
| Max Pods per Node         | 10                                                                                                          |
| Default Max Pods per Node | 110                                                                                                         |
| Min Nodes                 | 0                                                                                                           |
| Max Nodes                 | 1                                                                                                           |
| Addons                    | HorizontalPodAutoscaling,<br/>NodeLocalDNS,<br/>NetworkPolicy                                               |
| Region                    | Choose your [region and zones](https://cloud.google.com/compute/docs/regions-zones)                         |

```
CLUSTER_NAME=gitpod
REGION=us-central1
GKE_VERSION=1.21.11-gke.900

gcloud container clusters \\
    create "${CLUSTER_NAME}" \\
    --disk-type="pd-ssd" --disk-size="50GB" \\
    --image-type="UBUNTU_CONTAINERD" \\
    --machine-type="e2-standard-2" \\
    --cluster-version="${GKE_VERSION}" \\
    --region="${REGION}" \\
    --service-account "${GKE_SA_EMAIL}" \\
    --num-nodes=1 \\
    --no-enable-basic-auth \\
    --enable-autoscaling \\
    --enable-autorepair \\
    --no-enable-autoupgrade \\
    --enable-ip-alias \\
    --enable-network-policy \\
    --create-subnetwork name="gitpod-${CLUSTER_NAME}" \\
    --metadata=disable-legacy-endpoints=true \\
    --max-pods-per-node=110 \\
    --default-max-pods-per-node=110 \\
    --min-nodes=0 \\
    --max-nodes=1 \\
    --addons=HorizontalPodAutoscaling,NodeLocalDNS,NetworkPolicy
```

Unfortunately, you cannot create a cluster without the default node pool. Since we need a custom node pool, you need to remove the default one.

<!-- Can we re-use the default node pool instead? → https://github.com/gitpod-io/website/pull/2106#discussion_r893885815 -->

```
gcloud --quiet container node-pools delete default-pool \\
    --cluster="${CLUSTER_NAME}" --region="${REGION}"
```

Now, we are [creating a **node pool**](https://cloud.google.com/kubernetes-engine/docs/how-to/node-pools) **for the Gitpod services**.

|                   |                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------- |
| Image Type        | `UBUNTU_CONTAINERD`                                                                 |
| Machine Type      | `n2d-standard-8`                                                                    |
| Enable            | Autoscaling<br/>Autorepair<br/>IP Alias<br/>Network Policy                          |
| Disable           | Autoupgrade<br/>`metadata=disable-legacy-endpoints=true`                            |
| Create Subnetwork | `gitpod-${CLUSTER_NAME}`                                                            |
| Number of nodes   | 1                                                                                   |
| Min Nodes         | 1                                                                                   |
| Max Nodes         | 50                                                                                  |
| Max Pods per Node | 110                                                                                 |
| Scopes            | `gke-default`,<br/>`https://www.googleapis.com/auth/ndev.clouddns.readwrite`        |
| Region            | Choose your [region and zones](https://cloud.google.com/compute/docs/regions-zones) |
| Node Labels       | `gitpod.io/workload_meta=true`,<br/>`gitpod.io/workload_ide=true`                   |

```
gcloud container node-pools \\
    create "workload-services" \\
    --cluster="${CLUSTER_NAME}" \\
    --disk-type="pd-ssd" \\
    --disk-size="100GB" \\
    --image-type="UBUNTU_CONTAINERD" \\
    --machine-type="n2d-standard-8" \\
    --num-nodes=1 \\
    --no-enable-autoupgrade \\
    --enable-autorepair \\
    --enable-autoscaling \\
    --metadata disable-legacy-endpoints=true \\
    --scopes="gke-default,https://www.googleapis.com/auth/ndev.clouddns.readwrite" \\
    --node-labels="gitpod.io/workload_meta=true,gitpod.io/workload_ide=true,gitpod.io/workload_workspace_services=true" \\
    --max-pods-per-node=110 \\
    --min-nodes=1 \\
    --max-nodes=50 \\
    --region="${REGION}"
```

We are also creating a **node pool for the Gitpod workspaces**.

|                   |                                                                                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Image Type        | `UBUNTU_CONTAINERD`                                                                                                                             |
| Machine Type      | `n2d-standard-16`                                                                                                                               |
| Enable            | Autoscaling,<br/>Autorepair,<br/>IP Alias,<br/>Network Policy                                                                                   |
| Disable           | Autoupgrade<br/>`metadata=disable-legacy-endpoints=true`                                                                                        |
| Create Subnetwork | `gitpod-${CLUSTER_NAME}`                                                                                                                        |
| Number of nodes   | 1                                                                                                                                               |
| Min Nodes         | 1                                                                                                                                               |
| Max Nodes         | 50                                                                                                                                              |
| Max Pods per Node | 110                                                                                                                                             |
| Scopes            | `gke-default`,<br/>`https://www.googleapis.com/auth/ndev.clouddns.readwrite`                                                                    |
| Region            | Choose your [region and zones](https://cloud.google.com/compute/docs/regions-zones)                                                             |
| Node Labels       | `gitpod.io/workload_workspace_services=true`,<br/>`gitpod.io/workload_workspace_regular=true`,<br/>`gitpod.io/workload_workspace_headless=true` |

```
gcloud container node-pools \\
    create "workload-workspaces" \\
    --cluster="${CLUSTER_NAME}" \\
    --disk-type="pd-ssd" \\
    --disk-size="100GB" \\
    --image-type="UBUNTU_CONTAINERD" \\
    --machine-type="n2d-standard-16" \\
    --num-nodes=1 \\
    --no-enable-autoupgrade \\
    --enable-autorepair \\
    --enable-autoscaling \\
    --metadata disable-legacy-endpoints=true \\
    --scopes="gke-default,https://www.googleapis.com/auth/ndev.clouddns.readwrite" \\
    --node-labels="gitpod.io/workload_workspace_regular=true,gitpod.io/workload_workspace_headless=true" \\
    --max-pods-per-node=110 \\
    --min-nodes=1 \\
    --max-nodes=50 \\
    --region="${REGION}"
```

Now, you can **connect `kubectl`** to your newly created cluster.

```
gcloud container clusters get-credentials --region="${REGION}" "${CLUSTER_NAME}"
```

After that, you need to create cluster role bindings to allow the current user to create new RBAC rules.

```
kubectl create clusterrolebinding cluster-admin-binding \\
    --clusterrole=cluster-admin \\
    --user="$(gcloud config get-value core/account)"
```

</div>
<div slot="aws">

For eksctl, configuring the cluster and the nodegroups cannot happen simultaneously. You need to deploy the cluster control plane first, do modifications to the network stack (either AWS VPC or Calico), and then provision the node groups. This ensures you have the maximum number of pods to run (110 in most cases) Gitpod workspaces.

The example `eksctl` config file includes services accounts that might not be relevant to a particular deployment, but are included for reference.

- `cert-manager` provided for the required cert-manager tooling. If using DNS-01 challenges for LetsEncrypt with a Route53 zone, then enable the cert-manager wellKnowPolicy or ensure one exists with permissions to modify records in the zone.
- `aws-load-balancer-controller` enables ELB creation for LoadBalancer services and integration with AWS Application Load Balancers.
- `cluster-autoscaler` connects to the AWS autoscaler.
- `ebs-csi-controller-sa` enables provisioning the EBS volumes for PVC storage.

The suggested node group settings include privateNetworking:

```yaml
- name: services
  amiFamily: Ubuntu2004
    instanceTypes: ["m6i.xlarge"]
  desiredCapacity: 2
  minSize: 1
  maxSize: 6
  maxPodsPerNode: 110
  disableIMDSv1: false
  volumeSize: 300
  volumeType: gp3
  volumeIOPS: 6000
  volumeThroughput: 500
  ebsOptimized: true
  privateNetworking: true
  propagateASGTags: true
    tags:
    k8s.io/cluster-autoscaler/enabled: "true"
    k8s.io/cluster-autoscaler/gitpod: "owned"
  labels:
    gitpod.io/workload_meta: "true"
    gitpod.io/workload_ide: "true"
    iam:
    attachPolicyARNs: # EKS CNI Policy is needed for IP management
      - arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
      - arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy
      - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
      - arn:aws:iam::aws:policy/ElasticLoadBalancingFullAccess
      - arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
    withAddonPolicies:
    albIngress: true
    autoScaler: true
    cloudWatch: true
    certManager: true
    ebs: true

  - name: workspaces # identical as above, with the following differences
    instanceTypes: ["m6i.2xlarge"]
    minSize: 1
    maxSize: 10
    labels:
    gitpod.io/workload_workspace_regular: "true"
    gitpod.io/workload_workspace_services: "true"
    gitpod.io/workload_workspace_headless: "true"
```

</div>
</CloudPlatformToggle>
