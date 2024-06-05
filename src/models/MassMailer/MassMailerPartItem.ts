export interface IMassMailerPartItem {
    id: number,
    partNum: string,
    altPartNum: string,
    partDesc: string,
    qty: number,
    company: string,
    manufacturer: string,
    revision: string;
    [key: string]: string | number;
}