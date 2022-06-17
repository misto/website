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

|                      | GCP             | AWS           |
| -------------------- | --------------- | ------------- |
| Services Node Pool   | `n2-standard-4` | `m6i.xlarge`  |
| Workspaces Node Pool | `n2-standard-8` | `m6i.2xlarge` |

There are other relevant requirementss around the expected networking plicy and container runtime which can be found in the [Cluster Set-Up](../../latest/cluster-set-up#node-and-container-requirements) section. These requirements are respected in the coud specific instructions below.

<CloudPlatformToggle id="cloud-platform-toggle-cluster">

<div slot="gcp">

At first, we [create a **service account**](https://cloud.google.com/iam/docs/creating-managing-service-accounts) for the cluster. The service account needs to have the following roles:

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
| Machine Type      | `n2-standard-4`                                                                     |
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
    --machine-type="n2-standard-4" \\
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
| Machine Type      | `n2-standard-8`                                                                                                                                 |
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
    --machine-type="n2-standard-8" \\
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

<!-- For eksctl, configuring the cluster and the nodegroups cannot happen simultaneously. You need to deploy the cluster control plane first, do modifications to the network stack (either AWS VPC or Calico), and then provision the node groups. This ensures you have the maximum number of pods to run (110 in most cases) Gitpod workspaces.

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
``` -->

For eksctl, configuring the cluster and the nodegroups cannot happen simultaneously. You need to deploy the cluster control plane first, do modifications to the network stack (either AWS VPC or Calico), and then provision the node groups. This ensures you have the maximum number of pods to run (110 in most cases) Gitpod workspaces.

The example `eks-gitpod-cluster.yml` config defines the cluster that we will create. It includes the following services accounts that might not be relevant to a particular deployment, but are included for reference:

- `aws-load-balancer-controller` enables ELB creation for LoadBalancer services and integration with AWS Application Load Balancers.
- `ebs-csi-controller-sa` enables provisioning the EBS volumes for PVC storage.
- `cluster-autoscaler` connects to the AWS autoscaler.
- - `cert-manager` provided for the required cert-manager tooling. If using DNS-01 challenges for LetsEncrypt with a Route53 zone, then enable the cert-manager wellKnowPolicy or ensure one exists with permissions to modify records in the zone.

> **Important:** You need to update the `eks-gitpod-cluster.yml` below with your desired region and metadata.

<details> 
<summary> <b> eks-gitpod-cluster.yml </b>  </summary>

```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: gitpod
  region: eu-west-2 # please set your desired region
  version: "1.22"
  tags:
    project: "gitpod"

# uncomment and update to include just a specific subset of availability zones
#availabilityZones:[eu-west-2a,eu-west-2b]

iam:
  withOIDC: true

  serviceAccounts:
    - metadata:
        name: aws-load-balancer-controller
        namespace: kube-system
      wellKnownPolicies:
        awsLoadBalancerController: true
    - metadata:
        name: ebs-csi-controller-sa
        namespace: kube-system
      wellKnownPolicies:
        ebsCSIController: true
    - metadata:
        name: cluster-autoscaler
        namespace: kube-system
      wellKnownPolicies:
        autoScaler: true
    - metadata:
        name: cert-manager
        namespace: cert-manager
      wellKnownPolicies:
        certManager: true

vpc:
  autoAllocateIPv6: false
  nat:
    gateway: Single

cloudWatch:
  clusterLogging:
    enableTypes: ["*"]

privateCluster:
  enabled: false
  additionalEndpointServices:
    - "autoscaling"
    - "logs"

managedNodeGroups:
  - name: services
    amiFamily: Ubuntu2004
    spot: false
    instanceTypes: ["m6i.xlarge"]
    desiredCapacity: 2
    minSize: 1
    maxSize: 4
    maxPodsPerNode: 110
    disableIMDSv1: false
    volumeSize: 300
    volumeType: gp3
    volumeIOPS: 6000
    volumeThroughput: 500
    ebsOptimized: true
    privateNetworking: true
    propagateASGTags: true

    iam:
      attachPolicyARNs:
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

    tags:
      k8s.io/cluster-autoscaler/enabled: "true"
      k8s.io/cluster-autoscaler/gitpod: "owned"

    labels:
      gitpod.io/workload_meta: "true"
      gitpod.io/workload_ide: "true"

    preBootstrapCommands:
      - echo "export USE_MAX_PODS=false" >> /etc/profile.d/bootstrap.sh
      - echo "export CONTAINER_RUNTIME=containerd" >> /etc/profile.d/bootstrap.sh
      - sed -i '/^set -o errexit/a\\nsource /etc/profile.d/bootstrap.sh' /etc/eks/bootstrap.sh

  - name: workspaces
    amiFamily: Ubuntu2004
    spot: false
    instanceTypes: ["m6i.2xlarge"]
    desiredCapacity: 2
    minSize: 1
    maxSize: 10
    maxPodsPerNode: 110
    disableIMDSv1: false
    volumeSize: 300
    volumeType: gp3
    volumeIOPS: 6000
    volumeThroughput: 500
    ebsOptimized: true
    privateNetworking: true
    propagateASGTags: true

    iam:
      attachPolicyARNs:
        - arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
        - arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy
        - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
        - arn:aws:iam::aws:policy/ElasticLoadBalancingFullAccess
        - arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
      withAddonPolicies:
        albIngress: true
        autoScaler: true
        cloudWatch: true
        ebs: true

    tags:
      k8s.io/cluster-autoscaler/enabled: "true"
      k8s.io/cluster-autoscaler/gitpod: "owned"

    labels:
      gitpod.io/workload_workspace_regular: "true"
      gitpod.io/workload_workspace_services: "true"
      gitpod.io/workload_workspace_headless: "true"

    preBootstrapCommands:
      - echo "export USE_MAX_PODS=false" >> /etc/profile.d/bootstrap.sh
      - echo "export CONTAINER_RUNTIME=containerd" >> /etc/profile.d/bootstrap.sh
      - sed -i '/^set -o errexit/a\\nsource /etc/profile.d/bootstrap.sh' /etc/eks/bootstrap.sh
```

</details>

1. Use eksctl to deploy the cluster without the nodegroups using our `eks-gitpod-cluster.yml` file from above.

```
eksctl create cluster --config-file eks-gitpod-cluster.yml --without-nodegroup
```

2. Update the local kubectl configuration \*ensure you set the right `region`):

```
aws eks update-kubeconfig --name gitpod --region eu-west-2
```

Ensure kubectl is happy with the cluster (gitpod) we just created:

```
kubectl cluster-info
```

3. Now replace the network stack with calico which is required by Gitpod for networking overlay and policy as well as to ensure we have enough IPs:

```
kubectl delete daemonset -n kube-system aws-node
kubectl apply -f https://projectcalico.docs.tigera.io/manifests/calico-vxlan.yaml
kubectl -n kube-system set env daemonset/calico-node FELIX_AWSSRCDSTCHECK=Disable
```

4. With the networking in place, we can now provision the node groups, using the same `eks-gitpod-cluster.yml ` file:

```
eksctl create nodegroup -f eks-gitpod-cluster.yml
```

5. Once this completes, you can verify that the nodes are running:

```
kubectl get nodes
```

This should give you an output similar to:

```
NAME                                            STATUS   ROLES    AGE     VERSION
ip-192-168-112-142.eu-west-1.compute.internal   Ready    <none>   11m     v1.22.6-eks-7d68063
ip-192-168-118-119.eu-west-1.compute.internal   Ready    <none>   7m34s   v1.22.6-eks-7d68063
ip-192-168-153-136.eu-west-1.compute.internal   Ready    <none>   11m     v1.22.6-eks-7d68063
ip-192-168-156-195.eu-west-1.compute.internal   Ready    <none>   7m44s   v1.22.6-eks-7d68063
```

You should now have a cluster up and running that is ready for the next steps below.

</div>
</CloudPlatformToggle>
