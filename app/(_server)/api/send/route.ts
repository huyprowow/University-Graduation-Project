import { EmailTemplate } from "@/components/email-template";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(req: Request, res: Response) {
  const {
    message,
    email,
    title,
  }: { message: string; email: string; title: string } = await req.json();
  try {
    const { data, error } = await resend.emails.send({
      from: "IAStore <onboarding@resend.dev>",
      to: [email],
      subject: title,
      react: EmailTemplate({ message }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
