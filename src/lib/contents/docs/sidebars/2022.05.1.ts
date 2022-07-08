import type { MenuStatus, MenuEntry } from "$lib/types/menu-entry.type";

const version = `2022.05.1`;

function M(
  title: string,
  path: string,
  subMenu?: MenuEntry[],
  status?: MenuStatus
): MenuEntry {
  return {
    title,
    status,
    path: `/docs` + (path ? `/` + path : ``),
    subMenu,
  };
}

export const MENU: MenuEntry = M(
  `Gitpod Self-Hosted - v${version}`,
  `self-hosted/${version}`,
  [
    M(`Installation Guides`, `self-hosted/${version}/installation-guides`, [
      M(`Local Preview`, `self-hosted/${version}/local-preview`, [], `alpha`),
      M(`Getting Started`, `self-hosted/${version}/getting-started`),
      M(
        `Reference Architectures`,
        `self-hosted/${version}/reference-architecture`,
        [],
        `alpha`
      ),
      M(`Cluster Set-Up`, `self-hosted/${version}/cluster-set-up`),
      M(`Advanced Installation`, `self-hosted/${version}/advanced`),
    ]),
    M(`Operational Guides`, `self-hosted/${version}/operational-guides`, [
      M(`Updating`, `self-hosted/${version}/updating`),
      M(`Monitoring`, `self-hosted/${version}/monitoring`),
    ]),
    M(`Troubleshooting`, `self-hosted/${version}/troubleshooting`, [
      M(`Support Bundles`, `self-hosted/${version}/support-bundle`, []),
      M(`Support Patches`, `self-hosted/${version}/support-patches`, []),
    ]),
    M(`Reference`, `self-hosted/${version}/reference`, [
      M(`Required Components`, `self-hosted/${version}/required-components`),
      M(`Releases`, `self-hosted/${version}/releases`),
      M(`Telemetry`, `self-hosted/${version}/telemetry`),
    ]),
  ]
);
