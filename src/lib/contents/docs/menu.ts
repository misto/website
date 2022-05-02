import type { MenuStatus, MenuEntry } from "$lib/types/menu-entry.type";

function M(
  title: string,
  path: string,
  subMenu?: MenuEntry[],
  status?: MenuStatus
): MenuEntry {
  return {
    title,
    status,
    path: "/docs" + (path ? "/" + path : ""),
    subMenu,
  };
}

export const MENU: MenuEntry[] = [
  M("Introduction", ""),
  M("Quickstart", "quickstart"),
  M("Getting Started", "getting-started"),
  M("Configure", "configure", [
    M(".gitpod.yml", "config-gitpod-file"),
    // Why is this side bar name different to the title / URL?
    M("Configure Docker", "config-docker"),
    M("Start Tasks", "config-start-tasks"),
    M("Ports", "config-ports"),
    M("Prebuilds", "prebuilds"),
    M("Environment Variables", "environment-variables"),
    M("Network Bridging", "configure/tailscale"),
    M("Workspace Location", "checkout-location"),
    M("Browser Settings", "configure/browser-settings"),
    M("Dotfiles", "config-dotfiles", [], "beta"),
    M("Multi-Repo", "multi-repo-workspaces", [], "beta"),
  ]),
  M("Develop", "develop", [
    M("One workspace per task", "workspaces"),
    M("Life of a workspace", "life-of-workspace"),
    M("Contexts", "context-urls"),
    M("Collaboration & Sharing", "sharing-and-collaboration"),
    M("Teams & Projects", "teams-and-projects", [], "beta"),
    M("Create a team plan", "teams"),
  ]),
  M("IDEs & Editors", "ides-and-editors", [
    M("VS Code Browser", "ides-and-editors/vscode-browser"),
    M("VS Code Desktop", "ides-and-editors/vscode", [], "beta"),
    M("IntelliJ IDEA", "ides-and-editors/intellij", [], "beta"),
    M("GoLand", "ides-and-editors/goland", [], "beta"),
    M("PhpStorm", "ides-and-editors/phpstorm", [], "beta"),
    M("PyCharm", "ides-and-editors/pycharm", [], "beta"),
    M("CLion", "ides-and-editors/clion", [], "soon"),
    M("DataGrip", "ides-and-editors/datagrip", [], "soon"),
    M("Rider", "ides-and-editors/rider", [], "soon"),
    M("RubyMine", "ides-and-editors/rubymine", [], "soon"),
    M("WebStorm", "ides-and-editors/webstorm", [], "soon"),
    M("Local Companion", "ides-and-editors/local-companion", [], "beta"),
    M("JetBrains Gateway", "ides-and-editors/jetbrains-gateway", [], "beta"),
    M("VS Code Extensions", "ides-and-editors/vscode-extensions"),
    M("VS Code Settings Sync", "ides-and-editors/settings-sync"),
    M("Command Line (e.g. Vim)", "ides-and-editors/command-line", []),
    M(
      "Configure your IDE/editor",
      "ides-and-editors/configure-your-editor-ide",
      []
    ),
    M("FAQs", "ides-and-editors/faqs", []),
  ]),
  M("Integrations", "integrations", [
    M("GitLab", "gitlab-integration"),
    M("GitHub", "github-integration"),
    M("Bitbucket", "bitbucket-integration"),
    M("GitHub Enterprise", "github-enterprise-integration"),
    M("Bitbucket Server", "bitbucket-server-integration"),
    M("Browser Bookmarklet", "browser-bookmarklet"),
    M("Browser Extension", "browser-extension"),
  ]),
  M("Gitpod Self-Hosted", "self-hosted/latest", [
    M("Getting Started", "self-hosted/latest/getting-started"),
    M("Cluster Set-Up", "self-hosted/latest/cluster-set-up"),
    M("Required Components", "self-hosted/latest/required-components"),
    M("Advanced Installation", "self-hosted/latest/advanced"),
    M("Updating Gitpod", "self-hosted/latest/updating"),
    M("Troubleshooting", "self-hosted/latest/troubleshooting"),
    M("Telemetry", "self-hosted/latest/telemetry"),
  ]),
  M("References", "references", [
    M(".gitpod.yml", "references/gitpod-yml"),
    M("Command Line Interface", "command-line-interface"),
    // M("Custom Docker image", "references/gitpod-dockerfile"),
    // M("Architecture", "references/architecture"),
    M("Languages & Framework", "languages-and-frameworks"),
    M("Roadmap", "references/roadmap"),
  ]),
  M("Contribute", "contribute", [
    M("Documentation", "contribute/documentation"),
    M("Features & Patches", "contribute/features-and-patches"),
  ]),
  M("Troubleshooting", "troubleshooting", []),
];

export interface MenuContext {
  prev?: MenuEntry;
  thisEntry?: MenuEntry;
  next?: MenuEntry;
}

export function getMenuContext(
  slug: string,
  menu: MenuEntry[] = MENU,
  context: MenuContext = {}
): MenuContext {
  for (const e of menu) {
    if (context.next) {
      return context;
    }
    if (context.thisEntry) {
      context.next = e;
      return context;
    } else if (e.path === slug) {
      context.thisEntry = e;
    } else {
      context.prev = e;
    }
    if (e.subMenu) {
      getMenuContext(slug, e.subMenu, context);
    }
  }
  return context;
}
