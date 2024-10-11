export interface PODeliveryLogs {
    id: number;
    ponum: string;
    issueDate: string | null;
    itemNum: string;
    qtyOrdered: number;
    qtyReceived: number;
    receiverNum: string | null;
    notesExist: boolean | null;
    noteEditDate: string | null;
    poRequiredDate: string | null;
    dateDelivered: string | null;
    editDate: string | null;
    expectedDelivery: string | null;
    sonum: string | null;
    customerName: string | null;
    soRequiredDate: Date | null;
    salesRep: string | null;
    issuedBy: string;
    vendorName: string;
    itemClassId: number;
    altPartNum: string;
    postatus: number;
    companyId: string;
    contactId?: number;
    isDropShipment: boolean;
}
