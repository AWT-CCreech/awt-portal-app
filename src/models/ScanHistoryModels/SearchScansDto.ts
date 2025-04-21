// src/models/ScanHistoryModels/SearchScansDto.ts
export interface SearchScansDto {
    scanDateRangeStart: Date;
    scanDateRangeEnd: Date;
    orderNum: string;
    orderType: string;
    partNo: string;
    serialNo: string;
    snField: string;
    mnsCo: string;
    scanUser: string;
    limit: number;
}

export function createDefaultSearchScansDto(): SearchScansDto {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return {
        scanDateRangeStart: oneYearAgo,
        scanDateRangeEnd: today,
        orderNum: '',
        orderType: '',
        partNo: '',
        serialNo: '',
        snField: 'SerialNo',
        mnsCo: '',
        scanUser: '',
        limit: 1000,
    };
}
