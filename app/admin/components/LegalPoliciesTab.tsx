"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Save,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Eye,
  Edit3,
  FileUp,
} from "lucide-react";
import {
  DEFAULT_POLICIES,
  STARTER_TEMPLATES,
  PoliciesMap,
  PolicyDocument,
  getPolicyRawContent,
  parseRawPolicyContent,
} from "@/lib/policiesTypes";
import { notifyAdmin } from "./AdminToast";

type PolicyKey = "terms" | "privacy" | "cookies" | "cancellation" | "customer-info";
type PreviewLangKey = "de" | "en" | "el";

interface PolicyTabInfo {
  key: PolicyKey;
  label: string;
  slug: string;
}

const POLICY_TABS: PolicyTabInfo[] = [
  {
    key: "terms",
    label: "AGB",
    slug: "/terms",
  },
  {
    key: "privacy",
    label: "Datenschutzerklärung",
    slug: "/privacy",
  },
  {
    key: "cookies",
    label: "Cookie-Richtlinie",
    slug: "/cookies",
  },
  {
    key: "cancellation",
    label: "Widerrufsbelehrung & Retouren (30 Tage)",
    slug: "/returns",
  },
  {
    key: "customer-info",
    label: "Kundeninformationen",
    slug: "/customer-info",
  },
];

const PREVIEW_LANGS: { key: PreviewLangKey; label: string; flag: string }[] = [
  { key: "de", label: "Deutsch", flag: "🇩🇪" },
  { key: "en", label: "Englisch", flag: "🇬🇧" },
  { key: "el", label: "Griechisch", flag: "🇬🇷" },
];

export default function LegalPoliciesTab() {
  const [policies, setPolicies] = useState<PoliciesMap>(DEFAULT_POLICIES);
  const [activeTab, setActiveTab] = useState<PolicyKey>("terms");
  const [rawText, setRawText] = useState<string>("");
  const [previewLang, setPreviewLang] = useState<PreviewLangKey>("de");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPolicyGermanText = (doc: PolicyDocument): string => {
    if (doc.translations?.de?.raw_content) {
      return doc.translations.de.raw_content;
    }
    if (doc.raw_content) {
      return doc.raw_content;
    }
    return getPolicyRawContent(doc);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/policies?t=" + Date.now());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted && data && typeof data === "object") {
          setPolicies((prev) => ({ ...prev, ...data }));
          const currentDoc = data[activeTab] || DEFAULT_POLICIES[activeTab];
          setRawText(getPolicyGermanText(currentDoc));
        }
      } catch (err: any) {
        console.warn("[LegalPoliciesTab] Fetch warning:", err);
        setRawText(getPolicyGermanText(DEFAULT_POLICIES[activeTab]));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPolicies();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectTab = (tabKey: PolicyKey) => {
    if (tabKey === activeTab) return;
    if (hasUnsavedChanges) {
      if (!confirm("Ungespeicherte Änderungen verwerfen?")) return;
    }
    setActiveTab(tabKey);
    const targetDoc = policies[tabKey] || DEFAULT_POLICIES[tabKey];
    setRawText(getPolicyGermanText(targetDoc));
    setHasUnsavedChanges(false);
    setViewMode("edit");
    setPreviewLang("de");
  };

  const currentTabInfo = POLICY_TABS.find((t) => t.key === activeTab)!;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawText(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      notifyAdmin("error", "Ungültige Datei", "Bitte wählen Sie eine .pdf-Datei aus.");
      return;
    }

    try {
      setUploadingPdf(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/policies/extract-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "PDF konnte nicht gelesen werden.");
      }

      setRawText(data.text);
      setHasUnsavedChanges(true);
      setViewMode("edit");
      notifyAdmin("success", "PDF hochgeladen", `Text erfolgreich aus ${file.name} extrahiert.`);
    } catch (err: any) {
      console.error("[PDF Upload Error]:", err);
      notifyAdmin("error", "Upload fehlgeschlagen", err.message || "PDF konnte nicht gelesen werden.");
    } finally {
      setUploadingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClearSheet = () => {
    if (!confirm("Dieses Dokument leeren?")) return;
    setRawText("");
    setHasUnsavedChanges(true);
    notifyAdmin("info", "Geleert", "Dokument ist nun leer.");
  };

  const handleLoadDefaultTemplate = () => {
    if (!confirm("Standard-Vorlage laden?")) return;
    const templateDoc = STARTER_TEMPLATES[activeTab] || DEFAULT_POLICIES[activeTab];
    const templateText = getPolicyGermanText(templateDoc);
    setRawText(templateText);
    setHasUnsavedChanges(true);
    notifyAdmin("info", "Vorlage geladen", "Standard-Vorlage geladen.");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);

      const parsedSections = parseRawPolicyContent(rawText, activeTab);

      const res = await fetch("/api/policies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeTab,
          raw_content: rawText,
          source_language: "de",
          force_retranslate: true,
          sections: parsedSections,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Richtlinie konnte nicht gespeichert werden.");
      }

      if (data.policy) {
        setPolicies((prev) => ({
          ...prev,
          [activeTab]: data.policy,
        }));
      }

      setHasUnsavedChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      notifyAdmin("success", "Gespeichert", `${currentTabInfo.label} aktualisiert.`);
    } catch (err: any) {
      console.error("[LegalPoliciesTab] Save error:", err);
      notifyAdmin("error", "Speichern fehlgeschlagen", err.message || "Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  };

  const currentDoc = policies[activeTab] || DEFAULT_POLICIES[activeTab];
  const activePreviewText =
    previewLang === "de"
      ? rawText
      : currentDoc.translations?.[previewLang]?.raw_content ||
        (hasUnsavedChanges
          ? `(Richtlinie speichern, um ${previewLang.toUpperCase()}-Übersetzung zu aktualisieren)`
          : getPolicyGermanText(currentDoc));

  const previewSections = parseRawPolicyContent(activePreviewText, activeTab);
  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full space-y-4 font-sans text-neutral-900 animate-fade-in max-w-5xl mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePdfUpload}
        accept="application/pdf,.pdf"
        className="hidden"
      />

      {/* ─── MINIMAL HEADER ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Rechtliches &amp; Richtlinien
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={currentTabInfo.slug}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live ansehen</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shadow-2xs ${
              saveSuccess
                ? "bg-emerald-600 text-white"
                : "bg-black hover:bg-neutral-800 text-white disabled:opacity-50"
            }`}
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Wird gespeichert...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Gespeichert</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Speichern</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── TABS ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5">
        {POLICY_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleSelectTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-black text-white shadow-2xs"
                  : "bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── CANVAS CARD ─────────────────────────────────────────────── */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-2xs overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-neutral-200 bg-neutral-50/60">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-900">
              {currentTabInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPdf}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
            >
              {uploadingPdf ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-neutral-500" />
                  <span>Wird gelesen...</span>
                </>
              ) : (
                <>
                  <FileUp className="w-3 h-3 text-neutral-500" />
                  <span>PDF hochladen</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleLoadDefaultTemplate}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-neutral-500" />
              <span>Vorlage</span>
            </button>

            <button
              type="button"
              onClick={handleClearSheet}
              className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
            >
              <span>Leeren</span>
            </button>

            <div className="w-[1px] h-3.5 bg-neutral-200 mx-0.5" />

            <div className="inline-flex rounded-md border border-neutral-200 bg-neutral-100 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1 ${
                  viewMode === "edit"
                    ? "bg-white text-black shadow-2xs font-semibold"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Schreiben</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1 ${
                  viewMode === "preview"
                    ? "bg-white text-black shadow-2xs font-semibold"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Vorschau</span>
              </button>
            </div>
          </div>
        </div>

        {/* Editor Body */}
        {viewMode === "edit" ? (
          <div className="p-4 sm:p-5">
            <textarea
              value={rawText}
              onChange={handleTextChange}
              placeholder="Schreiben oder fügen Sie den Richtlinientext hier ein..."
              rows={22}
              className="w-full text-xs sm:text-sm leading-relaxed font-sans bg-transparent border-0 focus:outline-none focus:ring-0 text-neutral-900 resize-y placeholder:text-neutral-400 min-h-[460px]"
            />
          </div>
        ) : (
          <div className="p-4 sm:p-6 min-h-[460px] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">Sprache:</span>
                <div className="inline-flex items-center gap-1 bg-neutral-50 border border-neutral-200 rounded-lg p-0.5">
                  {PREVIEW_LANGS.map((lang) => {
                    const isSelected = previewLang === lang.key;
                    return (
                      <button
                        key={lang.key}
                        type="button"
                        onClick={() => setPreviewLang(lang.key)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs rounded transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-black text-white font-medium shadow-2xs"
                            : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <span className="text-xs text-neutral-400 font-mono">
                {previewSections.length} Abschnitte
              </span>
            </div>

            {previewSections.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-neutral-300 mb-2" />
                <p className="text-xs font-medium text-neutral-400">Noch nicht hinzugefügt</p>
              </div>
            ) : (
              <div className="space-y-5">
                {previewSections.map((sec) => (
                  <div key={sec.id} className="space-y-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 uppercase tracking-wide">
                      {sec.heading}
                    </h3>
                    <div className="text-xs text-neutral-600 whitespace-pre-line leading-relaxed pl-2.5 border-l-2 border-neutral-200">
                      {sec.body}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Bar */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-neutral-200 bg-neutral-50/40 text-xs">
          <div className="flex items-center gap-2 text-neutral-500">
            <span>{wordCount} Wörter</span>
            <span>&bull;</span>
            <span>{previewSections.length} Abschnitte</span>
            {hasUnsavedChanges && (
              <>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Ungespeichert
                </span>
              </>
            )}
            {!rawText.trim() && !hasUnsavedChanges && (
              <>
                <span>&bull;</span>
                <span className="text-neutral-400">Nicht hinzugefügt</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer shadow-2xs ${
              saveSuccess
                ? "bg-emerald-600 text-white"
                : "bg-black hover:bg-neutral-800 text-white disabled:opacity-50"
            }`}
          >
            {saving ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Wird gespeichert...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>Gespeichert</span>
              </>
            ) : (
              <>
                <Save className="w-3 h-3" />
                <span>Speichern</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
