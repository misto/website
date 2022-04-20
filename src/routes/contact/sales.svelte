<script context="module">
  export const prerender = true;
</script>

<script lang="ts">
  import type { Form } from "$lib/types/form.type";
  import type { Email } from "$lib/api/api";
  import OpenGraph from "$lib/components/open-graph.svelte";
  import SubmissionSuccess from "$lib/components/submission-success.svelte";
  import Section from "$lib/components/section.svelte";
  import { trackEvent, trackIdentity } from "$lib/components/segment.svelte";
  import Textarea from "$lib/components/ui-library/textarea";
  import Header from "$lib/components/header.svelte";
  import Input from "$lib/components/ui-library/input";
  import Checkbox from "$lib/components/ui-library/checkbox";
  import Select from "$lib/components/ui-library/select";
  import Card from "$lib/components/ui-library/card";
  import Button from "$lib/components/ui-library/button";
  import { noOfEngineers } from "$lib/contents/contact";
  import { scrollToElement } from "$lib/utils/helpers";
  import { tick } from "svelte";

  const selfHostingSubject = "Self-hosting";
  const otherSubject = "Other";
  const subjects = [
    selfHostingSubject,
    "Educational Discount",
    "Reselling",
    otherSubject,
  ];
  const cloudPlatforms = [
    "Amazon Elastic Kubernetes Service (EKS)",
    "Google Kubernetes Engine (GKE)",
    "Kubernetes",
    "Microsoft Azure Kubernetes Service (AKS)",
  ];

  let sectionStart: HTMLElement;
  let isCloudPlatformsSelectShown = false;
  let cloudInfrastructure = {
    el: null,
    valid: false,
    value: "",
  };

  const formData: Form = {
    selectedSubject: {
      el: null,
      valid: false,
      value: "",
    },
    name: {
      el: null,
      valid: false,
      value: "",
    },
    consent: {
      el: null,
      valid: false,
      checked: false,
    },
    workEmail: {
      el: null,
      valid: false,
      value: "",
    },
    companyWebsite: {
      el: null,
      valid: false,
      value: "",
    },
    noOfEngineers: {
      el: null,
      valid: false,
      value: "",
    },
    message: {
      el: null,
      valid: false,
      value: "",
    },
  };

  $: if (formData.selectedSubject.value == selfHostingSubject) {
    isCloudPlatformsSelectShown = true;
    formData.cloudInfrastructure = cloudInfrastructure;
  } else {
    isCloudPlatformsSelectShown = false;
    delete formData.cloudInfrastructure;
  }

  let isFormDirty = false;
  let isEmailSent = false;

  $: isFormValid = Object.values(formData).every((field) => field.valid);

  const handleSubmit = async () => {
    isFormDirty = true;
    if (!isFormValid) {
      await tick();
      scrollToElement(sectionStart, ".error");
      return;
    }

    trackIdentity({
      name_untrusted: formData.name.value,
      email_untrusted: formData.workEmail.value,
    });

    trackEvent("message_submitted", {
      subject: formData.selectedSubject.value,
    });

    const email: Email = {
      toType: "sales",
      replyTo: {
        email: formData.workEmail.value,
        name: formData.name.value,
      },
      subject:
        formData.selectedSubject.value +
        "  (from " +
        formData.workEmail.value +
        ")",
      message: `
        ${
          formData.cloudInfrastructure && formData.cloudInfrastructure.value
            ? `Cloud Infrastructure: ${formData.cloudInfrastructure.value}`
            : ""
        }
        Company website: ${formData.companyWebsite.value}
        ${
          formData.noOfEngineers.value
            ? `Total number of engineers: ${formData.noOfEngineers.value}`
            : ""
        }
        Message: ${formData.message.value}
      `,
    };

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        body: JSON.stringify(email),
      });
      if (response.ok) {
        isEmailSent = true;
        setTimeout(() => {
          sectionStart.scrollIntoView();
        });
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };
</script>

<style lang="postcss">
  .h3 {
    @apply mb-small;
  }

  .link {
    @apply underline;
  }

  p {
    color: var(--dark-grey);
  }
  form {
    max-width: 45rem;
    margin: auto;
  }
  fieldset ul {
    @apply flex flex-wrap;
  }
  fieldset li {
    @apply mr-macro;
  }
</style>

<OpenGraph
  data={{
    description: "We’d love to talk about how we can work together.",
    title: "Contact Sales",
  }}
/>

<Header
  title="Contact Sales"
  text=" We’d love to talk about how we can work together."
  tight={true}
/>

<Card
  size="small"
  class="p-xx-small sm:py-small sm:px-x-small md:p-medium sm:mx-8 mb-xx-large"
  styles="margin-top: 0"
>
  <Section id="form" style="padding: 0; margin: 0">
    <div bind:this={sectionStart} data-analytics={`{"dnt":true}`}>
      {#if isEmailSent}
        <SubmissionSuccess
          title="Thank you for your message"
          text="We received your message. Our team will take a look and get back to you as
      soon as possible."
        />
      {:else}
        <form on:submit|preventDefault={handleSubmit} novalidate>
          <h2 class="h3 text-center">Send us a message</h2>
          <ul class="space-y-8">
            <li class:error={isFormDirty && !formData.selectedSubject.valid}>
              <fieldset class="flex">
                <legend>Please choose a subject</legend>
                <ul>
                  {#each subjects as subject, index}
                    <li>
                      <input
                        id="subject-{index}"
                        type="radio"
                        bind:group={formData.selectedSubject.value}
                        bind:this={formData.selectedSubject.el}
                        on:change={() => {
                          formData.selectedSubject.valid =
                            formData.selectedSubject.value &&
                            formData.selectedSubject.el.validity.valid;
                        }}
                        value={subject}
                        name="subject"
                      />
                      <label for="subject-{index}" class="font-medium"
                        >{subject}</label
                      >
                    </li>
                  {/each}
                </ul>
              </fieldset>
            </li>
            {#if isCloudPlatformsSelectShown && formData.cloudInfrastructure}
              <li>
                <div>
                  <Select
                    hasError={isFormDirty &&
                      !formData.cloudInfrastructure.valid}
                    name="cloudInfrastructure"
                    bind:value={formData.cloudInfrastructure.value}
                    on:change={(e) => {
                      formData.cloudInfrastructure.valid =
                        formData.cloudInfrastructure.value &&
                        // @ts-ignore
                        e.target.validity.valid;
                    }}
                    options={cloudPlatforms}
                    placeholder="Which cloud infrastructure do you use?"
                  />
                </div>
              </li>
            {/if}
            <li>
              <Input
                hasError={isFormDirty && !formData.name.valid}
                label="Full Name*"
                id="name"
                name="full-name"
                bind:value={formData.name.value}
                bind:element={formData.name.el}
                on:change={() => {
                  formData.name.valid =
                    formData.name.value && formData.name.el.checkValidity();
                }}
                type="text"
                autocomplete="name"
              />
            </li>
            <li>
              <Input
                hasError={isFormDirty && !formData.workEmail.valid}
                label="Work e-mail*"
                id="email"
                name="e-mail"
                bind:value={formData.workEmail.value}
                bind:element={formData.workEmail.el}
                on:change={() => {
                  formData.workEmail.valid =
                    formData.workEmail.value &&
                    formData.workEmail.el.checkValidity();
                }}
                type="email"
                autocomplete="email"
              />
            </li>
            <li>
              <Input
                label="Company website*"
                hasError={isFormDirty && !formData.companyWebsite.valid}
                id="compnay-website"
                name="website"
                bind:value={formData.companyWebsite.value}
                bind:element={formData.companyWebsite.el}
                on:change={() => {
                  formData.companyWebsite.valid =
                    formData.companyWebsite.value &&
                    formData.companyWebsite.el.checkValidity();
                }}
                type="text"
                autocomplete="organization"
              />
            </li>
            <li>
              <Select
                placeholder="Total number of engineers"
                hasError={isFormDirty && !formData.noOfEngineers.valid}
                name="noOfEngineers"
                bind:value={formData.noOfEngineers.value}
                bind:element={formData.noOfEngineers.el}
                on:change={() => {
                  formData.noOfEngineers.valid =
                    formData.noOfEngineers.value &&
                    formData.noOfEngineers.el.checkValidity();
                }}
                options={noOfEngineers}
              />
            </li>
            <li>
              <Textarea
                label="Your message*"
                id="message"
                name="message"
                hasError={isFormDirty && !formData.message.valid}
                bind:value={formData.message.value}
                bind:element={formData.message.el}
                on:change={() => {
                  formData.message.valid =
                    formData.message.value &&
                    formData.message.el.validity.valid;
                }}
                cols="30"
                rows="10"
              />
            </li>
            <li>
              <Checkbox
                hasError={isFormDirty && !formData.consent.valid}
                label="I consent to having this website store my submitted information so that the sales team can respond to my inquiry."
                bind:checked={formData.consent.checked}
                bind:element={formData.consent.el}
                on:change={() => {
                  formData.consent.valid =
                    formData.consent.checked &&
                    formData.consent.el.validity.valid;
                }}
              />
            </li>
            <li>
              <p class="text-sm my-4">
                By submitting this form I acknowledge that I have read and
                understood <a class="link" href="/privacy"
                  >Gitpod’s Privacy Policy.</a
                >
              </p>
              <Button
                variant="cta"
                size="medium"
                type="submit"
                disabled={isFormDirty && !isFormValid}>Send message</Button
              >
              {#if isFormDirty && !isFormValid}
                <legend class="text-xs text-error block mt-1 mb-2">
                  Please fill out all required fields above
                </legend>
              {/if}
            </li>
          </ul>
          {#if isEmailSent}
            <p>Thank you! We'll get back to you soon.</p>
          {/if}
        </form>
      {/if}
    </div>
  </Section>
</Card>
