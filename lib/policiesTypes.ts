export interface PolicySection {
  id: string;
  heading: string;
  body: string;
  order_index: number;
}

export interface PolicyLanguageContent {
  raw_content: string;
  sections: PolicySection[];
  title?: string;
}

export interface PolicyDocument {
  id: "privacy" | "terms" | "cookies" | "cancellation" | "customer-info";
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  last_updated: string;
  raw_content?: string;
  sections: PolicySection[];
  source_language?: "en" | "de" | "el";
  translations?: {
    en?: PolicyLanguageContent;
    de?: PolicyLanguageContent;
    el?: PolicyLanguageContent;
  };
  updated_at?: string;
}

export type PoliciesMap = Record<string, PolicyDocument>;

/**
 * Smart Parser: Takes raw text typed into the blank sheet (whether properly formatted
 * or informal/improper) and transforms it into structured, clean sections with headings and paragraphs.
 */
export function parseRawPolicyContent(
  rawText: string,
  policyKey: string = "legal"
): PolicySection[] {
  if (!rawText || !rawText.trim()) return [];

  const text = rawText.trim();
  const normalized = text.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const sections: PolicySection[] = [];

  let currentHeading = "";
  let currentBodyLines: string[] = [];
  let sectionIndex = 0;

  const isHeadingLine = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 120) return false;

    // 1. Numbered patterns: e.g. "1. Geltungsbereich", "1) Geltungsbereich", "§ 1 ...", "Abschnitt 1: ...", "Artikel 1"
    if (
      /^(?:§\s*\d+|\d+[\.\)]|\d+\s*[-–—]|Abschnitt\s*\d+|Artikel\s*\d+|Punkt\s*\d+|Kapitel\s*\d+|Teil\s*\d+|Section\s*\d+)\s+.*$/i.test(
        trimmed
      )
    ) {
      return true;
    }

    // 2. Markdown headings: "# Title", "## Subtitle"
    if (/^#{1,4}\s+.*$/.test(trimmed)) {
      return true;
    }

    // 3. Short standalone line ending with colon: "Zahlungsbedingungen:" or "Widerrufsbelehrung:"
    if (trimmed.endsWith(":") && trimmed.length < 60 && !trimmed.includes(".")) {
      return true;
    }

    // 4. Standalone legal section headers (e.g. Widerrufsrecht, Folgen des Widerrufs, Muster-Widerrufsformular)
    if (
      /^(?:Widerrufsbelehrung|Widerrufsrecht|Folgen des Widerrufs|Muster-Widerrufsformular|Rücksendung|Rücksendekosten|Kostentragungsvereinbarung|Datenschutzerklärung|Allgemeine Geschäftsbedingungen|Verantwortliche Stelle)$/i.test(
        trimmed
      )
    ) {
      return true;
    }

    // 5. Standalone privacy / legal topics without sentence-ending punctuation
    if (
      /^(?:Begriffsbestimmungen|Name und Kontaktdaten.*|Name und Anschrift.*|Beim Besuch der Website|Bei Nutzung unseres Kontaktformulars|Bei Bestellungen über unsere Webseite|Weitergabe von Daten|Weitergabe der E-Mail-Adresse.*|Einsatz von Cookies|Links auf Web-Sites Dritter|Informationen zur elektronischen Widerrufsfunktion.*|Betroffenenrechte|Widerspruchsrecht.*|Recht auf Beschwerde.*|Weitere Informationen zur Erhebung.*|Informationen über die Dauer.*|Datensicherheit|Aktualität und Änderung.*)$/i.test(
        trimmed
      )
    ) {
      return true;
    }

    // 6. All UPPERCASE titles (between 4 and 60 chars) without standard sentence punctuation
    if (
      trimmed.length >= 4 &&
      trimmed.length <= 60 &&
      trimmed === trimmed.toUpperCase() &&
      /^[A-ZÄÖÜ0-9\s\.\-–—\(\)&/]+$/.test(trimmed) &&
      !trimmed.includes(",")
    ) {
      return true;
    }

    return false;
  };

  const flushSection = () => {
    if (currentHeading || currentBodyLines.length > 0) {
      const heading =
        currentHeading.trim() ||
        `Abschnitt ${sectionIndex + 1}`;
      const body = currentBodyLines.join("\n").trim();
      if (heading || body) {
        sections.push({
          id: `sec-${policyKey}-${sectionIndex + 1}`,
          heading: heading.replace(/^#{1,4}\s+/, "").replace(/:$/, ""),
          body,
          order_index: sectionIndex,
        });
        sectionIndex++;
      }
      currentHeading = "";
      currentBodyLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (isHeadingLine(trimmed)) {
      flushSection();
      currentHeading = trimmed;
    } else {
      if (!currentHeading && currentBodyLines.length === 0 && trimmed) {
        const nextLine = lines[i + 1] ? lines[i + 1].trim() : "";
        if (trimmed.length < 60 && !trimmed.endsWith(".") && nextLine === "") {
          flushSection();
          currentHeading = trimmed;
          continue;
        }
      }

      currentBodyLines.push(line);
    }
  }

  flushSection();

  if (sections.length === 0 && text) {
    sections.push({
      id: `sec-${policyKey}-1`,
      heading: "Allgemeine Bestimmungen",
      body: text,
      order_index: 0,
    });
  }

  return sections;
}

/**
 * Helper to get the full raw content of a policy document for the blank sheet editor.
 */
export function getPolicyRawContent(doc: PolicyDocument): string {
  if (doc.raw_content && doc.raw_content.trim()) {
    return doc.raw_content;
  }
  if (doc.sections && doc.sections.length > 0) {
    return doc.sections.map((s) => `${s.heading}\n${s.body}`).join("\n\n");
  }
  return "";
}

export const DEFAULT_POLICIES: PoliciesMap = {
  terms: {
    id: "terms",
    slug: "terms",
    title: "Terms & Conditions",
    subtitle: "Terms and conditions for IXOS Audio.",
    badge: "Terms & Conditions",
    last_updated: "2026",
    raw_content: "",
    sections: [],
    translations: {
      en: { raw_content: "", sections: [] },
      de: { raw_content: "", sections: [] },
      el: { raw_content: "", sections: [] },
    },
  },
  privacy: {
    id: "privacy",
    slug: "privacy",
    title: "Privacy Policy",
    subtitle: "Data protection and privacy guidelines.",
    badge: "Privacy Policy",
    last_updated: "2026",
    raw_content: "",
    sections: [],
    translations: {
      en: { raw_content: "", sections: [] },
      de: { raw_content: "", sections: [] },
      el: { raw_content: "", sections: [] },
    },
  },
  cookies: {
    id: "cookies",
    slug: "cookies",
    title: "Cookie Policy",
    subtitle: "Cookie and tracking preferences.",
    badge: "Cookie Policy",
    last_updated: "2026",
    raw_content: "",
    sections: [],
    translations: {
      en: { raw_content: "", sections: [] },
      de: { raw_content: "", sections: [] },
      el: { raw_content: "", sections: [] },
    },
  },
  cancellation: {
    id: "cancellation",
    slug: "cancellation",
    title: "Cancellation Policy",
    subtitle: "Statutory cancellation and returns terms.",
    badge: "Cancellation Policy",
    last_updated: "2026",
    raw_content: "",
    sections: [],
    translations: {
      en: { raw_content: "", sections: [] },
      de: { raw_content: "", sections: [] },
      el: { raw_content: "", sections: [] },
    },
  },
  "customer-info": {
    id: "customer-info",
    slug: "customer-info",
    title: "Kundeninformationen (Lieferung, Zahlung & Versand)",
    subtitle: "Wichtige gesetzliche Pflichtinformationen zu Lieferzeiten, Lieferbeschränkungen, Versandkosten und Zahlungsarten bei IXOS Audio.",
    badge: "Gesetzliche Kundeninformationen",
    last_updated: "2026",
    raw_content: "",
    sections: [],
    translations: {
      en: { raw_content: "", sections: [] },
      de: { raw_content: "", sections: [] },
      el: { raw_content: "", sections: [] },
    },
  },
};

export const STARTER_TEMPLATES: PoliciesMap = {
  privacy: {
    id: "privacy",
    slug: "privacy",
    title: "Datenschutzerklärung & Sicherheitshinweise",
    subtitle:
      "Transparenz und Vertrauen seit 2008 – Schutz Ihrer persönlichen Daten nach europäischem Datenschutzrecht (DSGVO).",
    badge: "DSGVO-Konform • Höchste Datensicherheit",
    last_updated: "Oktober 2026",
    raw_content: `1. Verantwortliche Stelle & Kontakt
Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:

IXOS Audio Lautsprecher-Technologie
Welps Esch 5, Saerbox Nr-12
48369 Saerbeck, Deutschland
E-Mail: support@ixosaudio.com

Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten streng vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.

2. Datenerfassung & Verarbeitungszwecke
Wenn Sie unseren Webshop besuchen oder Bestellungen aufgeben, erheben wir die dafür notwendigen Daten:
• Name, Vorname und Rechnungs-/Lieferanschrift
• E-Mail-Adresse für Bestellbestätigung und Sendungsverfolgung
• Telefonnummer (optional für Speditionsrückfragen)
• Zahlungsstatus und Bestellhistorie

Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung und vorvertragliche Maßnahmen).

3. Weitergabe von Daten an Logistikpartner
Zur Auslieferung der bestellten Lautsprecher-Ersatzteile übermitteln wir Ihre Anschrift an unsere zertifizierten Versandpartner:
• Deutsche Post AG (Charles-de-Gaulle-Straße 20, 53113 Bonn)
• DHL Paket GmbH (Sträßchensweg 10, 53113 Bonn)

Die Weitergabe erfolgt ausschließlich zum Zweck der Paketzustellung und Benachrichtigung. Eine Weitergabe an unbeteiligte Dritte zu Werbezwecken ist kategorisch ausgeschlossen.

4. Zahlungssicherheit & SSL/TLS-Verschlüsselung
Alle Transaktionen im IXOS Onlineshop erfolgen über moderne, abhörsichere 256-Bit SSL/TLS-Verschlüsselung. Bei Zahlungen über PayPal, Stripe oder SEPA-Überweisung werden keine sensiblen Bank- oder Kreditkartendaten auf unseren Servern gespeichert. Die Abwicklung erfolgt direkt über die zertifizierten Schnittstellen der jeweiligen Zahlungsdienstleister (PCI-DSS Level 1 konform).

5. Ihre Betroffenenrechte nach DSGVO
Sie haben nach europäischem Datenschutzrecht jederzeit das Recht auf:
• Unentgeltliche Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten (Art. 15 DSGVO)
• Berichtigung unrichtiger Daten (Art. 16 DSGVO)
• Löschung Ihrer Daten (Art. 17 DSGVO), sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen
• Einschränkung der Verarbeitung sowie Datenübertragbarkeit (Art. 18 & 20 DSGVO)

Wenden Sie sich zur Ausübung Ihrer Rechte jederzeit formlos an support@ixosaudio.com.`,
    sections: [
      {
        id: "sec-priv-1",
        heading: "1. Verantwortliche Stelle & Kontakt",
        body:
          "Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:\n\nIXOS Audio Lautsprecher-Technologie\nWelps Esch 5, Saerbox Nr-12\n48369 Saerbeck, Deutschland\nE-Mail: support@ixosaudio.com\n\nWir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten streng vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.",
        order_index: 0,
      },
      {
        id: "sec-priv-2",
        heading: "2. Datenerfassung & Verarbeitungszwecke",
        body:
          "Wenn Sie unseren Webshop besuchen oder Bestellungen aufgeben, erheben wir die dafür notwendigen Daten:\n• Name, Vorname und Rechnungs-/Lieferanschrift\n• E-Mail-Adresse für Bestellbestätigung und Sendungsverfolgung\n• Telefonnummer (optional für Speditionsrückfragen)\n• Zahlungsstatus und Bestellhistorie\n\nRechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung und vorvertragliche Maßnahmen).",
        order_index: 1,
      },
      {
        id: "sec-priv-3",
        heading: "3. Weitergabe von Daten an Logistikpartner",
        body:
          "Zur Auslieferung der bestellten Lautsprecher-Ersatzteile übermitteln wir Ihre Anschrift an unsere zertifizierten Versandpartner:\n• Deutsche Post AG (Charles-de-Gaulle-Straße 20, 53113 Bonn)\n• DHL Paket GmbH (Sträßchensweg 10, 53113 Bonn)\n\nDie Weitergabe erfolgt ausschließlich zum Zweck der Paketzustellung und Benachrichtigung. Eine Weitergabe an unbeteiligte Dritte zu Werbezwecken ist kategorisch ausgeschlossen.",
        order_index: 2,
      },
      {
        id: "sec-priv-4",
        heading: "4. Zahlungssicherheit & SSL/TLS-Verschlüsselung",
        body:
          "Alle Transaktionen im IXOS Onlineshop erfolgen über moderne, abhörsichere 256-Bit SSL/TLS-Verschlüsselung. Bei Zahlungen über PayPal, Stripe oder SEPA-Überweisung werden keine sensiblen Bank- oder Kreditkartendaten auf unseren Servern gespeichert. Die Abwicklung erfolgt direkt über die zertifizierten Schnittstellen der jeweiligen Zahlungsdienstleister (PCI-DSS Level 1 konform).",
        order_index: 3,
      },
      {
        id: "sec-priv-5",
        heading: "5. Ihre Betroffenenrechte nach DSGVO",
        body:
          "Sie haben nach europäischem Datenschutzrecht jederzeit das Recht auf:\n• Unentgeltliche Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten (Art. 15 DSGVO)\n• Berichtigung unrichtiger Daten (Art. 16 DSGVO)\n• Löschung Ihrer Daten (Art. 17 DSGVO), sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen\n• Einschränkung der Verarbeitung sowie Datenübertragbarkeit (Art. 18 & 20 DSGVO)\n\nWenden Sie sich zur Ausübung Ihrer Rechte jederzeit formlos an support@ixosaudio.com.",
        order_index: 4,
      },
    ],
  },

  terms: {
    id: "terms",
    slug: "terms",
    title: "Allgemeine Geschäftsbedingungen (AGB)",
    subtitle:
      "Allgemeine Geschäfts- und Lieferbedingungen für den IXOS Audio Manufaktur- und Ersatzteile-Onlineshop.",
    badge: "Rechtssicher • Deutsches & EU-Handelsrecht",
    last_updated: "Oktober 2026",
    raw_content: `1. Geltungsbereich und Anbieter
Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen, die Verbraucher oder Unternehmer über den Onlineshop der IXOS Audio (Welps Esch 5, Saerbox Nr-12, 48369 Saerbeck, Deutschland) abschließen. Abweichende Bedingungen des Bestellers erkennen wir nicht an, es sei denn, wir haben ausdrücklich schriftlich zugestimmt.

2. Vertragsschluss und Bestellvorgang
Die Darstellung der Produkte im Onlineshop stellt kein rechtlich bindendes Angebot, sondern eine Aufforderung zur Bestellung dar. Durch Anklicken des Buttons 'Zahlungspflichtig bestellen' bzw. 'Kauf abschließen' geben Sie eine verbindliche Bestellung ab. Der Vertrag kommt durch unsere Bestätigungs-E-Mail oder durch Übergabe der Ware an den Versanddienstleister zustande.

3. Preise, Versandkosten & Incoterms
Alle angegebenen Preise verstehen sich in Euro (€). Für Lieferungen innerhalb Deutschlands entfallen ab 75 € Bestellwert die Standardversandkosten. Unterhalb dieses Betrags sowie für Lieferungen in das EU-Ausland und weltweit werden die Versandkosten im Bestellprozess exakt berechnet. Soweit anwendbar gilt als Handelsklausel Incoterms CPT (Carriage Paid To) ab Werk Saerbeck.

4. Lieferung & Eigentumsvorbehalt
Bestellungen an Werktagen vor 14:00 Uhr MEZ werden in der Regel am selben Werktag mit DHL versandt. Die gelieferte Ware bleibt bis zur vollständigen Bezahlung sämtlicher Forderungen aus dem Kaufvertrag Eigentum von IXOS Audio.

5. Gesetzliche Mängelhaftung & Passform
Für alle in unserem Webshop angebotenen Artikel bestehen die gesetzlichen Mängelhaftungsrechte (Gewährleistung). Wir gewährleisten die präzise Werkstatt-Passgenauigkeit aller Reparatursicken und Ersatzteile bei herstellerkonformer Modellauswahl. Bei offensichtlichen Transportschäden bitten wir um zeitnahe Kontaktaufnahme zur schnellen Bereitstellung von kostenlosem Ersatz.

6. Schlussbestimmungen & Gerichtsstand
Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand für alle Streitigkeiten aus dem Vertragsverhältnis ist, soweit gesetzlich zulässig, Steinfurt / Münster (Westfalen).`,
    sections: [
      {
        id: "sec-terms-1",
        heading: "1. Geltungsbereich und Anbieter",
        body:
          "Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen, die Verbraucher oder Unternehmer über den Onlineshop der IXOS Audio (Welps Esch 5, Saerbox Nr-12, 48369 Saerbeck, Deutschland) abschließen. Abweichende Bedingungen des Bestellers erkennen wir nicht an, es sei denn, wir haben ausdrücklich schriftlich zugestimmt.",
        order_index: 0,
      },
      {
        id: "sec-terms-2",
        heading: "2. Vertragsschluss und Bestellvorgang",
        body:
          "Die Darstellung der Produkte im Onlineshop stellt kein rechtlich bindendes Angebot, sondern eine Aufforderung zur Bestellung dar. Durch Anklicken des Buttons 'Zahlungspflichtig bestellen' bzw. 'Kauf abschließen' geben Sie eine verbindliche Bestellung ab. Der Vertrag kommt durch unsere Bestätigungs-E-Mail oder durch Übergabe der Ware an den Versanddienstleister zustande.",
        order_index: 1,
      },
      {
        id: "sec-terms-3",
        heading: "3. Preise, Versandkosten & Incoterms",
        body:
          "Alle angegebenen Preise verstehen sich in Euro (€). Für Lieferungen innerhalb Deutschlands entfallen ab 75 € Bestellwert die Standardversandkosten. Unterhalb dieses Betrags sowie für Lieferungen in das EU-Ausland und weltweit werden die Versandkosten im Bestellprozess exakt berechnet. Soweit anwendbar gilt als Handelsklausel Incoterms CPT (Carriage Paid To) ab Werk Saerbeck.",
        order_index: 2,
      },
      {
        id: "sec-terms-4",
        heading: "4. Lieferung & Eigentumsvorbehalt",
        body:
          "Bestellungen an Werktagen vor 14:00 Uhr MEZ werden in der Regel am selben Werktag mit DHL versandt. Die gelieferte Ware bleibt bis zur vollständigen Bezahlung sämtlicher Forderungen aus dem Kaufvertrag Eigentum von IXOS Audio.",
        order_index: 3,
      },
      {
        id: "sec-terms-5",
        heading: "5. Gesetzliche Mängelhaftung & Passform",
        body:
          "Für alle in unserem Webshop angebotenen Artikel bestehen die gesetzlichen Mängelhaftungsrechte (Gewährleistung). Wir gewährleisten die präzise Werkstatt-Passgenauigkeit aller Reparatursicken und Ersatzteile bei herstellerkonformer Modellauswahl. Bei offensichtlichen Transportschäden bitten wir um zeitnahe Kontaktaufnahme zur schnellen Bereitstellung von kostenlosem Ersatz.",
        order_index: 4,
      },
      {
        id: "sec-terms-6",
        heading: "6. Schlussbestimmungen & Gerichtsstand",
        body:
          "Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand für alle Streitigkeiten aus dem Vertragsverhältnis ist, soweit gesetzlich zulässig, Steinfurt / Münster (Westfalen).",
        order_index: 5,
      },
    ],
  },

  cookies: {
    id: "cookies",
    slug: "cookies",
    title: "Cookie-Richtlinie & Tracking-Präferenzen",
    subtitle:
      "Transparente Informationen über den Einsatz von Cookies und technischen Speichertechnologien auf ixosaudio.com.",
    badge: "ePrivacy & DSGVO konform • Keine Werbetracker",
    last_updated: "Oktober 2026",
    raw_content: `1. Was sind Cookies?
Cookies sind kleine Textdateien, die beim Aufruf unserer Website lokal auf Ihrem Endgerät gespeichert werden. Sie richten keinen Schaden an, enthalten keine Viren und dienen dazu, das Einkaufen bei IXOS reibungslos, komfortabel und sicher zu gestalten.

2. Essenziell notwendige Cookies
Diese Cookies sind für den grundlegenden Betrieb des Webshops zwingend erforderlich:
• Warenkorb-Speicherung (Merkt Artikel während des Einkaufs)
• Session- & Sicherheits-Tokens (Schutz vor unberechtigten Anfragen)
• Lokale Spracheinstellungen (Deutsch, Englisch, Griechisch)

Diese Cookies können in unseren Systemen nicht deaktiviert werden (Rechtsgrundlage: § 25 Abs. 2 TDDDG).

3. Analyse- und Performance-Technologien
Um unseren Shop kontinuierlich zu optimieren, setzen wir anonymisierte Analysedienste ein (Google Analytics 4 / Google Tag Manager mit aktivierter IP-Maskierung). Daten wie Bildschirmauflösung, Verweildauer und besuchte Produktkategorien werden aggregiert und ohne Personenbezug ausgewertet.

4. Kein Verkauf von Nutzerdaten
IXOS Audio setzt keine verhaltensbasierten Werbe-Tracking-Netzwerke ein und verkauft keinerlei Nutzerdaten an Drittanbieter oder Datenbroker. Ihr Surfverhalten auf unserer Seite bleibt geschützt.

5. Verwaltung und Deaktivierung im Browser
Sie können in den Einstellungen Ihres Webbrowsers das Speichern von Cookies ganz oder teilweise blockieren oder bereits gespeicherte Cookies jederzeit löschen. Bitte beachten Sie, dass bei einer vollständigen Deaktivierung von Cookies Warenkorbfunktionen beeinträchtigt sein können.`,
    sections: [
      {
        id: "sec-cook-1",
        heading: "1. Was sind Cookies?",
        body:
          "Cookies sind kleine Textdateien, die beim Aufruf unserer Website lokal auf Ihrem Endgerät gespeichert werden. Sie richten keinen Schaden an, enthalten keine Viren und dienen dazu, das Einkaufen bei IXOS reibungslos, komfortabel und sicher zu gestalten.",
        order_index: 0,
      },
      {
        id: "sec-cook-2",
        heading: "2. Essenziell notwendige Cookies",
        body:
          "Diese Cookies sind für den grundlegenden Betrieb des Webshops zwingend erforderlich:\n• Warenkorb-Speicherung (Merkt Artikel während des Einkaufs)\n• Session- & Sicherheits-Tokens (Schutz vor unberechtigten Anfragen)\n• Lokale Spracheinstellungen (Deutsch, Englisch, Griechisch)\n\nDiese Cookies können in unseren Systemen nicht deaktiviert werden (Rechtsgrundlage: § 25 Abs. 2 TDDDG).",
        order_index: 1,
      },
      {
        id: "sec-cook-3",
        heading: "3. Analyse- und Performance-Technologien",
        body:
          "Um unseren Shop kontinuierlich zu optimieren, setzen wir anonymisierte Analysedienste ein (Google Analytics 4 / Google Tag Manager mit aktivierter IP-Maskierung). Daten wie Bildschirmauflösung, Verweildauer und besuchte Produktkategorien werden aggregiert und ohne Personenbezug ausgewertet.",
        order_index: 2,
      },
      {
        id: "sec-cook-4",
        heading: "4. Kein Verkauf von Nutzerdaten",
        body:
          "IXOS Audio setzt keine verhaltensbasierten Werbe-Tracking-Netzwerke ein und verkauft keinerlei Nutzerdaten an Drittanbieter oder Datenbroker. Ihr Surfverhalten auf unserer Seite bleibt geschützt.",
        order_index: 3,
      },
      {
        id: "sec-cook-5",
        heading: "5. Verwaltung und Deaktivierung im Browser",
        body:
          "Sie können in den Einstellungen Ihres Webbrowsers das Speichern von Cookies ganz oder teilweise blockieren oder bereits gespeicherte Cookies jederzeit löschen. Bitte beachten Sie, dass bei einer vollständigen Deaktivierung von Cookies Warenkorbfunktionen beeinträchtigt sein können.",
        order_index: 4,
      },
    ],
  },

  cancellation: {
    id: "cancellation",
    slug: "cancellation",
    title: "Widerrufsbelehrung & 30 Tage Rückgaberecht",
    subtitle:
      "Informationen zu Ihrem gesetzlichen Widerrufsrecht und der Abwicklung von Rücksendungen bei IXOS Audio.",
    badge: "30 Tage Widerrufsrecht",
    last_updated: "Oktober 2026",
    raw_content: `1. Gesetzliche Widerrufsbelehrung (30 Tage Widerrufsrecht)
Verbraucher haben das Recht, binnen dreißig Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt dreißig Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben.

2. Ausübung des Widerrufsrechts
Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (IXOS Audio Lautsprecher-Technologie, z. Hd. Retouren-Abteilung, Welps Esch 5, Saerbox Nr-12, 48369 Saerbeck, Deutschland, E-Mail: support@ixosaudio.com) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss informieren, diesen Vertrag zu widerrufen. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist:

IXOS Audio Lautsprecher-Technologie
z. Hd. Retouren-Abteilung
Welps Esch 5, Saerbox Nr-12
48369 Saerbeck, Deutschland
E-Mail: support@ixosaudio.com

3. Folgen des Widerrufs & Rückzahlung
Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Standardlieferkosten, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist. Für die Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben.

4. Wichtige Hinweise zu Präzisionsteilen & Transportschäden
Da es sich bei Lautsprechersicken, Diaphragmen und Klebstoffen um hochsensible Bauteile handelt, müssen zurückgesendete Artikel unbenutzt, ungeklebt und in der stoßfesten Originalverpackung sein.

Sollte ein Artikel bei der Zustellung beschädigt eingetroffen sein, senden wir nach kurzer Fotodokumentation innerhalb von 48 Stunden sofort kostenlosen Ersatz! Sie müssen den beschädigten Artikel in diesem Fall in der Regel nicht auf eigene Kosten zurücksenden.

5. Rücksendeadresse unserer Manufaktur
Rücksendungen senden Sie bitte stets in stabiler, knickfester Verpackung an folgende Anschrift:

IXOS Lautsprecher-Technologie
Retouren-Abteilung
Welps Esch 5, Saerbox Nr-12
48369 Saerbeck, Nordrhein-Westfalen
Deutschland

6. Muster-Widerrufsformular (Sample Cancellation Form)
(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)

An:
IXOS Audio — Angelos Drampalis
Welps Esch 5, Saerbox Nr-12
48369 Saerbeck, Deutschland
E-Mail: ixos@drampalis.de

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*):
Bestellt am (*) / erhalten am (*):
Name des/der Verbraucher(s):
Anschrift des/der Verbraucher(s):
Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
Datum:

(*) Unzutreffendes streichen.`,
    sections: [
      {
        id: "sec-canc-1",
        heading: "1. Gesetzliche Widerrufsbelehrung (30 Tage Widerrufsrecht)",
        body:
          "Verbraucher haben das Recht, binnen dreißig Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt dreißig Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben.",
        order_index: 0,
      },
      {
        id: "sec-canc-2",
        heading: "2. Ausübung des Widerrufsrechts",
        body:
          "Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (IXOS Audio Lautsprecher-Technologie, z. Hd. Retouren-Abteilung, Welps Esch 5, Saerbox Nr-12, 48369 Saerbeck, Deutschland, E-Mail: support@ixosaudio.com) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss informieren, diesen Vertrag zu widerrufen. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.",
        order_index: 1,
      },
      {
        id: "sec-canc-3",
        heading: "3. Folgen des Widerrufs & Rückzahlung",
        body:
          "Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Standardlieferkosten, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist. Für die Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben.",
        order_index: 2,
      },
      {
        id: "sec-canc-4",
        heading: "4. Wichtige Hinweise zu Präzisionsteilen & Transportschäden",
        body:
          "Da es sich bei Lautsprechersicken, Diaphragmen und Klebstoffen um hochsensible Bauteile handelt, müssen zurückgesendete Artikel unbenutzt, ungeklebt und in der stoßfesten Originalverpackung sein.\n\nSollte ein Artikel bei der Zustellung beschädigt eingetroffen sein, senden wir nach kurzer Fotodokumentation innerhalb von 48 Stunden sofort kostenlosen Ersatz! Sie müssen den beschädigten Artikel in diesem Fall in der Regel nicht auf eigene Kosten zurücksenden.",
        order_index: 3,
      },
      {
        id: "sec-canc-5",
        heading: "5. Rücksendeadresse unserer Manufaktur",
        body:
          "Rücksendungen senden Sie bitte stets in stabiler, knickfester Verpackung an folgende Anschrift:\n\nIXOS Lautsprecher-Technologie\nRetouren-Abteilung\nWelps Esch 5, Saerbox Nr-12\n48369 Saerbeck, Nordrhein-Westfalen\nDeutschland",
        order_index: 4,
      },
      {
        id: "sec-canc-6",
        heading: "6. Muster-Widerrufsformular (Sample Cancellation Form)",
        body:
          "(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)\n\nAn:\nIXOS Audio — Angelos Drampalis\nWelps Esch 5, Saerbox Nr-12\n48369 Saerbeck, Deutschland\nE-Mail: ixos@drampalis.de\n\nHiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*):\n\nBestellt am (*) / erhalten am (*):\nName des/der Verbraucher(s):\nAnschrift des/der Verbraucher(s):\nUnterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):\nDatum:\n\n(*) Unzutreffendes streichen.",
        order_index: 5,
      },
    ],
  },

  "customer-info": {
    id: "customer-info",
    slug: "customer-info",
    title: "Kundeninformationen (Lieferung, Zahlung & Versand)",
    subtitle:
      "Wichtige gesetzliche Pflichtinformationen zu Lieferzeiten, Lieferbeschränkungen, Versandkosten und Zahlungsarten bei IXOS Audio.",
    badge: "Gesetzliche Kundeninformationen • E-Commerce Konform",
    last_updated: "Oktober 2026",
    raw_content: `1. Liefertermin & Lieferbeschränkungen
Die Lieferung erfolgt innerhalb von 5 Werktagen (Montag bis Freitag, Feiertage ausgenommen) nach Erteilung des Zahlungsauftrags an das überweisende Kreditinstitut (bei Vorkasse) bzw. nach Vertragsschluss (bei Online-Zahlung).
Wenn für ein Produkt Lieferbeschränkungen bestehen, weisen wir in der jeweiligen Produktbeschreibung gesondert darauf hin.

2. Versandkosten & Logistikpartner
• Deutschland: Kostenloser Versand (0,00 €) ab 75 € Bestellwert, darunter 4,95 €
• Europäische Union (EU): 9,95 € Standardversand mit Sendungsverfolgung
• International / Weltweit: 14,95 € Standardversand mit Sendungsverfolgung
Alle Sendungen werden mit Deutsche Post AG und DHL Paket GmbH sicher, stoßfest und nachverfolgbar versendet.

3. Akzeptierte Zahlungsarten
In unserem Onlineshop stehen Ihnen folgende sichere Zahlungsarten zur Verfügung:
• PayPal & PayPal Express
• Kreditkarte / Debitkarte (Visa, Mastercard, Maestro, American Express)
• SEPA-Lastschrift & Sofortüberweisung (über PayPal Plus)

4. Vertragsschluss & Bestellablauf
Die Darstellung der Produkte im Onlineshop stellt kein rechtlich bindendes Angebot, sondern eine unverbindliche Aufforderung zur Bestellung dar. Durch Anklicken des Zahlungsbuttons schließen Sie die verbindliche Bestellung ab. Die Bestätigung des Eingangs Ihrer Bestellung erfolgt unmittelbar nach dem Absenden durch eine automatisierte E-Mail.

5. Kundenservice & Reklamationen
Unser Kundenservice steht Ihnen bei Fragen zu Produkten, Lieferzeiten oder technischen Spezifikationen gerne zur Verfügung:
IXOS Audio — Kundenservice
Welps Esch 5, Saerbox Nr-12, 48369 Saerbeck, Deutschland
E-Mail: support@ixosaudio.com / ixos@drampalis.de`,
    sections: [
      {
        id: "sec-cust-1",
        heading: "1. Liefertermin & Lieferbeschränkungen",
        body:
          "Die Lieferung erfolgt innerhalb von 5 Werktagen (Montag bis Freitag, Feiertage ausgenommen) nach Erteilung des Zahlungsauftrags an das überweisende Kreditinstitut (bei Vorkasse) bzw. nach Vertragsschluss (bei Online-Zahlung).\n\nWenn für ein Produkt Lieferbeschränkungen bestehen, weisen wir in der jeweiligen Produktbeschreibung gesondert darauf hin.",
        order_index: 0,
      },
      {
        id: "sec-cust-2",
        heading: "2. Versandkosten & Logistikpartner",
        body:
          "• Deutschland: Kostenloser Versand (0,00 €) ab 75 € Bestellwert, darunter 4,95 €\n• Europäische Union (EU): 9,95 € Standardversand mit Sendungsverfolgung\n• International / Weltweit: 14,95 € Standardversand mit Sendungsverfolgung\n\nAlle Sendungen werden mit Deutsche Post AG und DHL Paket GmbH sicher, stoßfest und nachverfolgbar versendet.",
        order_index: 1,
      },
      {
        id: "sec-cust-3",
        heading: "3. Akzeptierte Zahlungsarten",
        body:
          "In unserem Onlineshop stehen Ihnen folgende sichere Zahlungsarten zur Verfügung:\n• PayPal & PayPal Express\n• Kreditkarte / Debitkarte (Visa, Mastercard, Maestro, American Express)\n• SEPA-Lastschrift & Sofortüberweisung (über PayPal Plus)",
        order_index: 2,
      },
      {
        id: "sec-cust-4",
        heading: "4. Vertragsschluss & Bestellablauf",
        body:
          "Die Darstellung der Produkte im Onlineshop stellt kein rechtlich bindendes Angebot, sondern eine unverbindliche Aufforderung zur Bestellung dar. Durch Anklicken des Zahlungsbuttons schließen Sie die verbindliche Bestellung ab. Die Bestätigung des Eingangs Ihrer Bestellung erfolgt unmittelbar nach dem Absenden durch eine automatisierte E-Mail.",
        order_index: 3,
      },
      {
        id: "sec-cust-5",
        heading: "5. Kundenservice & Reklamationen",
        body:
          "Unser Kundenservice steht Ihnen bei Fragen zu Produkten, Lieferzeiten oder technischen Spezifikationen gerne zur Verfügung:\n\nIXOS Audio — Kundenservice\nWelps Esch 5, Saerbox Nr-12, 48369 Saerbeck, Deutschland\nE-Mail: support@ixosaudio.com / ixos@drampalis.de",
        order_index: 4,
      },
    ],
  },
};
