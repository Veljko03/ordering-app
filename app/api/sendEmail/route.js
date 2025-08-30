import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();

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

    const sendData = await transporter.sendMail(mailOptions);

    return Response.json(
      { message: "Email sent successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Send email error:", error);
    return Response.json(
      { error: "Some error while sending email" },
      { status: 500 }
    );
  }
}
