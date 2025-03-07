export interface CustomerPOSearchResult {
    custPoNo: string;
    soTranNo: string;
    soTranAmt: number;
    soTranDate: string; // ISO date string
    customerName: string;
    custNum: string;
    eventID?: number;
    saleID?: number;
    quoteID?: number;
}
