export interface EquipmentRequest {
    RequestId: number;
    EventId?: number;
    PartDesc?: string;
    PartNum?: string;
    AltPartNum?: string;
    Quantity?: number;
    RevSpecific?: number;
    RevDetails?: string;
    UnitMeasure?: string;
    CustomerPricing?: string;
    DateNeeded?: string; // ISO date string
    Manufacturer?: string;
    Platform?: string;
    Technology?: string;
    Frequency?: string;
    RwpartNumFlag?: boolean;
    RwqtyFlag?: boolean;
    QuoteNum?: string;
    Comments?: string;
    EquipFound?: boolean;
    PartialFound?: boolean;
    AllPossibilities?: boolean;
    AllPossDate?: string; // ISO date string
    AllPossBy?: number;
    SalesOrderNum?: string;
    SalePrice?: number;
    MarkedSoldDate?: string; // ISO date string
    Bought?: boolean;
    QuoteFullQty?: boolean;
    MassMailing?: boolean;
    MassMailDate?: string; // ISO date string
    MassMailSentBy?: number;
    Status?: string;
    ReasonLost?: string;
    CancelDate?: string; // ISO date string
    CanceledBy?: number;
    EquipmentType?: string;
    Category?: string;
    QtySold?: number;
    LostButOngoing?: boolean;
    OnGoingDate?: string; // ISO date string
    InBuyingOpp?: boolean;
    BuyingOppId?: string;
    OnHold?: boolean;
    ProcureRep?: number;
    EntryDate?: string; // ISO date string
    EnteredBy?: number;
    ModifiedDate?: string; // ISO date string
    ModifiedBy?: number;
    QuoteDeadLine?: string; // ISO date string
    Urgent?: number;
    WorkbenchDate?: string; // ISO date string
    SoldWorkbenchDate?: string; // ISO date string
    WbnotifyFlag?: boolean;
    UsedPart?: number;
    InvalidPartNum?: boolean;
    InvalidPartDate?: string; // ISO date string
    Amsnoozed?: number;
    AmsnoozeDate?: string; // ISO date string
    FoundEmailSent?: boolean;
    DexterId?: number;
    Pwbflag?: boolean;
    Rmaflag?: number;
    TechWbreqForSo?: boolean;
    ZeroLeftToFind?: boolean;
    DropShipment?: boolean;
    Porequired?: number;
    NeedToBuy?: number;
    NeedToBuyTs?: string; // ISO date string
    SoldWborder?: boolean;
}
