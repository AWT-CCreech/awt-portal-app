export interface SearchScansDto {
    scanDateRangeStart: Date;
    scanDateRangeEnd: Date;
    soNo: string;
    poNo: string;
    rmano: string;
    rtvId?: number;
    partNo: string;
    serialNo: string;
    snField: string;
    mnsCo: string;
    scanUser: string;
    orderType: string;
    limit: number;
}

export function createDefaultSearchScansDto(): SearchScansDto {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return {
        scanDateRangeStart: oneYearAgo,
        scanDateRangeEnd: today,
        soNo: "",
        poNo: "",
        rmano: "",
        rtvId: undefined,
        partNo: "",
        serialNo: "",
        snField: "SerialNo",
        mnsCo: "",
        scanUser: "",
        orderType: "",
        limit: 1000,
    };
}