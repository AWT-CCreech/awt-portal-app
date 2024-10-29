export interface TrkPoLog {
  id: number;
  ponum?: string;
  polineKey?: number;
  companyId?: string;
  issueDate?: Date;
  expectedDelivery?: Date;
  expDelEditDate?: string;
  salesOrderNum?: string;
  salesRep?: string;
  itemNum?: string;
  qtyOrdered?: number;
  qtyReceived?: number;
  receiverNum?: number;
  requiredDate?: Date;
  issuedBy?: string;
  dateDelivered?: Date;
  notes?: string;
  noteEditDate?: string;
  deleted?: boolean;
  editDate?: Date;
  editedBy?: number;
  deliveryDateEmail?: boolean;
  contactId?: number;
}
