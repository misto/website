---
section: self-hosted/latest
title: Telemetry in Gitpod Self-Hosted
---

<script context="module">
  export const prerender = true;
</script>

# Telemetry

To improve our self-hosted offer, we collect pseudonymous data of Gitpod Self-Hosted installations. This data contains very simple usage statistics like the number of users and workspaces. We do not collect any data that allows conclusions to be drawn about the owner of the installation.

The telemetry component is enabled by default and can be disabled by going to the `Settings` tab in the `Admin` dashboard and using the `Enable Service Ping` checkbox. Once disabled, no data will be collected and sent at all.

For transparency, the exact data that is sent (in case the checkbox is checked) is shown in the dashboard.

![Enable Service Ping in Admin Settings](../../../static/images/docs/self-hosted/telemetry-setting.png)
