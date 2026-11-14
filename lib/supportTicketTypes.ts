export type SupportTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type SupportTicketPriority = 'low' | 'normal' | 'urgent';

export interface SupportTicket {
  id: string;
  ticket_number: string;
  name: string;
  email: string;
  phone?: string;
  order_id?: string;
  category: string;
  subject: string;
  message: string;
  speaker_model?: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  created_at: string;
  updated_at: string;
  admin_notes?: string;
  source?: string;
}

export const TICKET_CATEGORIES = [
  { id: 'order_status', labelDe: 'Bestellstatus & Sendungsverfolgung', labelEn: 'Order Status & Tracking', labelEl: 'Κατάσταση Παραγγελίας & Παρακολούθηση' },
  { id: 'returns', labelDe: 'Rückgabe, Widerruf & Reklamation', labelEn: 'Return, Cancellation & Claims', labelEl: 'Επιστροφή, Υπαναχώρηση & Αξιώσεις' },
  { id: 'compatibility', labelDe: 'Lautsprecher-Kompatibilität & Beratung', labelEn: 'Speaker Compatibility & Advice', labelEl: 'Συμβατότητα Ηχείων & Συμβουλές' },
  { id: 'repair', labelDe: 'Reparaturanfrage & Werkstattservice', labelEn: 'Repair Inquiry & Workshop Service', labelEl: 'Αίτημα Επισκευής & Τεχνική Υπηρεσία' },
  { id: 'general', labelDe: 'Allgemeine Anfrage', labelEn: 'General Inquiry', labelEl: 'Γενική Ερώτηση' },
] as const;
