import "server-only";
import { siteConfig } from "@/lib/site-config";
import { insertContactMessage } from "@/lib/supabase";
import { sendContactNotificationEmail } from "@/lib/email";
import type { ContactFormValues } from "@/lib/contact";

export async function sendContactMessage(data: Omit<ContactFormValues, "honeypot">) {
  console.log("[contact] Nouveau message reçu :", {
    nom: data.nom,
    email: data.email,
    sujet: data.sujet,
    message: data.message,
  });

  const results = await Promise.allSettled([
    insertContactMessage(data),
    sendContactNotificationEmail({ ...data, to: siteConfig.contact.email }),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[contact] Échec d'un canal de livraison :", result.reason);
    }
  }
}
