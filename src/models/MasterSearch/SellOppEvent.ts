interface SellOppEvent {
  eventId: number;
  contactId: number | null;
  soldOrLost: string;
  enteredBy: number | null;
  manufacturer: string;
  platform: string;
  entryDate: Date | null;
  contact: string;
  company: string;
  lname: string;
  quoteId: number;
  version: number | null;
}

export default SellOppEvent;
