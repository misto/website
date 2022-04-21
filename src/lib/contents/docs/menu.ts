import type { MenuStatus, MenuEntry } from "$lib/types/menu-entry.type";

function M(
  title: string,
  isSubeMenuCategoryHeader: boolean,
  path: string,
  subMenu?: MenuEntry[],
  status?: MenuStatus
): MenuEntry {
  return {
    title,
    isSubeMenuCategoryHeader,
    status,
    path: path ? "/docs" + "/" + path : "",
    subMenu,
  };
}

export const MENU: MenuEntry[] = [
  M("Introduction", false, ""),
  M("Quickstart", false, "quickstart"),
  M("Getting Started", false, "getting-started"),
  M("Configure", false, "configure", [
    M(".gitpod.yml", false, "config-gitpod-file"),
    // Why is this side bar name different to the title / URL?
    M("Configure Docker", false, "config-docker"),
    M("Start Tasks", false, "config-start-tasks"),
    M("Ports", false, "config-ports"),
    M("Prebuilds", false, "prebuilds"),
    M("Environment Variables", false, "environment-variables"),
    M("Network Bridging", false, "configure/tailscale"),
    M("Workspace Location", false, "checkout-location"),
    M("Browser Settings", false, "configure/browser-settings"),
    M("Dotfiles", false, "config-dotfiles", [], "beta"),
    M("Multi-Repo", false, "multi-repo-workspaces", [], "beta"),
  ]),
  M("Develop", false, "develop", [
    M("One workspace per task", false, "workspaces"),
    M("Life of a workspace", false, "life-of-workspace"),
    M("Contexts", false, "context-urls"),
    M("Collaboration & Sharing", false, "sharing-and-collaboration"),
    M("Teams & Projects", false, "teams-and-projects", [], "beta"),
    M("Create a team plan", false, "teams"),
  ]),
  M("IDEs & Editors", false, "ides-and-editors", [
    M("VS Code Browser", false, "ides-and-editors/vscode-browser"),
    M("VS Code Desktop", false, "ides-and-editors/vscode", [], "beta"),
    M("IntelliJ IDEA", false, "ides-and-editors/intellij", [], "beta"),
    M("GoLand", false, "ides-and-editors/goland", [], "beta"),
    M("PhpStorm", false, "ides-and-editors/phpstorm", [], "beta"),
    M("PyCharm", false, "ides-and-editors/pycharm", [], "beta"),
    M("CLion", false, "ides-and-editors/clion", [], "soon"),
    M("DataGrip", false, "ides-and-editors/datagrip", [], "soon"),
    M("Rider", false, "ides-and-editors/rider", [], "soon"),
    M("RubyMine", false, "ides-and-editors/rubymine", [], "soon"),
    M("WebStorm", false, "ides-and-editors/webstorm", [], "soon"),
    M("Local Companion", false, "ides-and-editors/local-companion", [], "beta"),
    M("JetBrains Gateway", false, "ides-and-editors/jetbrains-gateway", []),
    M("VS Code Extensions", false, "ides-and-editors/vscode-extensions"),
    M("Command Line (e.g. Vim)", false, "ides-and-editors/command-line", []),

    M(
      "Configure your IDE/editor",
      false,
      "ides-and-editors/configure-your-editor-ide",
      []
    ),
  ]),
  M("Integrations", false, "integrations", [
    M("GitLab", false, "gitlab-integration"),
    M("GitHub", false, "github-integration"),
    M("Bitbucket", false, "bitbucket-integration"),
    M("GitHub Enterprise", false, "github-enterprise-integration"),
    M("Browser Bookmarklet", false, "browser-bookmarklet"),
    M("Browser Extension", false, "browser-extension"),
  ]),
  M("Gitpod Self-Hosted", false, "self-hosted/latest", [
    M("Example Section", true, ""),
    M("Requirements", false, "self-hosted/latest/requirements"),
    M("Installation", false, "self-hosted/latest/installation"),
    M("Releases", false, "self-hosted/latest/releases"),
  ]),
  M("References", false, "references", [
    M(".gitpod.yml", false, "references/gitpod-yml"),
    M("Command Line Interface", false, "command-line-interface"),
    // M("Custom Docker image",false, "references/gitpod-dockerfile"),
    // M("Architecture",false, "references/architecture"),
    M("Languages & Framework", false, "languages-and-frameworks"),
    M("Roadmap", false, "references/roadmap"),
  ]),
  M("Contribute", false, "contribute", [
    M("Documentation", false, "contribute/documentation"),
    M("Features & Patches", false, "contribute/features-and-patches"),
  ]),
  M("Troubleshooting", false, "troubleshooting", []),
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
