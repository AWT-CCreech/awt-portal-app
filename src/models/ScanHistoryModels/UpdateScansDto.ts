export interface UpdateScanDto {
    rowId: number;
    scanDate?: Date;
    userName?: string;
    orderType?: string;
    orderNum?: string;
    partNo?: string;
    serialNo?: string;
    heciCode?: string;
}

// Optional: A factory function to create a default UpdateScanDto if needed.  
export function createDefaultUpdateScanDto(rowId: number): UpdateScanDto {
    return {
        rowId,
        // Optionally, leave out the optional fields or set them to undefined
        scanDate: undefined,
        userName: undefined,
        orderType: undefined,
        orderNum: undefined,
        partNo: undefined,
        serialNo: undefined,
        heciCode: undefined,
    };
}