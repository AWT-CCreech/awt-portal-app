export interface CopyScansDto {
    fromCompany: string;
    toCompany: string;
    fromOrderType: string;
    toOrderType: string;
    fromOrderNum: string;
    toOrderNum: string;
    requestedBy: string;
    selectedIDs: number[];
}

export const defaultCopyScansDto: CopyScansDto = {
    fromCompany: "AirWay",
    toCompany: "AirWay",
    fromOrderType: "PO",
    toOrderType: "SO",
    fromOrderNum: "",
    toOrderNum: "",
    requestedBy: "",
    selectedIDs: []
};
