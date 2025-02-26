export interface EventLevelUpdateDto {
    SaleId: number;
    SalesOrderNum: string;
    DropShipment: boolean;
    EventId?: number;
    QuoteId?: number;
    Username: string;
    Password: string;
    Subject: string;
    HtmlBody: string;
}