export interface ScanHistory {
    rowId: number;
    scanDate?: Date;
    scannerId?: string;
    direction?: string;
    orderType?: string;
    userName?: string;
    postId?: number;
    soNo?: string;
    poNo?: string;
    rmano?: string;
    rtvid?: number;
    partNo?: string;
    partNo2?: string;
    partNoClean?: string;
    serialNo?: string;
    serialNoB?: string;
    trackNo?: string;
    heciCode?: string;
    binLocation?: string;
    trkEventId?: number;
    rtvRmaNo?: string;
    vendorName?: string;
    mnsCompany?: string;
    mnsInventoried?: boolean;
    notes?: string;
}
