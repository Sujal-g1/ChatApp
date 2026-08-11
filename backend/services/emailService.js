import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

const ZINGLEEE_CONTACT_EMAIL =
  process.env.ZINGLEEE_CONTACT_EMAIL || "contact.zingleee@gmail.com";

/**
 * Send confirmation email to the user
 * after their feedback has been successfully received.
 */
export const sendFeedbackConfirmation = async ({
  email,
  feedbackId,
}) => {
  const { data, error } = await resend.emails.send({
    from: `Zingleee <${FROM_EMAIL}>`,
    to: [email],
    subject: "We received your feedback — Zingleee",

    html: `
      <div style="
        margin: 0;
        padding: 40px 20px;
        background: #0b0b0f;
        font-family: Arial, sans-serif;
        color: #ffffff;
      ">
        <div style="
          max-width: 600px;
          margin: 0 auto;
          padding: 32px;
          background: #121218;
          border: 1px solid #25252d;
          border-radius: 16px;
        ">

          <h1 style="
            margin: 0 0 24px;
            font-size: 28px;
            color: #ffffff;
          ">
            We received your feedback.
          </h1>

          <p style="
            color: #b5b5c0;
            font-size: 15px;
            line-height: 1.7;
          ">
            Thank you for taking the time to share your thoughts
            about Zingleee.
          </p>

          <p style="
            color: #b5b5c0;
            font-size: 15px;
            line-height: 1.7;
          ">
            Your feedback has been successfully received and
            will be read.
          </p>

          <p style="
            color: #b5b5c0;
            font-size: 15px;
            line-height: 1.7;
          ">
            Your voice genuinely helps us improve Zingleee.
          </p>

          <div style="
            margin: 30px 0;
            padding: 16px;
            background: #191922;
            border-radius: 10px;
            color: #8f8f9d;
            font-size: 12px;
          ">
            Feedback ID: ${feedbackId}
          </div>

          <p style="
            margin: 0;
            color: #ffffff;
            font-size: 14px;
          ">
            — Zingleee
          </p>

        </div>
      </div>
    `,
  });

  if (error) {
    throw error;
  }

  return data;
};


/**
 * Send notification email to Zingleee
 * whenever new feedback is submitted.
 */
export const sendFeedbackNotification = async ({
  feedbackId,
  message,
  email,
  anonymous,
  createdAt,
}) => {
  const submittedBy = anonymous
    ? "Anonymous user"
    : email;

  const safeMessage = String(message)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const formattedDate = new Date(createdAt).toLocaleString(
    "en-IN",
    {
      timeZone: "Asia/Kolkata",
    }
  );

  const { data, error } = await resend.emails.send({
    from: `Zingleee Feedback <${FROM_EMAIL}>`,
    to: [ZINGLEEE_CONTACT_EMAIL],
    subject: "New Zingleee Feedback",

    html: `
      <div style="
        margin: 0;
        padding: 40px 20px;
        background: #0b0b0f;
        font-family: Arial, sans-serif;
        color: #ffffff;
      ">

        <div style="
          max-width: 700px;
          margin: 0 auto;
          padding: 32px;
          background: #121218;
          border: 1px solid #25252d;
          border-radius: 16px;
        ">

          <h1 style="
            margin: 0 0 28px;
            font-size: 26px;
            color: #ffffff;
          ">
            New Zingleee Feedback
          </h1>

          <div style="
            margin-bottom: 12px;
            color: #a0a0ad;
            font-size: 13px;
          ">
            <strong style="color: #ffffff;">
              Submitted by:
            </strong>
            ${submittedBy}
          </div>

          <div style="
            margin-bottom: 12px;
            color: #a0a0ad;
            font-size: 13px;
          ">
            <strong style="color: #ffffff;">
              Anonymous:
            </strong>
            ${anonymous ? "Yes" : "No"}
          </div>

          <div style="
            margin-bottom: 12px;
            color: #a0a0ad;
            font-size: 13px;
          ">
            <strong style="color: #ffffff;">
              Feedback ID:
            </strong>
            ${feedbackId}
          </div>

          <div style="
            margin-bottom: 28px;
            color: #a0a0ad;
            font-size: 13px;
          ">
            <strong style="color: #ffffff;">
              Submitted:
            </strong>
            ${formattedDate}
          </div>

          <div style="
            padding: 24px;
            background: #191922;
            border: 1px solid #282832;
            border-radius: 12px;
          ">

            <div style="
              margin-bottom: 12px;
              color: #8f8f9d;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">
              Feedback
            </div>

            <div style="
              color: #ffffff;
              font-size: 15px;
              line-height: 1.8;
              white-space: pre-wrap;
            ">
              ${safeMessage}
            </div>

          </div>

          <p style="
            margin-top: 28px;
            color: #777783;
            font-size: 12px;
          ">
            This email was automatically generated by Zingleee.
          </p>

        </div>
      </div>
    `,
  });

  if (error) {
    throw error;
  }

  return data;
};