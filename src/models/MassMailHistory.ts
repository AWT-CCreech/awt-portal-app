export interface MassMailHistory {
    id: number;
    massMailId?: number;
    companyName?: string;
    contactName?: string;
    requestId?: number;
    partNum?: string;
    altPartNum?: string;
    partDesc?: string;
    qty?: number;
    dateSent?: string; // ISO formatted date string
    respondedTo?: boolean;
}