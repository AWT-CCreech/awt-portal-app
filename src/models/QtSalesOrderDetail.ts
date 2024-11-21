export interface QtSalesOrderDetail {
    Id: number;
    SaleId?: number;
    RequestId?: number;
    SaleOrder?: number;
    QuoteQty?: number;
    QtySold?: number;
    UnitMeasure?: string;
    PartNum?: string;
    PartDesc?: string;
    UnitPrice?: number;
    ExtendedPrice?: number;
    CurUnitPrice?: number;
    CurExtPrice?: number;
    AutoSoflag?: boolean;
    UpdatedByAutoSo?: boolean;
    Soflag?: boolean;
}
