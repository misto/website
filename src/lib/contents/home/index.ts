import type { Brand } from "$lib/types/brand.type";
import type { Project } from "$lib/types/project.type";
import type { Testimonial } from "$lib/types/testimonial.type";
import type { Ide } from "$lib/types/ide.type";
import GitlabLogo from "$lib/components/svgs/brands/gitlab-logo.svelte";
import FreecodecampLogo from "$lib/components/svgs/brands/freecodecamp.svelte";
import Google from "$lib/components/svgs/brands/google.svelte";
import Uber from "$lib/components/svgs/brands/uber.svelte";
import Datastax from "$lib/components/svgs/brands/datastax.svelte";
import Amazon from "$lib/components/svgs/brands/amazon.svelte";
import Shares from "$lib/components/svgs/brands/shares.svelte";
import Astrato from "$lib/components/svgs/brands/astrato.svelte";
import CodeInstitute from "$lib/components/svgs/brands/code-institute.svelte";
import Redwood from "$lib/components/svgs/brands/redwood.svelte";
import Jetbrains from "$lib/components/svgs/brands/jetbrains.svelte";
import FourGeeks from "$lib/components/svgs/brands/fourgeeks.svelte";
import type { Card } from "$lib/types/card.type";

export const gitlab: Brand = {
  alt: "GitLab",
  logo: GitlabLogo,
};

export const freeCodeCamp: Brand = {
  alt: "freeCodeCamp",
  logo: FreecodecampLogo,
  transform: "scale(1.1)",
};

export const google: Brand = {
  alt: "Google",
  logo: Google,
  transform: "scale(0.9)",
};

export const uber: Brand = {
  alt: "Uber",
  logo: Uber,
  transform: "scale(.8)",
};

export const dataStax: Brand = {
  alt: "DataStax",
  logo: Datastax,
  transform: "scale(1.1)",
};

export const amazon: Brand = {
  alt: "Amazon",
  logo: Amazon,
  transform: "scale(0.9) translateY(5px)",
};

export const shares: Brand = {
  alt: "Shares",
  logo: Shares,
  transform: "scale(1.1)",
};

export const astrato: Brand = {
  alt: "Astrato",
  logo: Astrato,
  transform: "scale(1.1)",
};

export const redwood: Brand = {
  alt: "Redwood",
  logo: Redwood,
  transform: "scale(1.1)",
};

export const codeInstitute: Brand = {
  alt: "Code Institute",
  logo: CodeInstitute,
};

export const jetbrains: Brand = {
  logo: Jetbrains,
  alt: "JetBrains",
};

export const fourGeeks: Brand = {
  logo: FourGeeks,
  alt: "Four Geeks",
};

export const brands: Brand[] = [
  gitlab,
  freeCodeCamp,
  google,
  uber,
  dataStax,
  amazon,
  shares,
  astrato,
  redwood,
  codeInstitute,
];

export const logosAnimated: Brand[] = [
  gitlab,
  jetbrains,
  google,
  redwood,
  uber,
  shares,
  dataStax,
  freeCodeCamp,
  amazon,
  astrato,
  fourGeeks,
  codeInstitute,
];

export const projects: Project[] = [
  {
    logo: "svg/projects/ts.svg",
    title: "Node or TypeScript",
    githubUrl: "https://github.com/gitpod-io/example-typescript-node",
    alt: "Node or TypeScript",
    trackingName: "node-typescript",
  },
  {
    logo: "svg/projects/python.svg",
    title: "Python",
    githubUrl: "https://github.com/gitpod-io/example-python-django",
    alt: "Python",
    trackingName: "python",
  },
  {
    logo: "svg/projects/go.svg",
    title: "Golang",
    githubUrl: "https://github.com/gitpod-io/example-golang-cli",
    alt: "Golang",
    trackingName: "go",
  },
  {
    logo: "svg/projects/rust.svg",
    title: "Rust",
    githubUrl: "https://github.com/gitpod-io/example-rust-cli",
    alt: "Rust",
    trackingName: "rust",
  },
  {
    logo: "svg/projects/java.svg",
    title: "Java",
    githubUrl: "https://github.com/gitpod-io/spring-petclinic",
    gitlabUrl: "https://gitlab.com/gitpod/spring-petclinic",
    bitbucketUrl: "https://bitbucket.org/gitpod/spring-petclinic",
    alt: "Java",
    trackingName: "java",
  },
  {
    logo: "svg/projects/svelte.svg",
    title: "Svelte",
    githubUrl: "https://github.com/gitpod-io/sveltejs-template",
    alt: "Svelte",
    trackingName: "svelte",
  },
  // {
  //   logo: "svg/projects/php.svg",
  //   title: "PHP & Symfony",
  //   githubUrl: "https://github.com/gitpod-io/symfony-demo",
  //   alt: "PHP",
  // },
  // {
  //   logo: "svg/projects/dotnet-core.svg",
  //   title: ".NET Core",
  //   githubUrl: "https://github.com/gitpod-io/example-dotnet-core",
  //   gitlabUrl: "https://gitlab.com/gitpod/dotnetcore",
  //   bitbucketUrl: "https://bitbucket.org/gitpod/dotnetcore",
  //   alt: "C#",
  // },
  // {
  //   logo: "python.png",
  //   title: "Python & Flask",
  //   githubUrl: "https://github.com/breatheco-de/python-flask-api-tutorial",
  //   alt: "Python",
  // },
  // {
  //     logo: 'ruby.png',
  //     title: 'Rails & Postgres',
  //     githubUrl: "https://github.com/gitpod-io/ruby-on-rails",
  //     gitlabUrl: "https://gitlab.com/gitpod/rails",
  //     bitbucketUrl: "https://bitbucket.org/gitpod/ruby-on-rails",
  //     alt: "Ruby",
  // },
];

export const testimonials: Testimonial[] = [
  {
    name: "Ben Halpern",
    avatar: "ben-halpern.jpg",
    org: `<span>
          @forem
        </span>
        and
        <span>
          @ThePracticalDev
        </span>`,
    role: "Creator and Co-founder",
    text: `
      <p>GitPod is incredibly cool.</p>
      <p>In my opinion, this is a big step in open source software contribution. I'm excited to see where we go from here.</p>
    `,
    twitterHandle: "bendhalpern",
    tweetId: "1115274432958930946",
  },
  {
    name: "Michael Friedrich",
    avatar: "michael-friedrich.jpg",
    org: `<span>
        @GitLab
      </span>`,
    role: "Developer Evangelist",
    text: `
        <p>
          Let's say we were overwhelmed how smooth @gitpod workspaces creation & own Docker image for workspaces worked.
        </p>
        <p>
          Plus, installing @code extensions from the store and integrating @gitlab CI. That blew my mind entirely, and that is hard ;)
        </p>
      `,
    twitterHandle: "dnsmichi",
    tweetId: "1311560585717460992",
  },
  {
    name: "Julius Volz",
    avatar: "julius-volz.jpg",
    org: `<span>
        @PrometheusIO
      </span>`,
    role: "Creator",
    text: `
      <p>
        Look at any PR (pull request) in a full coding environment where you can edit, build, and test the PR code, by just prepending "gitpod.io#" to the PR URL. Super useful for reviewing/testing stuff without having to check it out locally!
      </p>
      `,
    twitterHandle: "juliusvolz",
    tweetId: "1298972181708275717",
  },
  {
    name: "David Ressler",
    avatar: "david-ressler.jpg",
    org: `
      <span>
        @instagram
      </span>
    `,
    role: "Engineering Manager",
    text: `
        <p>
          I think I’m in love with @gitpod. It’s such a powerful tool. I’ve learned so much in the past week
          just from stumbling across Github repos that interest me and appending
          “http://gitpod.io/#” to the URL. A+ tool all around.
        </p>
      `,
    twitterHandle: "DavidRessler",
    tweetId: "1191710936605831169",
  },
  {
    name: "Bartłomiej Płotka",
    avatar: "bwplotka.jpg",
    org: `
      <span>
        @RedHat
      </span>
    `,
    role: "Principal Software Engineer",
    text: `
        <div>
          <p>
            This @gitpod thing is magic! Pretty cool, without any extra configuration. Good work!
          </p>

          <p>https://gitpod.io/#https://github.com/thanos-io/thanos</p>
        </div>
      `,
    twitterHandle: "bwplotka",
    tweetId: "1387735880853606402",
  },
  {
    name: "Mrugesh Mohapatra",
    avatar: "mrugesh-mohapatra.jpg",
    org: `
      <span>
        @freeCodeCamp
      </span>
    `,
    role: "Technology & Community",
    text: `
      <p>
          Ya'all @gitpod is freaking amazing! We integrated it into our workflow for working on @freeCodeCamp's codebase and I am honestly loving it. 🔥🔥!
          <br />
          Go check it out on our repo https://github.com/freeCodeCamp/f... now!
        </p>
    `,
    twitterHandle: "raisedadead",
    tweetId: "1167463499779338243",
  },
  {
    name: "Sven Peters",
    avatar: "sven-peters.jpg",
    org: `
      <span>
        @MongoDB
      </span>
    `,
    role: "Dev Advocate",
    text: `
      <p>
          Huge time saver, less frustrations for devs: Automated ready-to-code
          dev environments with pre-build workspaces. #gitpod #cloudide
        </p>
    `,
    twitterHandle: "svenpet",
    tweetId: "1159698330764611584",
  },
  {
    name: "Jonathan Lister Parsons",
    avatar: "jonathan-lister-parsons.jpg",
    org: `
      <span>
        @PensionBee
      </span>
    `,
    role: "CTO",
    text: `
        <p>
          I'm really enjoying @gitpod - for me, it's made full-stack development in the browser (yes,including mobile) a reality
        </p>
      `,
    twitterHandle: "jayfresh",
    tweetId: "1217728632887611397",
  },
  {
    name: "Alejandro",
    avatar: "alejandro-sanchez.jpeg",
    org: `
      <span>
        @4GeeksAcademy
      </span>
    `,
    role: "Co-Founder",
    text: `
        <p>
          My setup is on @gitpod, just like Christopher McCandless, where I go my code goes with me,
          no setup whatsoever Smiling face with sunglasses 😎 #IntoTheWild
        </p>
      `,
    twitterHandle: "alesanchezr",
    tweetId: "1247219573767667715",
  },
  {
    name: "ROKU",
    avatar: "roman-kuba.jpg",
    org: `
      <span>
        @GitLab
      </span>
    `,
    role: "Engineering Manager",
    text: `
        <p>
          Have to say that @gitpod is just super nice to use. Very impressed by the performance!
        </p>
    `,
    twitterHandle: "Codebryo",
    tweetId: "1331252316255768578",
  },
  {
    name: "Hugh Durkin",
    avatar: "hugh-durkin.jpg",
    org: `
      <span>
        @HubSpot
      </span>
    `,
    role: "Platform Ecosystem",
    text: `
        <p>
          I've been playing around with the "next generation" of Cloud IDEs
          lately, and @gitpodio is quickly emerging as one of the best 👨‍💻 <br /> Awesome @github integration, slick Chrome extension, and super fast 🚀
          https://gitpod.io/index.html
        </p>
      `,
    twitterHandle: "hughdurkin",
    tweetId: "1102215129696010240",
  },
  {
    name: "Marcel van Remmerden",
    avatar: "marcel-van-remmerden.jpg",
    org: `
      <span>
        @GitLab
      </span>
    `,
    role: "Product Design Manager",
    text: `<p>
          Can only agree, opening a GitLab repository in gitpod is a magical
          experience, thanks for the integration @gitpod!
        </p>`,
    twitterHandle: "MvRemmerden",
    tweetId: "1215707492740739072",
  },
  {
    name: "Brendan O’Leary",
    avatar: "brendan-o-leary.jpg",
    org: `
      <span>
        @GitLab
      </span>
    `,
    role: "Dev. Evangelist",
    text: `
        <p>
          I just discovered the @gitlab @gitpod integration is alive on http://GitLab.com (released in 13.4 behind a feature flag). And it's AMAZING https://docs.gitlab.com/ee/integration....
          .
        </p>
        <p>Now I can code from *anywhere*</p>
      `,
    twitterHandle: "olearycrew",
    tweetId: "1310376245629198341",
  },
  {
    name: "Joonas Lehtinen",
    avatar: "joonas-lehtinen.png",
    org: `
      <span>
        @vaadin
      </span>
    `,
    role: "Co-founder",
    text: `
        <p>
          Wow - @gitpod is a brilliant way of evaluating a framework without installing anything.
        </p>
        <p>
          Launch gitpod for @vaadin at https://vaadin.com/start/v14 ("Online workspace" tab). You'll have app running and will be editing code in 3min from clicking "Launch" button.
        </p>
    `,
    twitterHandle: "joonaslehtinen",
    tweetId: "1238597160121200640",
  },
  {
    name: "Yo",
    avatar: "yogi.jpg",
    org: `
      <span>
        @Taskord
      </span>
    `,
    role: "Creator",
    text: `
        <p>
          Now contributing to @gitlab is a cakewalk with @gitpod 🎉!
        </p>
        <p>Already started my game! #100DaysOfCode</p>
      `,
    twitterHandle: "big1nt",
    tweetId: "1317483426421776385",
  },
  {
    name: "Senior Enterprise Geek",
    avatar: "k33g.jpg",
    org: `
      <span>
        @GitLab
      </span>
    `,
    role: "Senior Technical Account Manager",
    text: `
        <p>
          Today is a great day, we added the @gitpod support to the @golo_lang repository. So now you can start hacking @golo_lang in almost only one click. Enjoy 🎉
        </p>
        <p>gitpod.io/#https://githu...</p>
      `,
    twitterHandle: "k33g_org",
    tweetId: "1329461150422065152",
  },
];

export const ides: Ide[] = [
  {
    name: "vscode",
    label: "Visual Studio Code",
    screenshots: {
      desktop: "vscode-desktop.png",
      browser: "vscode-browser.png",
    },
    icon: "vscode.svg",
  },
  {
    name: "goland",
    availibility: "beta",
    label: "Goland",
    screenshots: {
      desktop: "goland.png",
    },
    icon: "goland.svg",
  },
  {
    name: "intellij",
    availibility: "beta",
    label: "IntelliJ IDEA",
    screenshots: {
      desktop: "intellij.png",
    },
    icon: "intellij.svg",
  },
  {
    name: "pycharm",
    availibility: "beta",
    label: "PyCharm",
    screenshots: {
      desktop: "pycharm.png",
    },
    icon: "pycharm.svg",
  },
  {
    name: "phpstorm",
    availibility: "beta",
    label: "PhpStorm",
    screenshots: {
      desktop: "phpstorm.png",
    },
    icon: "phpstorm.svg",
  },
  {
    name: "rubymine",
    availibility: "soon",
    label: "RubyMine",
    screenshots: {
      desktop: "",
    },
    icon: "rubymine.svg",
  },
  {
    name: "webstorm",
    availibility: "soon",
    label: "GoLand",
    screenshots: {
      desktop: "",
    },
    icon: "webstorm.svg",
  },
];

export const benefits: Card[] = [
  {
    title: "5h",
    text: "weekly productivity gain per engineer",
  },
  {
    title: "4x",
    text: "faster time from zero to first PR",
  },
  {
    title: "61%",
    text: "cost savings compared to a VDI solution",
  },
  {
    title: "500k",
    text: "developers are using Gitpod",
  },
];
