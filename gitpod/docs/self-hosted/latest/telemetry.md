---
section: self-hosted/latest
subsection: reference
title: Telemetry in Gitpod Self-Hosted
---

<script context="module">
  export const prerender = true;
</script>

# Telemetry

To improve our self-hosted offer, we collect pseudonymous data of Gitpod Self-Hosted installations. This data contains very simple usage statistics like the number of users and workspaces.

The telemetry component is enabled by default and can be disabled by going to the `Settings` tab in the `Admin` dashboard and using the `Enable Service Ping` checkbox. Once disabled, no data will be collected and sent at all.

You can also specifically opt-out of sending information that specifies who the owner of an installation is (`customer_id`). This is only relevant for customers on the [professional plan](../../../self-hosted) - users on the [community plan](../../../self-hosted) are not identifiable irrespective of this toggle.

For transparency, the exact data that is sent (in case the checkbox is checked) is shown in the dashboard.

![Enable Service Ping in Admin Settings](../../../static/images/docs/self-hosted/telemetry-setting.png)
