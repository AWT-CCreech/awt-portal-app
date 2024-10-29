interface BuyOppEvent {
  eventId: number;
  manufacturer: string;
  platform: string;
  frequency: string;
  bidDueDate: Date | null;
  statusCash: string;
  statusConsignment: string;
  entryDate: Date | null;
  company: string;
  lname: string;
  technology: string;
  comments: string;
}

export default BuyOppEvent;
