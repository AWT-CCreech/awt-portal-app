interface BuyOppDetail {
    eventId: number,
    detailId: number,
    partNum: string,
    partDesc: string,
    quantity: number | null,
    statusCash: string,
    statusConsignment: string,
    entryDate: Date | null,
    company: string,
    lname: string,
    askingPrice: string 
}

export default BuyOppDetail;