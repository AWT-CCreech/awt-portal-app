import axios, { AxiosResponse } from 'axios';
import { TokenRefreshRequest } from '../../models/Auth/TokenRefreshRequest';
import { TokenRefreshResponse } from '../../models/Auth/TokenRefreshResponse';
import { LoginRequest } from '../../models/Auth/LoginRequest';
import { LoginResponse } from '../../models/Auth/LoginResponse';
import { AccountNumbers } from '../../models/Data/AccountNumbers';
import { ActiveSalesTeams } from '../../models/Data/ActiveSalesTeams';
import { ItemCategories } from '../../models/Data/ItemCategories';
import { Rep } from '../../models/Data/Rep';
import { CamContact } from '../../models/CamContact';
import { createDefaultSearchScansDto, SearchScansDto } from '../../models/ScanHistoryModels/SearchScansDto';
import { createDefaultUpdateScanDto, UpdateScanDto } from '../../models/ScanHistoryModels/UpdateScanDto';
import { CustomerPOSearchResult } from '../../models/CustomerPOSearch/CustomerPOSearchResult';
import { DailyGoalDetail } from '../../models/DailyGoalsReport/DailyGoalDetail';
import { DailyGoalsReport } from '../../models/DailyGoalsReport/DailyGoalsReport';
import { defaultCopyScansDto, CopyScansDto } from '../../models/ScanHistoryModels/CopyScansDto';
import { DetailLevelUpdateDto } from '../../models/SOWorkbench/DetailLevelUpdateDto';
import { EventLevelUpdateDto } from '../../models/SOWorkbench/EventLevelUpdateDto';
import { EquipReqSearchCriteria } from '../../models/EventSearchPage/EquipReqSearchCriteria';
import { EquipReqSearchResult } from '../../models/EventSearchPage/EquipReqSearchResult';
import BuyOppDetail from '../../models/MasterSearch/BuyOppDetail';
import BuyOppEvent from '../../models/MasterSearch/BuyOppEvent';
import MasterSearchContact from '../../models/MasterSearch/MasterSearchContact';
import MasterSearchInput from '../../models/MasterSearch/SearchInput';
import SellOppDetail from '../../models/MasterSearch/SellOppDetail';
import SellOppEvent from '../../models/MasterSearch/SellOppEvent';
import { MassMailerEmailTemplate } from '../../models/MassMailer/MassMailerEmailTemplate';
import { MassMailerPartItem } from '../../models/MassMailer/MassMailerPartItem';
import { MassMailerVendor } from '../../models/MassMailer/MassMailerVendor';
import MassMailerUser from '../../models/MassMailer/MassMailerUser';
import { MassMailHistory } from '../../models/MassMailHistory';
import OpenSOReport from '../../models/OpenSOReport/OpenSOReport';
import OpenSalesOrderSearchInput from '../../models/OpenSOReport/SearchInput';
import { PortalMenuItemDto } from '../../models/PortalMenu/PortalMenuItemDto';
import { PortalRouteDto } from '../../models/PortalMenu/PortalRouteDto';
import { PODetailUpdateDto } from '../../models/PODeliveryLog/PODetailUpdateDto';
import { PODeliveryLogs } from '../../models/PODeliveryLog/PODeliveryLogs';
import PODeliveryLogSearchInput from '../../models/PODeliveryLog/SearchInput';
import { TimeTracker } from '../../models/TimeTracker/TimeTracker';
import { TrkSoNote } from '../../models/TrkSoNote';
import { User } from '../../models/User';
import { WorkspaceDto } from '../../models/PortalMenu/WorkspaceDto';


/**
 * Base URLs for both development and production environments.
 */
const devURL = 'http://localhost:5001/api';
const prodURL = 'http://10.0.0.8:82/api';

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? devURL : prodURL;

/**
 * Extracts the `data` property from the Axios response.
 */
const responseBody = (response: AxiosResponse) => response.data;

/**
 * A collection of wrapper methods for GET, POST, PUT, and DELETE requests.
 */
const requests = {
  get: async <T>(url: string): Promise<T> => {
    console.log(`GET Request to: ${url}`);
    return axios.get<T>(url)
      .then(responseBody)
      .then(data => {
        console.log(`GET Response from: ${url}`, data);
        return data;
      });
  },

  getWithParams: async <T>(url: string, params: object): Promise<T> => {
    console.log(`GET Request to: ${url} with params:`, params);
    return axios.get<T>(url, { params })
      .then(responseBody)
      .then(data => {
        console.log(`GET Response from: ${url}`, data);
        return data;
      });
  },

  post: async <T>(url: string, body: object): Promise<T> => {
    console.log(`POST Request to: ${url} with body:`, body);
    return axios.post<T>(url, body)
      .then(responseBody)
      .then(data => {
        console.log(`POST Response from: ${url}`, data);
        return data;
      });
  },

  postNoBody: async <T>(url: string): Promise<T> => {
    console.log(`POST Request to: ${url} with no body`);
    return axios.post<T>(url)
      .then(responseBody)
      .then(data => {
        console.log(`POST Response from: ${url}`, data);
        return data;
      });
  },

  put: async <T>(url: string, body: object): Promise<T> => {
    console.log(`PUT Request to: ${url} with body:`, body);
    return axios.put<T>(url, body)
      .then(responseBody)
      .then(data => {
        console.log(`PUT Response from: ${url}`, data);
        return data;
      });
  },

  delete: async <T>(url: string): Promise<T> => {
    console.log(`DELETE Request to: ${url}`);
    return axios.delete<T>(url)
      .then(responseBody)
      .then(data => {
        console.log(`DELETE Response from: ${url}`, data);
        return data;
      });
  },
};

/**
 * Request interceptor to attach JWT token to every outgoing request.
 */
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Response interceptor to handle token refresh.
 */
axios.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const rawToken = localStorage.getItem('token');
      const rawRefreshToken = localStorage.getItem('refreshToken');

      try {
        // guarantee these are strings, not null
        if (!rawToken || !rawRefreshToken) {
          // bail out (e.g. force logout) if either is missing
          Modules.UserLogins.logout(rawRefreshToken!);
          localStorage.clear();
          window.location.href = '/login';
          return;
        }

        const { token: newToken, refreshToken: newRefresh } =
          await UserLogins.refreshToken({
            token: rawToken,
            refreshToken: rawRefreshToken
          });

        localStorage.setItem('token', newToken);
        localStorage.setItem('refreshToken', newRefresh);
        original.headers.Authorization = `Bearer ${newToken}`;
        return axios(original);
      } catch {
        Modules.UserLogins.logout(rawRefreshToken!);
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * CamSearch: Endpoints for contact searching in the "Cam" domain.
 */
const CamSearch = {
  getAdvancedSearchFields: (): Promise<{ FieldValue: string; FieldValue2: string; FieldValue4: string }[]> =>
    requests.get('/Cam/AdvancedSearchFields'),
  getContactTypes: (): Promise<string[]> => requests.get('/Cam/ContactTypes'),
  getSearchFields: (): Promise<string[]> => requests.get('/Cam/SearchFields'),
  searchContacts: (params: { searchText: string; username: string; searchBy: string; activeOnly?: boolean; orderBy?: string; companyId?: string }): Promise<CamContact[]> =>
    requests.getWithParams('/Cam/ContactSearch', params),
};

/** 
 * Customer PO Search: Endpoints for searching customer POs and retrieving AWT EID, QID, SID.
 */
const CustomerPOSearch = {
  searchByPONum: async (PONum: string): Promise<CustomerPOSearchResult[]> => {
    const params = { PONum };
    try {
      const response = await requests.getWithParams('/CustomerPO/search', params);
      return response as CustomerPOSearchResult[];
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`PO#${PONum} not found`);
        return []; // gracefully return empty result
      }
      throw error; // rethrow for other errors
    }
  },
};

/**
 * DataFetch: Endpoints to retrieve various static or reference data.
 */
const DataFetch = {
  fetchAccountNumbers: async (): Promise<AccountNumbers[]> => {
    const response = await requests.get('/Sales/GetAccountNumbers');
    return response as AccountNumbers[];
  },
  fetchActiveSalesReps: async (): Promise<Rep[]> => {
    const response = await requests.get('/Sales/GetSalesReps');
    return response as Rep[];
  },
  fetchActiveSalesTeams: async (): Promise<ActiveSalesTeams[]> => {
    const response = await requests.get('/Sales/GetSalesTeams');
    return response as ActiveSalesTeams[];
  },
  fetchItemCategories: async (): Promise<ItemCategories[]> => {
    const response = await requests.get('/Sales/GetCategories');
    return response as ItemCategories[];
  },
  fetchPurchasingReps: async (): Promise<Rep[]> => {
    const response = await requests.get('/Purchasing/GetPurchasingReps');
    return response as Rep[];
  },
  // ... additional data endpoints
};

/**
 * DailyGoals: Endpoints for retrieving the daily goals report.
 */
const DailyGoals = {
  getReport: async (params: { Months?: string; Years?: string }): Promise<DailyGoalsReport> => {
    try {
      console.log("Fetching Daily Goals Report with params:", params);
      const response = await requests.getWithParams('/DailyGoalsReport', params);
      return response as DailyGoalsReport;
    } catch (error) {
      console.error("Error fetching Daily Goals Report", error);
      throw error;
    }
  },
  getDetail: async (params: { DisplayType: string; SearchDate: string }): Promise<DailyGoalDetail[]> => {
    try {
      console.log("Fetching Daily Goals Detail with params:", params);
      const response = await requests.getWithParams('/DailyGoalsReport/detail', params);
      return response as DailyGoalDetail[];
    } catch (error) {
      console.error("Error fetching Daily Goals Detail", error);
      throw error;
    }
  }
};

/**
 * DropShip: Endpoints for Drop Ship operations.
 */
const DropShip = {
  dropShipSendEmail: (emailInput: object) => requests.post('/DropShipSendEmail', emailInput),
  getAllDropShipSalesReps: () => requests.get('/DropShipSalesReps'),
  getDropShipInfo: (poNum: string): Promise<any> => requests.get(`/DropShipInfo/${poNum}`)
};

/**
 * EventSearchPage: Endpoints for event searching.
 */
const EventSearchPage = {
  getEventPageData: async (params: EquipReqSearchCriteria): Promise<EquipReqSearchResult[]> => {
    const formattedParams = {
      ...params,
      fromDate: params.fromDate ? params.fromDate.toISOString().split('T')[0] : null,
      toDate: params.toDate ? params.toDate.toISOString().split('T')[0] : null,
    };
    try {
      const response = await requests.getWithParams<EquipReqSearchResult[]>(
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
 * MassMailer: Endpoints for Mass Mailer functionality.
 */
const MassMailer = {
  ClearPartItems: {
    clear: (userid: string): Promise<any> => requests.get(`/MassMailerClearPartItems/${userid}`)
  },
  EmailOuts: {
    sendEmail: (body: object) => requests.post('/MassMailerEmailOuts', body)
  },
  EmailTemplates: {
    templatesForUser: (user: string): Promise<MassMailerEmailTemplate[]> => requests.get(`/MassMailerEmailTemplates/${user}`)
  },
  FileUpload: {
    clear: (username: string): Promise<any> => requests.get(`/MassMailerFileUpload/${username}`),
    upload: (body: FormData): Promise<string[]> => requests.post('/MassMailerFileUpload', body)
  },
  Manufacturers: {
    manufacturerList: (): Promise<string[]> => requests.get('/MassMailerManufacturers')
  },
  PartItems: {
    partItemsForUser: (user: string): Promise<MassMailerPartItem[]> => requests.get(`/MassMailerPartItems/${user}`)
  },
  Vendors: {
    vendorList: (mfg: string, anc: boolean, fne: boolean): Promise<MassMailerVendor[]> => requests.get(`/MassMailerVendors/${mfg}/${anc}/${fne}`)
  },
  Users: {
    getActive: (): Promise<User[]> => requests.get('/Users/active'),
    getMassMailer: (): Promise<MassMailerUser[]> => requests.get('/Users/massmailer')
  }
};

/**
 * MassMailerHistory: Endpoints for Mass Mailer History.
 */
const MassMailerHistory = {
  getAll: (): Promise<MassMailHistory[]> => requests.get('/MassMailerHistory'),
  getByUser: (username: string): Promise<MassMailHistory[]> => requests.get(`/MassMailerHistory/sentBy/${username}`),
  getByUserAndId: (username: string, id: number): Promise<MassMailHistory> => requests.get(`/MassMailerHistory/sentBy/${username}/${id}`),
  update: (id: number, history: MassMailHistory): Promise<any> => requests.put(`/MassMailerHistory/${id}`, history),
  create: (history: MassMailHistory): Promise<MassMailHistory> => requests.post('/MassMailerHistory', history),
  delete: (id: number): Promise<MassMailHistory> => requests.delete(`/MassMailerHistory/${id}`)
};

/**
 * MasterSearches: Endpoints for master search operations.
 */
const MasterSearches = {
  getBuyOppDetails: (input: MasterSearchInput): Promise<BuyOppDetail[]> => requests.getWithParams('/MasterSearch/BuyOppDetails', input),
  getBuyOppEvents: (input: MasterSearchInput): Promise<BuyOppEvent[]> => requests.getWithParams('/MasterSearch/BuyOppEvents', input),
  getContacts: (searchValue: string, active: boolean): Promise<MasterSearchContact[]> => requests.getWithParams('/MasterSearch/Contacts', { searchValue, active }),
  getSellOppDetails: (input: MasterSearchInput): Promise<SellOppDetail[]> => requests.getWithParams('/MasterSearch/SellOppDetails', input),
  getSellOppEvents: (input: MasterSearchInput): Promise<SellOppEvent[]> => requests.getWithParams('/MasterSearch/SellOppEvents', input)
};

/**
 * OpenSalesOrderNotes: Endpoints for sales order notes.
 */
const OpenSalesOrderNotes = {
  addNote: async (note: TrkSoNote): Promise<TrkSoNote> => {
    const response = await requests.post('/OpenSalesOrderNotes/AddNote', note);
    return response as TrkSoNote;
  },
  deleteNote: async (id: number): Promise<void> => {
    await requests.delete(`/OpenSalesOrderNotes/DeleteNote/${id}`);
  },
  getNotes: async (soNum: string, partNum: string): Promise<TrkSoNote[]> => {
    const response = await requests.get(`/OpenSalesOrderNotes/GetNotes/${soNum}/${partNum}`);
    return response as TrkSoNote[];
  },
  updateNote: async (id: number, note: TrkSoNote): Promise<void> => {
    await requests.put(`/OpenSalesOrderNotes/UpdateNote/${id}`, note);
  }
};

/**
 * OpenSalesOrderReport: Endpoints for open sales order reports.
 */
const OpenSalesOrderReport = {
  fetchOpenSalesOrders: async (params: OpenSalesOrderSearchInput): Promise<(OpenSOReport & { Notes: TrkSoNote[] })[]> => {
    const response = await requests.getWithParams('/OpenSalesOrder/GetOpenSalesOrders', params);
    return response as (OpenSOReport & { Notes: TrkSoNote[] })[];
  }
};

/**
 * PODeliveryLogService: Endpoints for PO delivery logs.
 */
const PODeliveryLogService = {
  getPODeliveryLogs: async (params: PODeliveryLogSearchInput): Promise<PODeliveryLogs[]> => {
    const response = await requests.getWithParams('/PODeliveryLog', params);
    return response as PODeliveryLogs[];
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
  }): Promise<string[]> => requests.getWithParams('/PODeliveryLog/vendors', params),
  getPODetailByID: (id: number): Promise<PODetailUpdateDto> => requests.get(`/PODetail/id/${id}`),
  updatePODetail: (id: number, body: PODetailUpdateDto): Promise<void> => requests.put(`/PODetail/${id}`, body),
  addNote: (id: number, noteDto: { Note: string; EnteredBy: string }): Promise<void> => requests.put(`/PODetail/${id}/note`, noteDto)
};

/**
 * Portal: Endpoints for portal-related operations.
 */
const PortalMenu = {
  getMenu: async (workspaceId: number, userId: number): Promise<PortalMenuItemDto[]> =>
    requests.get(`/Portal/${workspaceId}/menu/${userId}`),

  getRoutes: async (workspaceId: number): Promise<PortalRouteDto[]> =>
    requests.get(`/Portal/${workspaceId}/routes`),

  getWorkspaces: async (): Promise<WorkspaceDto[]> =>
    requests.get('/Portal/workspaces'),

  addFavorite: async (userId: number, itemId: number): Promise<void> =>
    requests.post(`/Portal/favorites/${userId}/${itemId}`, {}),

  removeFavorite: async (userId: number, itemId: number): Promise<void> =>
    requests.delete(`/Portal/favorites/${userId}/${itemId}`),
};

/**
 * SalesOrderWorkbench: Endpoints for sales order workbench operations.
 */
const SalesOrderWorkbench = {
  getEventLevelData: async (params: { salesRepId?: number; billToCompany?: string; eventId?: number }): Promise<any> => {
    return requests.getWithParams('/SalesOrderWorkbench/EventLevelData', params);
  },
  getDetailLevelData: async (params: { salesRepId?: number; billToCompany?: string; eventId?: number }): Promise<any> => {
    return requests.getWithParams('/SalesOrderWorkbench/DetailLevelData', params);
  },
  updateEventLevel: async (updateData: EventLevelUpdateDto): Promise<void> => {
    return requests.post('/SalesOrderWorkbench/UpdateEventLevel', updateData);
  },
  updateDetailLevel: async (updateData: DetailLevelUpdateDto): Promise<void> => {
    return requests.post('/SalesOrderWorkbench/UpdateDetailLevel', updateData);
  }
};

/**
 * ScanHistory: Endpoints for scan history operations.
 */
const ScanHistory = {
  searchScans: async (searchDto: SearchScansDto): Promise<any> => {
    const params: any = {
      scanDateRangeStart: searchDto.scanDateRangeStart.toISOString(),
      scanDateRangeEnd: searchDto.scanDateRangeEnd.toISOString(),
      limit: searchDto.limit,
    };
    if (searchDto.snField.trim() !== '') {
      params.snField = searchDto.snField;
    }
    if (searchDto.orderNum.trim() !== '') params.orderNum = searchDto.orderNum;
    if (searchDto.orderType.trim() !== '') params.orderType = searchDto.orderType;
    if (searchDto.partNo.trim() !== '') params.partNo = searchDto.partNo;
    if (searchDto.serialNo.trim() !== '') params.serialNo = searchDto.serialNo;
    if (searchDto.mnsCo.trim() !== '') params.mnsCo = searchDto.mnsCo;
    if (searchDto.scanUser.trim() !== '') params.scanUser = searchDto.scanUser;

    console.log("SearchScans params:", params);
    return requests.getWithParams('/ScanHistory/Search', params);
  },

  deleteScans: async (selectedIds: number[]): Promise<any> => {
    console.log(`DELETE Request to: /ScanHistory/Delete with body:`, selectedIds);
    return axios
      .delete('/ScanHistory/Delete', { data: selectedIds })
      .then(responseBody)
      .then(data => {
        console.log('DELETE Response from /ScanHistory/Delete', data);
        return data;
      });
  },

  updateScans: async (updateDtos: UpdateScanDto[]): Promise<any> => {
    return requests.put('/ScanHistory/Update', updateDtos);
  },

  copyScans: async (copyRequest: CopyScansDto): Promise<any> => {
    return requests.post('/ScanHistory/Copy', copyRequest);
  },

  addTestScans: async (selectedIds: number[]): Promise<any> => {
    return requests.post('/ScanHistory/AddTestScans', selectedIds);
  },
};

/**
 * TimeTrackers: Endpoints for time tracking.
 */
const TimeTrackers = {
  approve: (approvals: object) => requests.post('/TimeTrackerApprovals', approvals),
  get: (userId: string): Promise<TimeTracker> => requests.get(`/TimeTrackers/${userId}`),
  getAllInPeriod: (userId: string, previousPeriod: boolean): Promise<TimeTracker[]> =>
    requests.get(`/PeriodTimeTrackers?userId=${userId}&previousPeriod=${previousPeriod}`),
  isApproved: (userId: string, previousPeriod: boolean) =>
    requests.get(`/TimeTrackerApprovals?userId=${userId}&previousPeriod=${previousPeriod}`),
  sendEmailReport: (body: object) => requests.post('/TimeTrackerReportSender', body),
  update: (body: TimeTracker): Promise<TimeTracker> => requests.put('/TimeTrackers', body)
};

/**
 * Users: Endpoints for user operations.
 */
const Users = {
  getActive: (): Promise<User[]> => requests.get('/Users/active'),
  getMassMailer: (): Promise<MassMailerUser[]> => requests.get('/Users/massmailer'),
  getWarehouseUsers: (): Promise<User[]> => requests.get('/Operations/ScanUsers')
};

/**
 * UserList: Endpoints for user list management.
 */
const UserList = {
  addUser: async (newUser: User): Promise<User> => {
    const response = await requests.post('/UserList/AddUser', newUser);
    return response as User;
  },
  deleteUser: async (uid: number): Promise<void> => {
    await requests.delete(`/UserList/DeleteUser/${uid}`);
  },
  fetchUserList: async (): Promise<User[]> => {
    const response = await requests.get('/UserList/GetUserList');
    return response as User[];
  },
  updateUser: async (uid: number, updatedUser: User): Promise<User> => {
    const response = await requests.put(`/UserList/UpdateUser/${uid}`, updatedUser);
    return response as User;
  }
};

/**
 * UserLogins: Endpoints for user authentication.
 */
const UserLogins = {
  authenticate: (loginRequest: LoginRequest): Promise<LoginResponse> =>
    requests.post<LoginResponse>('/Login', loginRequest),

  refreshToken: (payload: TokenRefreshRequest): Promise<TokenRefreshResponse> =>
    requests.post<TokenRefreshResponse>('/Token/RefreshToken', payload),

  logout: (refreshToken: string): Promise<void> =>
    requests.post<void>('/Token/Logout', { refreshToken }),
};

/**
 * Modules: Aggregated endpoints for easier imports.
 */
const Modules = {
  CamSearch,
  CustomerPOSearch,
  DataFetch,
  DailyGoals,
  DropShip,
  EventSearchPage,
  MassMailer,
  MassMailerHistory,
  MasterSearches,
  OpenSalesOrderNotes,
  OpenSalesOrderReport,
  PODeliveryLogService,
  PortalMenu,
  SalesOrderWorkbench,
  ScanHistory,
  TimeTrackers,
  Users,
  UserList,
  UserLogins
};

export default Modules;
