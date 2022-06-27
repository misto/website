import type { Handler } from "@netlify/functions";
import * as client from "@sendgrid/mail";
import save from "src/functions/feedback/_save-to-spreadsheet";

export type EmailToType = "contact" | "sales" | "community-license";

const determineToEmail = (toType: EmailToType = "contact") => {
  switch (toType) {
    case "contact":
      return process.env.SENDGRID_TO_EMAIL_CONTACT;
    case "sales":
      return process.env.SENDGRID_TO_EMAIL_SALES;
    case "community-license":
      return process.env.SENDGRID_TO_EMAIL_SALES;
    default:
      return "contact-test@gitpod.io";
  }
};

export interface Email {
  to?: {
    email: string;
    name?: string;
  };
  toType?: EmailToType;
  from?: {
    email: string;
    name?: string;
  };
  replyTo: {
    email: string;
    name?: string;
  };
  subject: string;
  message?: string;
  feedback?: string;
  otherFeedback?: string;
  data?: {
    [key: string]: string;
  };
}

async function sendEmail(
  client: client.MailService,
  email: Email
): Promise<{ statusCode: number; errorMessage?: string }> {
  const data: client.MailDataRequired = {
    from: email.from || "",
    subject: email.subject,
    to: [email.to!],
    replyTo: email.replyTo,
    content: [
      {
        type: "text/plain",
        value: `${
          email.message
            ? email.message
            : `${email.feedback}\n${email.otherFeedback}`
        }`,
      },
    ],
    trackingSettings: {
      clickTracking: {
        enable: false,
        enableText: false,
      },
      openTracking: {
        enable: false,
      },
    },
  };
  try {
    await client.send(data);
    return {
      statusCode: 200,
    };
  } catch (e) {
    return {
      statusCode: 500,
      errorMessage: `Error : ${JSON.stringify(e)}`,
    };
  }
}

async function saveToSheet(sheetTitle: string, data: any) {
  const isSaved = await save({
    sheetTitle,
    data,
  });

  const statusCode = isSaved ? 200 : 500;

  return {
    statusCode,
    body: JSON.stringify(data) + " added",
  };
}

const handler: Handler = function (event, _, callback) {
  const email: Email = JSON.parse(event.body!) as Email;
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "no-key";
  const SENDGRID_TO_EMAIL = determineToEmail(email.toType);
  const SENDGRID_FROM_EMAIL = SENDGRID_TO_EMAIL;

  email.from = {
    email: SENDGRID_FROM_EMAIL,
    name: "Gitpod",
  };
  email.to = {
    email: SENDGRID_TO_EMAIL,
    name: "Gitpod",
  };

  const dontEmail =
    email.data && email.data.noOfEngineers !== undefined
      ? email.data.noOfEngineers === "1-10"
      : false;

  if (!dontEmail) {
    client.setApiKey(SENDGRID_API_KEY);
    sendEmail(client, email)
      .then((response) =>
        callback(null, {
          statusCode: response.statusCode,
          body: JSON.stringify(email) + " added",
        })
      )
      .catch((err) => {
        console.error(err);
        callback(err, null);
      });
  }

  if (email.toType === "community-license") {
    const data = [
      new Date(),
      email.replyTo.name,
      email.replyTo.email,
      email.data.company,
      email.data.noOfEngineers,
      email.data.cloudInfrastructure,
      email.data.message,
    ];

    saveToSheet("Free Self-Hosted Community License", data)
      .then((response) =>
        callback(null, {
          statusCode: response.statusCode,
          body: JSON.stringify(email) + " added",
        })
      )
      .catch((err) => {
        console.error(err);
        callback(err, null);
      });
  }
};

export { handler };
