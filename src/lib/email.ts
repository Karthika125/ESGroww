import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendVerificationEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {

  const verifyUrl =
    `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from:
      "ESGroww <onboarding@resend.dev>",

    to: email,

    subject:
      "Verify your ESGroww account",

    html: `
      <div style="font-family: Arial; padding: 24px;">
        <h2>Verify Your ESGroww Account</h2>

        <p>
          Thank you for registering with ESGroww.
        </p>

        <p>
          Click the button below to verify your email.
        </p>

        <a
          href="${verifyUrl}"
          style="
            display:inline-block;
            background:#059669;
            color:white;
            padding:12px 20px;
            border-radius:8px;
            text-decoration:none;
            margin-top:16px;
          "
        >
          Verify Account
        </a>

        <p style="margin-top:24px;">
          This link expires in 24 hours.
        </p>
      </div>
    `,
  });
}