export interface EventLevelRowData {
    eventId: number;
    saleId: number;
    quoteId: number;
    rwsalesOrderNum: string;
    saleTotal: number;
    saleDate: string;
    salesRep: string;
    dropShipment: boolean;
    version: number;
    billToCompanyName?: string;
}