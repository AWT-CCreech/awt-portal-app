export interface PODeliveryLog {
    id: number;
    ponum: string;
    issueDate: string | null;
    itemNum: string;
    qtyOrdered: number;
    qtyReceived: number;
    receiverNum: string | null;
    notes: string | null;
    noteEditDate: string | null;
    poRequiredDate: string | null;
    dateDelivered: string | null;
    editDate: string | null;
    expectedDelivery: string | null;
    salesOrderNum: string | null;
    customerName: string | null;
    soRequiredDate: string | null;
    salesRep: string | null;
    issuedBy: string;
    vendorName: string;
    itemClassId: number;
    altPartNum: string;
    postatus: number;
    companyId: string;
}
