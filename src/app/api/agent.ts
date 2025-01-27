import axios, { AxiosResponse } from 'axios';
import { AccountNumbers } from '../../models/Data/AccountNumbers';
import { ActiveSalesTeams } from '../../models/Data/ActiveSalesTeams';
import { CamContact } from '../../models/CamContact';
import { IMassMailerEmailTemplate } from '../../models/MassMailer/MassMailerEmailTemplate';
import { IMassMailerPartItem } from '../../models/MassMailer/MassMailerPartItem';
import { IMassMailerVendor } from '../../models/MassMailer/MassMailerVendor';
import IMassMailerUser from '../../models/MassMailer/MassMailerUser';
import BuyOppDetail from '../../models/MasterSearch/BuyOppDetail';
import BuyOppEvent from '../../models/MasterSearch/BuyOppEvent';
import LoginInfo from '../../models/Login/LoginInfo';
import MasterSearchContact from '../../models/MasterSearch/MasterSearchContact';
import MasterSearchInput from '../../models/MasterSearch/SearchInput';
import OpenSalesOrderSearchInput from '../../models/OpenSOReport/SearchInput';
import OpenSOReport from '../../models/OpenSOReport/OpenSOReport';
import { PODetailUpdateDto } from '../../models/PODeliveryLog/PODetailUpdateDto';
import { PODeliveryLogs } from '../../models/PODeliveryLog/PODeliveryLogs';
import PODeliveryLogSearchInput from '../../models/PODeliveryLog/SearchInput';
import SellOppDetail from '../../models/MasterSearch/SellOppDetail';
import SellOppEvent from '../../models/MasterSearch/SellOppEvent';
import { TimeTracker } from '../../models/TimeTracker/TimeTracker';
import { TrkSoNote } from '../../models/TrkSoNote';
import { User } from '../../models/User';
import { ItemCategories } from '../../models/Data/ItemCategories';
import { DropShipPart } from '../../models/DropShip/DropShipPart';
import { Rep } from '../../models/Data/Rep';
import { DropShipPartsParams } from '../../models/DropShip/DropShipPartParams';
import { EquipReqSearchCriteria } from '../../models/EventSearchPage/EquipReqSearchCriteria';
import { EquipReqSearchResult } from '../../models/EventSearchPage/EquipReqSearchResult';
import { EquipmentRequestUpdateDto } from '../../models/Utility/EquipmentRequestUpdateDto';
import { SalesOrderUpdateDto } from '../../models/Utility/SalesOrderUpdateDto';

/**
 * Base URLs for both development and production environments.
 * Adjust accordingly if more environments (e.g., staging) are added.
 */
const devURL = 'http://localhost:5001/api'; // Use for development environment
const prodURL = 'http://10.0.0.8:82/api';   // Use for production environment

// Conditionally set the baseURL based on the environment variable
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = devURL;
} else {
  axios.defaults.baseURL = prodURL;
}

/**
 * Extracts the `data` property from the Axios response.
 * This is a common pattern to reduce boilerplate when handling responses.
 */
const responseBody = (response: AxiosResponse) => response.data;

/**
 * A collection of wrapper methods that standardize
 * GET, POST, PUT, and DELETE requests using axios.
 * They log requests and responses for easier debugging.
 */
const requests = {
  get: async (url: string) => {
    console.log(`GET Request to: ${url}`);
    return axios
      .get(url)
      .then(responseBody)
      .then((data) => {
        console.log(`GET Response from: ${url}`, data);
        return data;
      });
  },
  getWithParams: async (url: string, params: object) => {
    console.log(`GET Request to: ${url} with params:`, params);
    return axios
      .get(url, { params })
      .then(responseBody)
      .then((data) => {
        console.log(`GET Response from: ${url} with params:`, data);
        return data;
      });
  },
  post: async (url: string, body: object) => {
    console.log(`POST Request to: ${url} with body:`, body);
    return axios
      .post(url, body)
      .then(responseBody)
      .then((data) => {
        console.log(`POST Response from: ${url}`, data);
        return data;
      });
  },
  postNoBody: async (url: string) => {
    console.log(`POST Request to: ${url} with no body`);
    return axios
      .post(url)
      .then(responseBody)
      .then((data) => {
        console.log(`POST Response from: ${url}`, data);
        return data;
      });
  },
  put: async (url: string, body: object) => {
    console.log(`PUT Request to: ${url} with body:`, body);
    return axios
      .put(url, body)
      .then(responseBody)
      .then((data) => {
        console.log(`PUT Response from: ${url}`, data);
        return data;
      });
  },
  delete: async (url: string) => {
    console.log(`DELETE Request to: ${url}`);
    return axios
      .delete(url)
      .then(responseBody)
      .then((data) => {
        console.log(`DELETE Response from: ${url}`, data);
        return data;
      });
  },
};

/**
 * Interceptor that attaches the JWT token from localStorage
 * to the Authorization header in every outgoing request.
 */
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Interceptor that handles:
 * - Auto-refreshing tokens upon 401 responses
 * - Logging the user out if refresh also fails
 *
 * If a token refresh is successful, the original request is retried
 * with the new token. If unsuccessful, user session data is cleared.
 */
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh if we get a 401 (Unauthorized) and haven't retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const currentToken = localStorage.getItem('token');
        const refreshResponse = await axios.post('/UserLogins/refresh', {
          token: currentToken,
        });
        const newToken = refreshResponse.data.token;

        // Save new token and retry original request
        localStorage.setItem('token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // If refresh fails, clear session and redirect to /login
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('userid');
        localStorage.removeItem('expiresAt');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * CamSearch: Contains endpoints for contact searching in the "Cam" domain.
 */
const CamSearch = {
  getAdvancedSearchFields: (): Promise<
    { FieldValue: string; FieldValue2: string; FieldValue4: string }[]
  > => {
    return requests.get('/Cam/AdvancedSearchFields');
  },
  getContactTypes: (): Promise<string[]> => {
    return requests.get('/Cam/ContactTypes');
  },
  getSearchFields: (): Promise<string[]> => {
    return requests.get('/Cam/SearchFields');
  },
  searchContacts: (params: {
    searchText: string;
    username: string;
    searchBy: string;
    activeOnly?: boolean;
    orderBy?: string;
    companyId?: string;
  }): Promise<CamContact[]> => {
    return requests.getWithParams('/Cam/ContactSearch', params);
  },
};

/**
 * DataFetch: Contains endpoints that retrieve various static or reference data,
 * such as account numbers, sales reps, sales teams, etc.
 */
const DataFetch = {
  fetchAccountNumbers: async (): Promise<AccountNumbers[]> => {
    try {
      const response = await requests.get('/Sales/GetAccountNumbers');
      return response as AccountNumbers[];
    } catch (error) {
      console.error('Error fetching account numbers', error);
      throw error;
    }
  },
  fetchActiveSalesReps: async (): Promise<Rep[]> => {
    try {
      const response = await requests.get('/Sales/GetSalesReps');
      return response as Rep[];
    } catch (error) {
      console.error('Error fetching sales reps', error);
      throw error;
    }
  },
  fetchActiveSalesTeams: async (): Promise<ActiveSalesTeams[]> => {
    try {
      const response = await requests.get('/Sales/GetSalesTeams');
      return response as ActiveSalesTeams[];
    } catch (error) {
      console.error('Error fetching sales teams', error);
      throw error;
    }
  },
  fetchItemCategories: async (): Promise<ItemCategories[]> => {
    try {
      const response = await requests.get('/Sales/GetCategories');
      return response as ItemCategories[];
    } catch (error) {
      console.error('Error fetching item categories', error);
      throw error;
    }
  },
  fetchPurchasingReps: async (): Promise<Rep[]> => {
    try {
      const response = await requests.get('/Purchasing/GetPurchasingReps');
      return response as Rep[];
    } catch (error) {
      console.error('Error fetching purchasing reps', error);
      throw error;
    }
  },
  fetchDropShipParts: async (
    poNo?: string,
    soNo?: string
  ): Promise<DropShipPart[]> => {
    try {
      const params: DropShipPartsParams = {};
      if (poNo) params.poNo = poNo;
      if (soNo) params.soNo = soNo;
      const response = await requests.getWithParams(
        '/ScanHistory/GetDropShipParts',
        params
      );
      return response as DropShipPart[];
    } catch (error) {
      console.error('Error fetching drop ship parts', error);
      throw error;
    }
  },
};

/**
 * DropShip: Contains endpoints that handle the Drop Ship email process and related data fetching.
 */
const DropShip = {
  dropShipSendEmail: (emailInput: object) =>
    requests.post('/DropShipSendEmail', emailInput),
  getAllDropShipSalesReps: () => requests.get('/DropShipSalesReps'),
  getDropShipInfo: (poNum: string): Promise<any> =>
    requests.get(`/DropShipInfo/${poNum}`),
};

/**
 * EventSearchPage: Endpoints for searching events and retrieving event-based data.
 */
const EventSearchPage = {
  getEventPageData: async (
    params: EquipReqSearchCriteria
  ): Promise<EquipReqSearchResult[]> => {
    // Convert date objects to YYYY-MM-DD for backend compatibility
    const formattedParams = {
      ...params,
      fromDate: params.fromDate
        ? params.fromDate.toISOString().split('T')[0]
        : null,
      toDate: params.toDate ? params.toDate.toISOString().split('T')[0] : null,
    };

    try {
      const response = await requests.getWithParams(
        '/EventSearch/EquipmentRequestSearch',
        formattedParams
      );
      return response;
    } catch (error) {
      console.error('Error fetching Event Page data', error);
      throw error;
    }
  },
};

/**
 * MassMailer: Groups endpoints for emailing, file uploads, retrieving
 * part items, and fetching vendor/user details in the mass mailer functionality.
 */
const MassMailer = {
  ClearPartItems: {
    clear: (userid: string): Promise<any> =>
      requests.get(`/MassMailerClearPartItems/${userid}`),
  },
  EmailOuts: {
    sendEmail: (body: object) => requests.post('/MassMailerEmailOuts', body),
  },
  EmailTemplates: {
    templatesForUser: (user: string): Promise<IMassMailerEmailTemplate[]> =>
      requests.get(`/MassMailerEmailTemplates/${user}`),
  },
  FileUpload: {
    clear: (username: string): Promise<any> =>
      requests.get(`/MassMailerFileUpload/${username}`),
    upload: (body: FormData): Promise<string[]> =>
      requests.post('/MassMailerFileUpload', body),
  },
  Manufacturers: {
    manufacturerList: (): Promise<string[]> =>
      requests.get('/MassMailerManufacturers'),
  },
  PartItems: {
    partItemsForUser: (user: string): Promise<IMassMailerPartItem[]> =>
      requests.get(`/MassMailerPartItems/${user}`),
  },
  Vendors: {
    vendorList: (
      mfg: string,
      anc: boolean,
      fne: boolean
    ): Promise<IMassMailerVendor[]> => {
      return requests.get(`/MassMailerVendors/${mfg}/${anc}/${fne}`);
    },
  },
  Users: {
    getAll: (): Promise<IMassMailerUser[]> => requests.get('/MassMailerUsers'),
  },
};

/**
 * MasterSearches: A set of endpoints for buy/sell opportunity details
 * and searching contacts under the "MasterSearch" domain.
 */
const MasterSearches = {
  getBuyOppDetails: (input: MasterSearchInput): Promise<BuyOppDetail[]> =>
    requests.getWithParams('/MasterSearch/BuyOppDetails', input),
  getBuyOppEvents: (input: MasterSearchInput): Promise<BuyOppEvent[]> =>
    requests.getWithParams('/MasterSearch/BuyOppEvents', input),
  getContacts: (
    searchValue: string,
    active: boolean
  ): Promise<MasterSearchContact[]> =>
    requests.getWithParams('/MasterSearch/Contacts', { searchValue, active }),
  getSellOppDetails: (input: MasterSearchInput): Promise<SellOppDetail[]> =>
    requests.getWithParams('/MasterSearch/SellOppDetails', input),
  getSellOppEvents: (input: MasterSearchInput): Promise<SellOppEvent[]> =>
    requests.getWithParams('/MasterSearch/SellOppEvents', input),
};

/**
 * OpenSalesOrderNotes: Manages CRUD operations for notes related to sales orders.
 */
const OpenSalesOrderNotes = {
  addNote: async (note: TrkSoNote): Promise<TrkSoNote> => {
    try {
      const response = await requests.post('/OpenSalesOrderNotes/AddNote', note);
      return response as TrkSoNote;
    } catch (error) {
      console.error('Error adding note', error);
      throw error;
    }
  },
  deleteNote: async (id: number): Promise<void> => {
    try {
      await requests.delete(`/OpenSalesOrderNotes/DeleteNote/${id}`);
    } catch (error) {
      console.error('Error deleting note', error);
      throw error;
    }
  },
  getNotes: async (soNum: string, partNum: string): Promise<TrkSoNote[]> => {
    try {
      const response = await requests.get(
        `/OpenSalesOrderNotes/GetNotes/${soNum}/${partNum}`
      );
      return response as TrkSoNote[];
    } catch (error) {
      console.error('Error fetching notes', error);
      throw error;
    }
  },
  updateNote: async (id: number, note: TrkSoNote): Promise<void> => {
    try {
      await requests.put(`/OpenSalesOrderNotes/UpdateNote/${id}`, note);
    } catch (error) {
      console.error('Error updating note', error);
      throw error;
    }
  },
};

/**
 * OpenSalesOrderReport: Fetches details of open sales orders, including notes.
 */
const OpenSalesOrderReport = {
  fetchOpenSalesOrders: async (
    params: OpenSalesOrderSearchInput
  ): Promise<(OpenSOReport & { Notes: TrkSoNote[] })[]> => {
    try {
      const response = await requests.getWithParams(
        '/OpenSalesOrder/GetOpenSalesOrders',
        params
      );
      return response as (OpenSOReport & { Notes: TrkSoNote[] })[];
    } catch (error) {
      console.error('Error fetching open sales orders', error);
      throw error;
    }
  },
};

/**
 * PODeliveryLogService: Contains endpoints for retrieving purchase order delivery logs
 * and updating PO details, including vendor lookups.
 */
const PODeliveryLogService = {
  getPODeliveryLogs: async (
    params: PODeliveryLogSearchInput
  ): Promise<PODeliveryLogs[]> => {
    try {
      const response = await requests.getWithParams('/PODeliveryLog', params);
      return response as PODeliveryLogs[];
    } catch (error) {
      console.error('Error fetching open sales orders', error);
      throw error;
    }
  },

  getVendors: (params: {
    PONum?: string;
    PartNum?: string;
    IssuedBy?: string;
    SONum?: string;
    xSalesRep?: string;
    HasNotes?: string;
    POStatus?: string;
    EquipType?: string;
    CompanyID?: string;
    YearRange?: number;
  }): Promise<string[]> => {
    return requests.getWithParams('/PODeliveryLog/vendors', params);
  },

  getPODetailByID: (id: number): Promise<PODetailUpdateDto> => {
    return requests.get(`/PODetail/id/${id}`);
  },

  updatePODetail: (id: number, body: PODetailUpdateDto): Promise<void> => {
    return requests.put(`/PODetail/${id}`, body);
  },
};

/**
 * SalesOrderWorkbench: Endpoints for working with both event-level
 * and detail-level sales order data.
 */
const SalesOrderWorkbench = {
  // ----------------------------
  // 1) GET: Event-Level & Detail-Level
  // ----------------------------
  getEventLevelData: async (params: {
    salesRepId?: number;
    billToCompany?: string;
    eventId?: number;
  }): Promise<any> => {
    return requests.getWithParams('/SalesOrderWorkbench/EventLevelData', params);
  },

  getDetailLevelData: async (params: {
    salesRepId?: number;
    billToCompany?: string;
    eventId?: number;
  }): Promise<any> => {
    return requests.getWithParams('/SalesOrderWorkbench/DetailLevelData', params);
  },

  // ----------------------------
  // 2) POST: Event-Level & Detail-Level Updates
  // ----------------------------
  updateEventLevel: async (updateData: SalesOrderUpdateDto): Promise<void> => {
    // Consolidated endpoint for all event-level data updates
    return requests.post('/SalesOrderWorkbench/UpdateEventLevel', updateData);
  },

  updateDetailLevel: async (
    updateData: EquipmentRequestUpdateDto
  ): Promise<void> => {
    // Consolidated endpoint for all detail-level data updates
    return requests.post('/SalesOrderWorkbench/UpdateDetailLevel', updateData);
  },
};

/**
 * TimeTrackers: Endpoints for managing time tracking,
 * including approvals, retrieval, and sending time-tracking reports.
 */
const TimeTrackers = {
  approve: (approvals: object) =>
    requests.post('/TimeTrackerApprovals', approvals),
  get: (userId: string): Promise<TimeTracker> =>
    requests.get(`/TimeTrackers/${userId}`),
  getAllInPeriod: (
    userId: string,
    previousPeriod: boolean
  ): Promise<TimeTracker[]> =>
    requests.get(
      `/PeriodTimeTrackers?userId=${userId}&previousPeriod=${previousPeriod}`
    ),
  isApproved: (userId: string, previousPeriod: boolean) =>
    requests.get(
      `/TimeTrackerApprovals?userId=${userId}&previousPeriod=${previousPeriod}`
    ),
  sendEmailReport: (body: object) =>
    requests.post('/TimeTrackerReportSender', body),
  update: (body: TimeTracker): Promise<TimeTracker> =>
    requests.put('/TimeTrackers', body),
};

/**
 * UserList: Handles user CRUD operations for an internal user list.
 */
const UserList = {
  addUser: async (newUser: User): Promise<User> => {
    try {
      const response = await requests.post('/UserList/AddUser', newUser);
      return response as User;
    } catch (error) {
      console.error('Error adding user', error);
      throw error;
    }
  },
  deleteUser: async (uid: number): Promise<void> => {
    try {
      await requests.delete(`/UserList/DeleteUser/${uid}`);
    } catch (error) {
      console.error('Error deleting user', error);
      throw error;
    }
  },
  fetchUserList: async (): Promise<User[]> => {
    try {
      const response = await requests.get('/UserList/GetUserList');
      return response as User[];
    } catch (error) {
      console.error('Error fetching users', error);
      throw error;
    }
  },
  updateUser: async (uid: number, updatedUser: User): Promise<User> => {
    try {
      const response = await requests.put(
        `/UserList/UpdateUser/${uid}`,
        updatedUser
      );
      return response as User;
    } catch (error) {
      console.error('Error updating user', error);
      throw error;
    }
  },
};

/**
 * UserLogins: Endpoints responsible for user authentication
 * and token refresh mechanisms.
 */
const UserLogins = {
  authenticate: (loginInfo: LoginInfo): Promise<LoginInfo> =>
    requests.post('/UserLogins', loginInfo),

  refreshToken: (
    tokenRefreshRequest: { token: string }
  ): Promise<{ token: string }> =>
    requests.post('/Token/RefreshToken', tokenRefreshRequest),
};

/**
 * Modules: A grouped export of all services for easier imports in other parts
 * of the application. Each property corresponds to one of the logical groups
 * defined above.
 */
const Modules = {
  CamSearch,
  DataFetch,
  DropShip,
  EventSearchPage,
  MassMailer,
  MasterSearches,
  OpenSalesOrderNotes,
  OpenSalesOrderReport,
  PODeliveryLogService,
  SalesOrderWorkbench,
  TimeTrackers,
  UserList,
  UserLogins,
};

export default Modules;
