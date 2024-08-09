import { PoLogEntry } from './PoLogEntry';
import { TrkSoNote } from '../TrkSoNote';

interface OpenSOReport {
    id: number;
    sonum?: string;
    requiredDate?: Date;
    orderDate?: Date;
    customerName?: string;
    accountNo?: string;
    custPo?: string;
    accountTeam?: string;
    salesRep?: string;
    qtyOrdered?: number;
    qtyReceived?: number;
    leftToShip?: number;
    orgLeftToShip?: number;
    itemNum?: string;
    mfgNum?: string;
    unitPrice?: number;
    amountLeft?: number;
    eventId?: number;
    category?: string;
    ponum?: string;
    poissueDate?: Date;
    ponote?: boolean;
    ponoteDate?: Date;
    expectedDelivery?: Date;
    allHere?: boolean;
    receivedOnPothatDay?: boolean;
    entryDate?: Date;
    notes: TrkSoNote[];
    poLog?: PoLogEntry; // Updated to use the new interface
}

export default OpenSOReport;
