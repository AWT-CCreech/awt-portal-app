export interface MassMailer {
    massMailId: number;
    massMailDesc?: string;
    dateSent?: string; // ISO formatted date string
    sentBy?: number;
}