export interface SalesOrderUpdateDto {
    saleId: number;
    rwSalesOrderNum: string;
    dropShipment: boolean;
    eventId: number;
    quoteId: number;
    username: string;
    password: string;
    subject: string;
    htmlBody: string;
}