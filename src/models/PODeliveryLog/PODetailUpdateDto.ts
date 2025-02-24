export interface PODetailUpdateDto {
  id: number;
  newNote: string | null;
  expectedDelivery: Date | null;
  userId: number | null;
  userName: string;
  password?: string | null;
  contactID: number;
  poNum: string;
  soNum: string;
  partNum: string;
  updateAllDates: boolean;
  urgentEmail: boolean;
  qtyOrdered?: number | null;
  qtyReceived?: number | null;
  receiverNum?: number | null;
  notesList: string[];
  contactName: string;
  company: string;
  title: string;
  phone: string;
  issuedBy: string;
  editDate: string;
  editedBy: string | null;
  expDelEditDate: string;
  dateDelivered: string;
}
