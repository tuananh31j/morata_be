import config from '@/config/env.config';
import nodemailer from 'nodemailer';
type template = {
    subject: string;
    content: {
        title?: string;
        description: string;
        warning?: string;
    };
    link: {
        linkName: string;
        linkHerf: string;
    };
};
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: false,
    auth: {
        user: config.nodeMailer.email,
        pass: config.nodeMailer.password,
    },
});

export const sendMail = async ({ email, template }: { email: string; template?: template }) => {
    const info = await transporter.sendMail({
        from: 'MORATA <no-reply@morata.com>',
        to: email,
        subject: `${template?.subject}`,
        html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Activate Your Morata Account</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: "Poppins", sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f7f9fc;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background: #edefef;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px;
        background-color: #1e3a8a;
        color: #ffffff;
        border-radius: 10px 10px 0 0;
        margin-bottom: 20px;
      }
      .header img {
        max-width: 180px;
        height: auto;
      }
      .content {
        padding: 20px;
        color: #333;
      }
      .content h1 {
        color: #1e3a8a;
        font-size: 24px;
        margin-bottom: 20px;
      }
      .content p {
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .btn {
        display: inline-block;
        background-color: #1e3a8a;
        color: #ffffff;
        padding: 12px 25px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        margin-top: 10px;
        transition: background-color 0.3s ease;
      }
      .btn:hover {
        background-color: #123b7b;
      }
      .background {
        background-color: #f7f9fc;
        border-radius: 10px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 14px;
        color: #777;
        border-top: 1px solid #e0e0e0;
      }
      .footer p {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="background">
        <div class="header">
          <img
            src="https://demo-morata.myshopify.com/cdn/shop/files/logo_150x@2x.png?v=1697202938"
            alt="Morata Logo"
          />
          <h1>Welcome to Morata!</h1>
        </div>
        <div class="content">
          <h1>${template?.content.title}</h1>
          <p style="color: white text-decoration: none;">Hello ${email},</p>
          <p>${template?.content.description}</p>
          <a style="color: white" href="${template?.link.linkHerf}" class="btn"
            >${template?.link.linkName}</a
          >
          <p>${template?.content.warning && template.content.warning}</p>
        </div>
        <div class="footer">
          <p>Thank you,<br />The Morata Team</p>
          <p><small>Morata Inc., FPT Polytechnic, Ha Noi, Viet Nam</small></p>
        </div>
      </div>
    </div>
  </body>
</html>

`,
        replyTo: undefined,
    });
    console.log('message send : %s', info.messageId);
};
