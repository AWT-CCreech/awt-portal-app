export interface DetailLevelRowData {
    id: number; // EquipmentRequest ID
    eventId: number;
    saleId: number;
    requestId: number;
    rwsalesOrderNum: string; // Origin: QtSalesOrderNum
    salesOrderNum: string; // Origin: EquipmentRequest
    qtySold: number;
    unitMeasure: string;
    partNum: string;
    partDesc: string;
    unitPrice: number;
    salesRep: string;
}