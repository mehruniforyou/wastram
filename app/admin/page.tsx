import React from "react";
import AdminClientPage from "./AdminClientPage";

export const metadata = {
  title: "Wastram Atelier // Admin Console",
  description: "Administrative control center for Wastram wholesale apparel, catalog, and inventory.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClientPage />;
}
