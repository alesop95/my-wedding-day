export type FamilyMember = {
  firstName: string;
  lastName: string;
  recipient: boolean;
  isChild: boolean;
  infant?: boolean;
  sex: "male" | "female";
  rsvp: "yes" | "no" | "maybe" | "unknown";
  table?: {
    tableId: string;
    note?: string | null;
  } | null;
  // Feature 3 - Dashboard extensions
  allergies?: string[];       // es. ["glutine", "lattosio"]
  dietaryNotes?: string;      // note libere (vegetariano, vegano, etc.)
  drinkPreference?: string;   // es. "Spritz", "Gin Tonic" (per tracciamento cocktail)
};
export type FamilyData = {
  family: string;
  side?: "Alessio" | "Beatrice";
  gift?: number;
  donation?: number;
  reminderSent?: boolean;
  note: string;
  id: string;
  linkSent: boolean;
  members: FamilyMember[];
  // when true, we omit the restaurant info
  onlyInfo: boolean;
};

export let dummyData: FamilyData = {
  family: "Smith",
  note: "",
  onlyInfo: false,
  linkSent: false,
  id: "DUMMYDATA",
  members: [
    {
      firstName: "Mario",
      lastName: "Rossi",
      recipient: true,
      isChild: false,
      sex: "male",
      rsvp: "unknown"
    }
  ]
};

export const setDummyData = (data: FamilyData) => (dummyData = data);
// Versione i18n delle funzioni WhatsApp
export const getWhatsAppMessageI18n = (data: FamilyData, t: (key: string, options?: any) => string) => {
  const single = data.members.length === 1;
  const inviteText = single ? t("whatsapp.invitation.inviteYouSingle") : t("whatsapp.invitation.inviteYouPlural");
  const toWeddingText = single ? t("whatsapp.invitation.toWedding") : t("whatsapp.invitation.toWeddingPlural");

  return `${t("whatsapp.invitation.greeting")} ${inviteText} ${toWeddingText}

${t("whatsapp.invitation.website", { familyId: data.id })}

${t("whatsapp.invitation.closing")}`;
};

// Versione legacy (deprecata - mantiene retrocompatibilità)
export const getWhatsAppMessage = (data: FamilyData) => {
  const single = data.members.length === 1;
  return `Ciao! Come va? spero tutto bene.
Abbiamo una fantastica notizia da condividere!
\n💍 Siamo entusiasti di invitar${single ? "t" : "v"}i al nostro matrimonio!
Trover${single ? "ai" : "ete"} tutti i dettagli e confermer${
    single ? "ai" : "ete"
  } la ${single ? "tua" : "vostra"} presenza sul nostro sito

  https://evento-alessio-beatrice.example/${data.id}

Non vediamo l'ora di festeggiare insieme 🎉🎉!
Alessio & Beatrice`;
};

export const getWhatsAppMessageReminderI18n = (data: FamilyData, t: (key: string, options?: any) => string) => {
  const single = data.members.length === 1;
  const confirmType = single ? t("whatsapp.reminder.confirmSingle") : t("whatsapp.reminder.confirmPlural");
  const presenceType = single ? t("whatsapp.reminder.presenceSingle") : t("whatsapp.reminder.presencePlural");
  const politenessType = single ? t("whatsapp.reminder.politenessSingle") : t("whatsapp.reminder.politenessPlural");

  return `${t("whatsapp.reminder.greeting")}

${t("whatsapp.reminder.weddingDate")} ${confirmType} ${t("whatsapp.reminder.confirmPresence", { presenceType })}

${t("whatsapp.reminder.websiteReminder", { familyId: data.id })}

${t("whatsapp.reminder.thanks", { politenessType })}`;
};

// Versione legacy (deprecata - mantiene retrocompatibilità)
export const getWhatsAppMessageReminder = (data: FamilyData) => {
  const single = data.members.length === 1;
  return `Ciao! Come va? spero tutto bene.
Per organizzare al meglio la nostra festa di matrimonio 🤵🏻👰🏻‍ è importante conoscere la presenza o meno di tutti gli invitati.

Il giorno del nostro matrimonio sarà il 24 Luglio 2027 e ci farebbe molto comodo se ${
    single ? "potesti" : "poteste"
  } confermare la ${single ? "tua" : "vostra"} presenza sull'invito digitale
entro il *24 Giugno 2027*

👉 https://evento-alessio-beatrice.example/${data.id} (nel riquadro "La tua presenza")

Grazie per la ${single ? "tua" : "vostra"} gentilezza e comprensione.
Alessio & Beatrice`;
};
