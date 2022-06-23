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

Provided below is a complete eksctl configuration file that will deploy all the components required for an EKS installation to support Gitpod. All references to an `gitpod-cluster.yaml` file refer to this reference.

`eksctl` will be configuring the VPC and networking along with creating the EKS cluster itself, if you need to use pre-existing networking provisioned by another team or department, refer to the [custom vpc documentation](https://eksctl.io/usage/vpc-networking/#use-existing-vpc-other-custom-configuration).

**Note on AMI Usage**
In this reference example the Ubuntu2004 amiFamily is used instead of listing a specific AMI ID. This is for portability of the reference document. If you wish to ensure you nodegroups continue to use the identical image instead of the latest at time of launch, replace `amiFamily: Ubuntu2004` with `ami: ami-customid` where `ami-customid` is from Ubuntu's EKS AMI list or the output from this command:

```sh
aws ec2 describe-images --owners 099720109477 \
    --filters 'Name=name,Values=ubuntu-eks/k8s_1.22/images/*' \
    --query 'sort_by(Images,&CreationDate)[-1].ImageId'  \
    --executable-users all \
    --output text --region us-west-2
```
Refer to eksctl's documentation on [AMI Family](https://eksctl.io/usage/custom-ami-support/) for more information on it's behavior.

**gitpod-cluster.yaml**
```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: gitpod
  region: eu-west-1
  version: "1.22"
  # update tags to ensure all generated resources have atleast these tags applied
  tags:
    department: cs
    project: gitpod

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

# Uncomment and update for your region if you wish to use fewer availability zones
# availabilityZones:
#   - eu-west-1a
#   - eu-west-1b
#   - eu-west-1c

# By default we create a dedicated VPC for the cluster
# You can use an existing VPC by supplying private and/or public subnets. Please check
# https://eksctl.io/usage/vpc-networking/#use-existing-vpc-other-custom-configuration
vpc:
  autoAllocateIPv6: false
  nat:
    # For production environments use HighlyAvailable, for an initial deployment Single adequate
    # HighlyAvailable will consume 3 Elastic IPs so ensure your region has capacity before using
    # https://eksctl.io/usage/vpc-networking/#nat-gateway
    gateway: Single

  # Cluster endpoints and public access
  # Private access ensures that nodes can communicate internally in case of NAT failure
  # For customizing for your environment review https://eksctl.io/usage/vpc-cluster-access/
  clusterEndpoints:
    privateAccess:  true
    publicAccess: true 
  publicAccessCIDRs: ["0.0.0.0/0"]
  
 
# Logging settings
cloudWatch:
  clusterLogging:
    enableTypes: ["*"]


# Nodegroups / Compute settings
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

In order to ensure there are enough IPs and networking policy enforcement is in place, Gitpod suggests using Calico for networking. To enable Calico in an EKS installation it must be done after the control plane has been provisioned and before the nodegroups have been.

First: Run eksctl with the `--without-nodegroup` flag to provision just the control plane defined in the `gitpod-cluster.yaml`:
```
eksctl create cluster --without-nodegroup --config-file gitpod-cluster.yaml
```
After this command finishes, check that eksctl also created the kubeconfig properly by running the command `kubectl get pods -n kube-system`. If deployed correctly one should see the a list of pods in a pending state. If this works without error, continue to the next step to [install Calico](https://projectcalico.docs.tigera.io/getting-started/kubernetes/managed-public-cloud/eks).

To install Calico, first remove the default AWS provided networking component:
```
kubectl delete daemonset -n kube-system aws-node
```

Install the Tigera Operator, which will manage the Calico installation:
```
kubectl create -f https://projectcalico.docs.tigera.io/manifests/tigera-operator.yaml
```

Now configure Calico for EKS specific support with the following manifest / command:
```
kubectl create -f - <<EOF
kind: Installation
apiVersion: operator.tigera.io/v1
metadata:
  name: default
spec:
  kubernetesProvider: EKS
  cni:
    type: Calico
  calicoNetwork:
    bgp: Disabled
EOF
```

Once the kubectl command completes, you are ready to proceed with the next step of deploying the EKS nodegroups:
```
eksctl create nodegroup --config-file gitpod-cluster.yaml
```

You can verify that your installation was deployed properly with the custom kubectl command provided below which will let you review maxpods, kernel and containerd versions to ensure they are meeting [our minimum requirements](https://www.gitpod.io/docs/self-hosted/latest/cluster-set-up) as intended.

```
kubectl get nodes -o=custom-columns="NAME:.metadata.name,\
RUNTIME:.status.nodeInfo.containerRuntimeVersion,\
MAXPODS:.status.capacity.pods,\
KERNEL:.status.nodeInfo.kernelVersion,\
AMIFAMILY:.status.nodeInfo.osImage,\
K8S:.status.nodeInfo.kubeletVersion,\
AMI:.spec.providerID"
```



</div>
</CloudPlatformToggle>
