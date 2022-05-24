---
section: self-hosted/latest
title: "Self-Hosted Reference Architecture"
---

<script context="module">
  export const prerender = true;
</script>

<script lang="ts">
  import CloudPlatformToggle from "$lib/components/docs/cloud-platform-toggle.svelte";
</script>

# Self-Hosted Reference Architecture

This guide describes a production-ready reference architecture for Gitpod. It consists of a Kubernetes cluster, cert-manager, external MySQL database, external OCI image registry, and external object storage. You will also find instructions on how to set up the reference architecture on different cloud platforms.

This reference architecture can be used as a blueprint for your Gitpod installation. Start with this reference architecture and adapt it to your needs. The reference architecture as described in this guide is what we support and what we test for every release.

To use Gitpod, you also need a Git source code management system (SCM) like GitLab, GitHub, or Bitbucket. You will find the supported SCMs on the [required components guide](../required-components). Installing your own SCM is beyond the scope of this guide. However, you can simply use the cloud versions of GitLab, GitHub, or Bitbucket as well as the possible existing installation in your corporate network.

You can also create a Kubernetes cluster on your bare metal servers for smaller setups. See the [K3s guide](../cluster-set-up/on-k3s) for more information.

## Overview

![Reference Architecture Overview](../../../static/images/docs/self-hosted/reference-architecture/ReferenceArchitecture.png)

The diagram above gives an overview of the reference architecture. Starting from the user’s workstation, access is provided using an L4 load balancer. An internal proxy distributes this traffic within Gitpod.

The cluster-external components are accessed by a specific set of components as shown in the diagram. The external components are:

- **MySQL database**
- **Source Control Management (SCM)**, e.g. GitLab, GitHub, GitHub Enterprise, BitBucket, or BitBucket Server
- **Object Storage**, e.g. Google Cloud Storage or Amazon S3
- **OCI Image Registry**, e.g. Google Artifact Registry or Amazon ECR.<br/>
  _Note: This registry is used by Gitpod to cache images, and store images it builds on behalf of users. This is **not** the registry that contains the images of Gitpod’s services._

In addition, the diagram indicates the different node pools within the cluster. Notice that we separate any user workloads from Gitpod’s services (with the exception of `ws-daemon`). In this reference architecture, we create two node pools: the services node pool (upper half in diagram) and the workspaces node pool (lower half in the diagram).

## Cloud Provider Preparations

To be able to replicate this reference architecture, you need to prepare your workstation and your cloud provider (e.g. creating a project and preparing service accounts).

Independent of the cloud provider you are using, you need to have `kubectl` installed on your workstation and configured to access your cluster after creation.

<CloudPlatformToggle id="cloud-platform-toggle-preparations">

<div slot="gcp">

In order to deploy Gitpod on the [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine) of the [Google Cloud Platform (GCP)](https://cloud.google.com/docs), you need to create and configure a project for your installation. In this guide, we give you examples of how to create the needed resources by using the command line tool `gcloud`. To follow these examples make sure you have [installed the `gcloud` CLI](https://cloud.google.com/sdk/docs/install) and [logged in to your Google Cloud account](https://cloud.google.com/sdk/gcloud/reference/auth/login). You can also use the [GCP Console](https://console.cloud.google.com/) or the API instead. In that case, please refer to the linked Google docs.

At first, [create a GCP project](https://cloud.google.com/resource-manager/docs/creating-managing-projects) and [enable billing](https://cloud.google.com/billing/docs/concepts) (you have to enable billing in order to enable GKE). You can freely choose a name for your project (hereinafter referred to as environment variable `PROJECT_NAME`). You also need the billing account ID (referred to as `BILLING_ACCOUNT`). To see available lDs, run [`gcloud alpha billing accounts list`](https://cloud.google.com/sdk/gcloud/reference/alpha/billing/accounts/list).

```
PROJECT_NAME=gitpod
gcloud projects create "${PROJECT_NAME}" --set-as-default

BILLING_ACCOUNT=0X0X0X-0X0X0X-0X0X0X
gcloud alpha billing projects link "${PROJECT_NAME}" \\
    --billing-account "${BILLING_ACCOUNT}"
```

You can verify that the proper project has been set as default with this command:

```
gcloud config get-value project
```

After you created your project, you need to enable the following services in this project:

| Services                         |                                                                                              |                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| cloudbilling.googleapis.com      | [Google Billing API](https://cloud.google.com/billing/docs/reference/rest)                   | Billing is required to set up a GKE cluster.                                                 |
| containerregistry.googleapis.com | [Docker container images registry](https://cloud.google.com/container-registry)              | Enable this service so that Gitpod can push the workspace images to that repository.         |
| iam.googleapis.com               | [Identity and Access Management (IAM) API](https://cloud.google.com/iam/docs/reference/rest) | To create and use service accounts for the setup.                                            |
| compute.googleapis.com           | [Google Compute Engine API](https://cloud.google.com/compute/docs/reference/rest/v1)         | The Google Compute Engine empowers to run virtual machines (VMs) for the Kubernetes cluster. |
| container.googleapis.com         | [Kubernetes Engine API](https://cloud.google.com/kubernetes-engine/docs/reference/rest)      | The Kubernetes engine is where we will deploy Gitpod to.                                     |
| dns.googleapis.com               | [Cloud DNS](https://cloud.google.com/dns/docs/reference/v1)                                  | Cloud DNS is used in this reference architecture so set up the domain name resolution.       |
| sqladmin.googleapis.com          | [Cloud SQL Admin API](https://cloud.google.com/sql/docs/mysql/admin-api)                     | Cloud SQL for MySQL is used as database service in this reference architecture.              |

Run these commands to enable the services:

```
gcloud services enable cloudbilling.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable dns.googleapis.com
gcloud services enable sqladmin.googleapis.com
```

Now, you are prepared to create your Kubernetes cluster.

</div>

<div slot="aws">

In order to deploy Gitpod on the [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/) of the [Amazon Web Service (AWS)](https://aws.amazon.com/), you need an AWS account. In this guide, we use [AWS CLI](https://aws.amazon.com/cli/) as well as [EKS CLI `eksctl`](https://eksctl.io/). Please refer to the docs on how to install these tools.

Make sure you are logged in and are connected to the proper AWS account. Ensure AWS is configured and working with the command `aws sts get-caller-identity`.

</div>

</CloudPlatformToggle>

## Kubernetes Cluster

The heart of this reference architecture is a **Kubernetes cluster** where all Gitpod components are deployed to. This cluster consists of two node pools:

1. **Services Node Pool**: On these nodes, the Gitpod “app” with all its services are deployed to. These services provide the users with the dashboard and manages the provisioning of workspaces.
2. **Workspaces Node Pool**: On the workspace nodes, Gitpod deploys the actual workspaces (where the actual developer work is happening). Because workspaces have vastly differing resource and security isolation requirements compared to Gitpod’s own services, they run on a dedicated node pool.

To enforce that the Gitpod components are scheduled to the proper node pools, you need to assign the following labels to the node pools:

| Node Pool            | Labels                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Services Node Pool   | `gitpod.io/workload_meta=true`,<br/>`gitpod.io/workload_ide=true`,<br/>`gitpod.io/workload_workspace_services=true` |
| Workspaces Node Pool | `gitpod.io/workload_workspace_regular=true`,<br/>`gitpod.io/workload_workspace_headless=true`                       |

The following table gives an overview of the node types for the different cloud providers that are used by this reference architecture.

|                      | GCP             | AWS           |
| -------------------- | --------------- | ------------- |
| Services Node Pool   | `n2-standard-4` | `m6i.xlarge`  |
| Workspaces Node Pool | `n2-standard-8` | `m6i.2xlarge` |

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
| Machine Type      | `n2-standard-4`                                                                                                                                 |
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
    --machine-type="n2-standard-4" \\
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

After that, you need to create cluster role bindings to allows the current user to create new RBAC rules.

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

## Networking

For each Gitpod installation, you need a **domain**. In this guide, we use `gitpod.example.com` as a placeholder for your domain. Gitpod also uses different subdomains for some components as well as dynamically for the running workspaces. That's why you need to configure your DNS server and your TLS certificates for your Gitpod domain to the following wildcards:

```
gitpod.example.com
*.gitpod.example.com
*.ws.gitpod.example.com
```

The entry point for all traffic is the `proxy` component which has a service of type `LoadBalancer` that allows inbound traffic on ports 80 (HTTP) and 443 (HTTPS) as well as port 22 (SSH access to the workspaces).

In order to support SSH access (which is also needed to work with desktop IDEs), you need to create a **load balancer** capable of working with [L4 protocols](https://en.wikipedia.org/wiki/OSI_model#Layer_4:_Transport_layer).

<CloudPlatformToggle id="cloud-platform-toggle-networking">
<div slot="gcp">

In this guide, we use [load balancing through a standalone network endpoint group (NEG)](https://cloud.google.com/kubernetes-engine/docs/how-to/standalone-neg). For this, the Gitpod proxy service will get the following annotation by default:

```
cloud.google.com/neg: '{"exposed_ports": {"80":{},"443": {}}}'
```

For Gitpod, we support Calico as CNI only. You need to make sure that you DO NOT use [GKE Dataplan V2](https://cloud.google.com/kubernetes-engine/docs/concepts/dataplane-v2). That means, don't add the `--enable-dataplane-v2` flag the during the cluster creation.

</div>
<div slot="aws">

It is suggested to create a dedicated VPC (and EKS instance) for Gitpod. eksctl can do this for you, but if VPCs have to be configured separately, follow eksctl’s [suggestions](https://eksctl.io/usage/vpc-configuration/).

- You also customize eksctl’s [vpc](https://eksctl.io/usage/vpc-subnet-settings/#custom-subnet-topology) creation to suit your existing configurations.

The VPC has a public and private side. All managed node groups and Gitpod services run in the private side. Inbound access to the services is through ALB/ELB services auto-provisioned by AWS based on the configuration used (standard LoadBalancer roles or creation of an Ingress). If running a separate jump host or vpn endpoint, it should be deployed in the public interface.

If installing Calico, follow their [installation steps](https://projectcalico.docs.tigera.io/getting-started/kubernetes/managed-public-cloud/eks) and ensure you modify the `hostNetwork: True` option on the cert-manager installation options later.

</div>
</CloudPlatformToggle>

You also need to configure your **DNS server**. If you have your own DNS server for your domain, make sure the domain with all wildcards points to your load balancer.

<CloudPlatformToggle id="cloud-platform-toggle-dns">
<div slot="gcp">

In this reference architecture, we use [Google Cloud DNS](https://cloud.google.com/dns) for domain name resolution. To automatically configure Cloud DNS, we use [External DNS for Kubernetes](https://github.com/kubernetes-sigs/external-dns).

At first, we need a **service account** with role `roles/dns.admin`. This service account is needed by cert-manager to alter the DNS settings for the DNS-01 resolution.

```
DNS_SA=gitpod-dns01-solver
DNS_SA_EMAIL="${DNS_SA}"@"${PROJECT_NAME}".iam.gserviceaccount.com
gcloud iam service-accounts create "${DNS_SA}" --display-name "${DNS_SA}"
gcloud projects add-iam-policy-binding "${PROJECT_NAME}" \\
    --member serviceAccount:"${DNS_SA_EMAIL}" --role="roles/dns.admin"
```

Save the service account key to the file `./dns-credentials.json`:

```
gcloud iam service-accounts keys create --iam-account "${DNS_SA_EMAIL}" \\
    ./dns-credentials.json
```

After that, we create a [managed zone](https://cloud.google.com/dns/docs/zones).

```
DOMAIN=gitpod.example.com
gcloud dns managed-zones create "${CLUSTER_NAME}" \\
    --dns-name "${DOMAIN}." \\
    --description "Automatically managed zone by kubernetes.io/external-dns"
```

Now we are ready to install External DNS. Please refer to the [External DNS GKE docs](https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/gke.md).

<details>
  <summary  class="text-p-medium">Example on how to install External DNS with helm</summary>

```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm upgrade \\
    --atomic \\
    --cleanup-on-fail \\
    --create-namespace \\
    --install \\
    --namespace external-dns \\
    --reset-values \\
    --set provider=google \\
    --set google.project="${PROJECT_NAME}" \\
    --set logFormat=json \\
    --set google.serviceAccountSecretKey=dns-credentials.json \\
    --wait \\
    external-dns \\
    bitnami/external-dns
```

</details>

Depending on how your DNS setup for your domain looks like, you most probably want to configure the nameservers for your domain. Run the following command to get a list of nameservers used by your Cloud DNS setup:

```
gcloud dns managed-zones describe ${CLUSTER_NAME} --format json | jq '.nameServers'
```

</div>
<div slot="aws">

</div>
</CloudPlatformToggle>

Gitpod secures its internal communication between components with **TLS certificates**. You need to have a **[cert-manager](https://cert-manager.io/)** instance in your cluster that is responsible for issuing these certificates. There are different ways to install cert-manager. If you don’t have a cert-manager instance in your cluster, please refer to the [cert-manager docs](https://cert-manager.io/docs/) to choose an installation method.

<details>
  <summary  class="text-p-medium">Example on how to install cert-manager with helm</summary>

```
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm upgrade \\
    --atomic \\
    --cleanup-on-fail \\
    --create-namespace \\
    --install \\
    --namespace cert-manager \\
    --reset-values \\
    --set installCRDs=true \\
    --set 'extraArgs={--dns01-recursive-nameservers-only=true,--dns01-recursive-nameservers=8.8.8.8:53\,1.1.1.1:53}' \\
    --wait \\
    cert-manager \\
    jetstack/cert-manager
```

</details>

In addition to the internal communication, in this reference architecture, we use cert-manager also to create **TLS certificates for the Gitpod domain**. Since we need wildcard certificates for the subdomains, you must use the [DNS-01 challenge](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge). In case you already have TLS certificates for your domain, you can skip this step and use your own certificates during the installation.

<CloudPlatformToggle id="cloud-platform-toggle-cert-manager-tls">
<div slot="gcp">

Now, we are configuring [Google Cloud DNS for the DNS-01 challenge](https://cert-manager.io/docs/configuration/acme/dns01/google/). For this, we need to create a secret that contains the key for the DNS service account:

```
CLOUD_DNS_SECRET=clouddns-dns01-solver
kubectl create secret generic "${CLOUD_DNS_SECRET}" \\
    --namespace=cert-manager \\
    --from-file=key.json="./dns-credentials.json"
```

After that, we are telling cert-manager which service account it should use:

```
kubectl annotate serviceaccount --namespace=cert-manager cert-manager \\
    --overwrite "iam.gke.io/gcp-service-account=${DNS_SA_EMAIL}"
```

The next step is to create an issuer. In this guide, we create a cluster issuer. Create a file `issuer.yaml` like this:

```yaml
# Replace $LETSENCRYPT_EMAIL with your email and $PROJECT_NAME with your GCP project name
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: gitpod-issuer
spec:
  acme:
    email: $LETSENCRYPT_EMAIL
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: issuer-account-key
    solvers:
      - dns01:
          cloudDNS:
            project: $PROJECT_NAME
```

… and run:

```
kubectl apply -f issuer.yaml
```

</div>
<div slot="aws">

If using eksctl and the cert-manager service account along with well known policies AND have your intended zone hosted in Route53, then follow the [cert-manager](https://cert-manager.io/docs/configuration/acme/dns01/route53/) configuration steps. An example ClusterIssuer is below.

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    solvers:
      - selector:
          dnsZones:
            - "example.com"
        dns01:
          route53:
            region: us-east-1
            hostedZoneID: HJKDSFH7823 # optional, see policy above
            role: arn:aws:iam::YYYYYYYYYYYY:role/dns-manager
```

In using this example, one would use `letsencrypt-pod` in the Gitpod self hosted installer page when asked for the name of the certificate issuer.

</div>
</CloudPlatformToggle>

## OCI Image Registry

Kubernetes clusters pull their components from an **image registry**. In Gitpod, image registries are used for three different purposes:

1. Pulling the actual Gitpod software (components like `server`, `image-builder`, etc.).
2. Pulling base images for workspaces. This is either a default [workspace-full](https://hub.docker.com/r/gitpod/workspace-full) image or the image that is configured in the `.gitpod.yml` resp. `.gitpod.Dockerfile` in the repo.
3. Pushing individual workspace images that are built for workspaces during image start. That are for example custom images that are defined in a `.gitpod.Dockerfile` in the repo. These images are pulled by Kubernetes after image building to provision the workspace. This is the only case where Gitpod needs write access to push images.

In this reference architecture, we use a different registry for each of the three items. The Gitpod images (1) are pulled from a public Google Container Registry we provide. The workspace base image (2) is pulled from Docker Hub (or from the location that is set in the Dockerfile of the corresponding repo). For the individual workspace images (3), we create an image registry that is provided by the used cloud provider. You could also configure Gitpod to use the same registry for all cases. That is particularly useful for [air-gap installations](../advanced/air-gap) where you have access to an internal image registry only.

<CloudPlatformToggle id="cloud-platform-toggle-registry">
<div slot="gcp">

By enabling the service `containerregistry.googleapis.com` (see above), your project provides you with an OCI Image Registry. As credentials, we need the [object storage](#object-storage) service account key that we will create below. Therefore, there is no further action needed to use the registry in Gitpod.

</div>
<div slot="aws"></div>
</CloudPlatformToggle>

## Database

Gitpod uses a **relational database management system** to store structural data. Gitpod supports MySQL. The database is a central component in Gitpod where all metadata about users and workspaces as well as settings of the Gitpod instance (as auth providers) are stored. That makes the database a critical component. In case of a database outage, you are not able to log in, use the Gitpod dashboard, or start workspaces.

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

## Object Storage

Gitpod uses an **object storage** to store blob data. This includes workspace backups that will be created when a workspace stops and will be restored when an existing workspace will be restarted as well as different user settings like IDE preferences.

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
</div>
</CloudPlatformToggle>

## Install Gitpod

Congratulations. You have set up your cluster. Now, you are ready to install Gitpod. Follow the instructions of [step 4 of the Getting Started Guide](../getting-started#step-4-install-gitpod).

<CloudPlatformToggle id="cloud-platform-toggle-install">
<div slot="gcp">

If you followed the steps to create your infastructure on GCP of this guide, you need to use the following config settings for your Gitpod installation:

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
| Issuer name                 | `gitpdo-issuer`         |
| Issuer type                 | Select “cluster issuer” |

</div>

<div slot="aws"></div>
</CloudPlatformToggle>
