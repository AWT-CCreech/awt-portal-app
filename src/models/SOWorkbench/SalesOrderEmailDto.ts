export interface SalesOrderEmailDto {
    FromEmail: string;          // Sender's email
    ToEmail: string;            // Recipient's email
    Subject: string;            // Email subject
    RecipientName: string;      // Recipient's name
    UserName: string;           // SMTP username
    Password: string;           // SMTP password
    CCEmails: string[];         // List of CC emails
    Attachments: string[];      // List of attachment file paths

    // Additional sales order details
    SalesOrderNumber: string;
    CompanyName: string;
    RequiredDate: Date;
    ExpectedDelivery: Date;
    PartNumber: string;
    Notes: string;
}