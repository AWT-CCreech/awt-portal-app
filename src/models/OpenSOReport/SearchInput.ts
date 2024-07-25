interface SearchInput {
    soNum?: string;
    poNum?: string;
    custPO?: string;
    partNum?: string;
    reqDateStatus?: string;
    salesTeam?: string;
    category?: string;
    salesRep?: string;
    accountNo?: string;
    customer?: string;
    chkExcludeCo?: boolean;
    chkGroupBySo?: boolean;
    chkAllHere?: boolean;
    dateFilterType?: string;
    date1?: Date;
    date2?: Date;
}

export default SearchInput;