export interface InventoryRulesResponseDto {
    QtyOnHand: number;
    QtyInPick: number;
    DDQty: number;
    Adjustments: number;
    QtyFound: number;
    NeedToFind: number;
    NeedToBuy: number;
    QtyAvail: number;
    QtyBought: number;
    QtyOnHandCost: number;
    QtyInStock: number;
    QtyToBuyNew: number;
    QtySoldToday: number;
    QtyAvailToSell: number;
}