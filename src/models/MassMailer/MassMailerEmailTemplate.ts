export interface MassMailerEmailTemplate {
  id: number;
  emailType: string;
  emailDesc: string;
  emailSubject: string;
  emailBody: string;
  active: boolean;
  defaultMsg: boolean;
  enteredBy: string;
  entryDate: string;
  modifiedBy: string;
  modifiedDate: string;
}
