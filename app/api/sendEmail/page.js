import nodemailer from "nodemailer";

async function POST(req) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dpacov087@gmail.com",
        pass: process.env.NEXT_APP_PASS,
      },
    });

    const itemDetails =
      "ovo je poruka koja ce sadrzati infoooooo o jelimmaa....";

    const mailOptions = {
      from: "no-reply@example.com",
      to: "dpacov087@gmail.com",
      subject: "New User Form Submission",
      text: `${itemDetails}`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: "Email sent successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        message: "Error sending email",
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      }),
      { status: 500 }
    );
  }
}

export default POST;
