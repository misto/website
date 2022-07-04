---
layout: false
---

<script lang="ts">
  import CloudPlatformToggle from "$lib/components/docs/cloud-platform-toggle.svelte";
</script>

For each Gitpod installation, you need a **domain**. In this guide, we use `gitpod.example.com` as a placeholder for your domain. Gitpod also uses different subdomains for some components as well as dynamically for the running workspaces. That's why you need to configure your DNS server and your TLS certificates for your Gitpod domain to the following wildcards:

```
gitpod.example.com
*.gitpod.example.com
*.ws.gitpod.example.com
```

The entry point for all traffic is the `proxy` component which has a service of type `LoadBalancer` that allows inbound traffic on ports 80 (HTTP) and 443 (HTTPS) as well as port 22 (SSH access to the workspaces).

SSH access is required to work with desktop IDEs, such as [VS Code Desktop](/docs/ides-and-editors/vscode) and JetBrains via [JetBrains Gateway](/docs/ides-and-editors/jetbrains-gateway). To enable SSH, you'll need to create a **load balancer** capable of working with [L4 protocols](https://en.wikipedia.org/wiki/OSI_model#Layer_4:_Transport_layer).

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

The VPC needs public and private subnets. All managed node groups and Gitpod services should run in the private subnet. Inbound access to the services should be through ALB/ELB services auto-provisioned by AWS based on the configuration used (standard LoadBalancer roles or creation of an Ingress). If running a jump host or vpn endpoint, it should be deployed in the public subnet.

If installing Calico, follow their [installation steps](https://projectcalico.docs.tigera.io/getting-started/kubernetes/managed-public-cloud/eks) and ensure you modify the `hostNetwork: True` option on the cert-manager installation options later.

</div>
</CloudPlatformToggle>

You also need to configure your **DNS server**. If you have your own DNS server for your domain, make sure the domain with all wildcards points to your load balancer.

<CloudPlatformToggle id="cloud-platform-toggle-dns">
<div slot="gcp">

In this reference architecture, we use [Google Cloud DNS](https://cloud.google.com/dns) for domain name resolution. To automatically configure Cloud DNS, we use [External DNS for Kubernetes](https://github.com/kubernetes-sigs/external-dns).

First, we need a **service account** with role `roles/dns.admin`. This service account is needed by cert-manager to alter the DNS settings for the DNS-01 resolution.

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

In this reference architecture, we use cert-manager to also create **TLS certificates for the Gitpod domain**. Since we need wildcard certificates for the subdomains, you must use the [DNS-01 challenge](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge). In case you already have TLS certificates for your domain, you can skip this step and use your own certificates during the installation.

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

If using eksctl and the cert-manager service account along with well-known policies AND have your intended zone hosted in Route53, then follow the [cert-manager](https://cert-manager.io/docs/configuration/acme/dns01/route53/) configuration steps. An example ClusterIssuer is below.

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
