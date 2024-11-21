export interface QtSalesOrder {
    SaleId: number;
    QuoteId?: number;
    EventId?: number;
    Version?: number;
    BillToCompanyName?: string;
    BillToCustNum?: string;
    BtAddr1?: string;
    BtAddr2?: string;
    BtAddr3?: string;
    BtAddr4?: string;
    ShipToCompanyName?: string;
    ShipToCustNum?: string;
    StAddr1?: string;
    StAddr2?: string;
    StAddr3?: string;
    StAddr4?: string;
    RequiredDate?: string; // ISO date string
    AccountMgr?: number;
    CustomerPo?: string;
    Terms?: string;
    ShipVia?: string;
    Comments?: string;
    ShippingHandling?: number;
    SaleTotal?: number;
    SaleDate?: string; // ISO date string
    CurType?: string;
    CurRate?: number;
    CurDate?: string; // ISO date string
    CurShipping?: number;
    CurSalesTotal?: number;
    RwsalesOrderNum?: string;
    Warranty?: number; // warranty in days
    Draft?: boolean;
    EditDate?: string; // ISO date string
    CompetitorFlag?: boolean;
    DropShipment?: boolean;
    EnteredBy?: string;
}
