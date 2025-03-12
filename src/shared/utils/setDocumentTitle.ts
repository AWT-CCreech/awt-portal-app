import { ROUTE_PATHS } from '../../routes'; // Adjust the import path if necessary

// Define a mapping from path to document title
const DOCUMENT_TITLES: { [key: string]: string } = {
  [ROUTE_PATHS.HOME]: 'AWT Portal | Home',
  [ROUTE_PATHS.LOGIN]: 'AWT Portal | Login',
  [ROUTE_PATHS.PURCHASING.MASS_MAILER]: 'AWT Portal | Mass Mailer',
  [ROUTE_PATHS.TIME_TRACKER]: 'AWT Portal | Time Tracker',
  [ROUTE_PATHS.MASTER_SEARCH]: 'AWT Portal | Master Search',
  [ROUTE_PATHS.SALES.CUSTOMER_PO_SEARCH]: 'AWT Portal | Customer PO Search',
  [ROUTE_PATHS.SALES.OPEN_SO_REPORT]: 'AWT Portal | Open SO Report',
  [ROUTE_PATHS.SALES.SALES_ORDER_WB]: 'AWT Portal | SO Workbench',
  [ROUTE_PATHS.SALES.EVENT_SEARCH]: 'AWT Portal | Event Search',
  [ROUTE_PATHS.PURCHASING.PO_DELIVERY_LOG]: 'AWT Portal | PO Delivery Log',
  [ROUTE_PATHS.PURCHASING.DROPSHIP]: 'AWT Portal | Drop Ship',
  [ROUTE_PATHS.USER_LIST]: 'AWT Portal | User List',
  [ROUTE_PATHS.ACCOUNTING.DAILY_GOALS]: 'AWT Portal | Daily Goals Report',
  [`${ROUTE_PATHS.ACCOUNTING.DAILY_GOALS}/detail`]: 'AWT Portal | Daily Goals Detail',
};

const setDocumentTitle = (path: string): void => {
  const title = DOCUMENT_TITLES[path] || 'AWT Portal | Menu';
  document.title = title;
};

export default setDocumentTitle;
