const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'admin', 'AdminClientPage.tsx');
let c = fs.readFileSync(filePath, 'utf8');

const translations = [
  // Headers & titles
  [/Hauptverwaltungszentrale — IXOS Audio Webshop/g, "Administration Portal — Wastram Atelier"],
  [/IXOS Audio/g, "Wastram Atelier"],
  [/IXOS/g, "Wastram"],
  [/Produkte/g, "Products"],
  [/Produkt/g, "Product"],
  [/Kategorien/g, "Categories"],
  [/Kategorie/g, "Category"],
  [/Bestellungen/g, "Orders"],
  [/Bestellung/g, "Order"],
  [/Kunden/g, "Customers"],
  [/Kunde/g, "Customer"],
  [/Bewertungen/g, "Reviews"],
  [/Bewertung/g, "Review"],
  [/Rabatte/g, "Discounts"],
  [/Rabatt/g, "Discount"],
  [/Versand/g, "Shipping"],
  [/Rechtliches/g, "Legal & Policies"],
  [/Einstellungen/g, "Settings"],
  [/Speichern/g, "Save"],
  [/Gespeichert/g, "Saved"],
  [/Löschen/g, "Delete"],
  [/Gelöscht/g, "Deleted"],
  [/Bearbeiten/g, "Edit"],
  [/Abbrechen/g, "Cancel"],
  [/Hinzufügen/g, "Add"],
  [/Zurück/g, "Back"],
  [/Aktualisieren/g, "Refresh"],
  [/Aktualisiert/g, "Updated"],
  [/Erfolgreich/g, "Successful"],
  [/Fehler/g, "Error"],
  [/Suche/g, "Search"],
  [/Suchen/g, "Search"],
  [/Übersicht/g, "Overview"],
  [/Lagerbestand/g, "Inventory"],
  [/Bestand/g, "Stock"],
  [/Preis/g, "Price"],
  [/Preise/g, "Pricing"],
  [/Status/g, "Status"],
  [/Aktionen/g, "Actions"],
  [/Aktiv/g, "Active"],
  [/Inaktiv/g, "Inactive"],
  [/Ausblenden/g, "Hide"],
  [/Einblenden/g, "Show"],
  [/Wählen Sie unten eine Kategorie aus, um deren Produkte anzuzeigen und zu verwalten/g, "Select a category below to browse and manage atelier wholesale catalogue products"],
  [/Produkte durchsuchen\.\.\./g, "Search products by title, SKU, or fabric..."],
  [/Produkt hinzufügen/g, "Add New Product"],
  [/Alle Produkte/g, "All Collections"],
  [/Produkte insgesamt/g, "products in total catalogue"],
  [/Alle durchsuchen/g, "Browse All Products"],
  [/Kategorie erstellen/g, "Create Category"],
  [/Neue Kategorie/g, "New Category"],
  [/Kategorie bearbeiten/g, "Edit Category"],
  [/Beschreibung/g, "Description"],
  [/Name/g, "Name"],
  [/Titel/g, "Title"],
  [/Bild/g, "Image"],
  [/Bilder/g, "Images"],
  [/Varianten/g, "Color Variants"],
  [/Variante/g, "Color Variant"],
  [/Details/g, "Details"],
  [/Eigenschaften/g, "Specifications"],
  [/Stück/g, "pcs"],
  [/pro Packung/g, "per pack"],
  [/Zahlung/g, "Payment"],
  [/Zahlungen/g, "Payments"],
  [/Abmelden/g, "Log Out"],
  [/Sicherheits-Passcode/g, "Security Passcode"],
  [/Passcode eingeben/g, "Enter Passcode"],
  [/Anmelden/g, "Sign In"],
  [/Admin-Portal/g, "Admin Portal"],
  [/Verwaltungskonsole/g, "Administration Console"],
  [/Live-Shop/g, "Live Store"],
  [/Öffnen/g, "Open"],
  [/Schließen/g, "Close"],
  [/Ja/g, "Yes"],
  [/Nein/g, "No"],
  [/Bestätigen/g, "Confirm"],
  [/Möchten Sie dieses Produkt wirklich löschen\?/g, "Are you sure you want to delete this product?"]
];

for (const [re, rep] of translations) {
  c = c.replace(re, rep);
}

// Ensure currency symbols in rendered markup use ₹ instead of €
c = c.replace(/€/g, '₹');

fs.writeFileSync(filePath, c, 'utf8');
console.log('Successfully translated AdminClientPage.tsx to English and updated currency to INR (₹)');
