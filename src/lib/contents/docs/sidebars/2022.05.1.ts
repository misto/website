import type { MenuStatus, MenuEntry } from "$lib/types/menu-entry.type";

const version = "2022.05.1";

function M(
  title: string,
  path: string,
  subMenu?: MenuEntry[],
  status?: MenuStatus
): MenuEntry {
  return {
    title,
    status,
    path: `/docs` + (path ? "/" + path : ""),
    subMenu,
  };
}

export const MENU: MenuEntry = M(
  "Gitpod Self-Hosted",
  `self-hosted/${version}`,
  [
    M(
      "Preview Installation",
      `self-hosted/${version}/preview-install`,
      [],
      "alpha"
    ),
    M("Getting Started", `self-hosted/${version}/getting-started`),
    M(
      "Reference Architectures",
      `self-hosted/${version}/reference-architecture`
    ),
    M("Cluster Set-Up", `self-hosted/${version}/cluster-set-up`),
    M("Required Components", `self-hosted/${version}/required-components`),
    M("Advanced Installation", `self-hosted/${version}/advanced`),
    M("Updating Gitpod", `self-hosted/${version}/updating`),
    M("Monitoring", `self-hosted/${version}/monitoring`),
    M("Troubleshooting", `self-hosted/${version}/troubleshooting`, [
      M("Support Bundles", `self-hosted/${version}/support-bundle`, []),
      M("Support Patches", `self-hosted/${version}/support-patches`, []),
    ]),
    M("Telemetry", `self-hosted/${version}/telemetry`),
    M("Releases", `self-hosted/${version}/releases`),
  ]
);
