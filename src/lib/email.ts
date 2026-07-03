import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

interface ContactEmailPayload {
  nom: string;
  email: string;
  sujet: string;
  message: string;
  to: string;
}

export async function sendContactNotificationEmail(data: ContactEmailPayload) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY manquant — email de notification non envoyé.");
    return;
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "HEXA <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: data.to,
    replyTo: data.email,
    subject: `[Contact HEXA] ${data.sujet} — ${data.nom}`,
    text: `Nouveau message depuis le formulaire de contact HEXA.\n\nNom : ${data.nom}\nEmail : ${data.email}\nSujet : ${data.sujet}\n\nMessage :\n${data.message}`,
  });

  if (error) {
    throw error;
  }
}
