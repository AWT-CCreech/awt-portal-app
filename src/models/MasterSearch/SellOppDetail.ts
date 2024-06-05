interface SellOppDetail {
    eventId: number,
    contactId: number | null,
    enteredBy: number | null,
    requestId: number | null,
    quantity: number | null,
    manufacturer: string,
    partNum: string,
    altPartNum: string,
    partDesc: string,
    equipFound: boolean | null,
    qtFound: number,
    contact: string,
    company: string,
    lname: string,
    entryDate: Date | null,
    quoteId: number,
    version: number | null
}

export default SellOppDetail;