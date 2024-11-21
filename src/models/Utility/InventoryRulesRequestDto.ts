export interface InventoryRulesRequestDto {
    RequestID: number;
    PartNum: string;
    AltPartNum?: string;
    Quantity: number;
    QtySold: number;
    CallDateRange: number;
    RequestStatus: string;
}