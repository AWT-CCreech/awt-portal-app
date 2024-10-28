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

const devURL = 'http://localhost:5001/api'; // Use for development environment
const prodURL = 'http://10.0.0.8:82/api'; // Use for production environment

// Set the base URL based on the environment
if (process.env.NODE_ENV === 'development') axios.defaults.baseURL = devURL;
else axios.defaults.baseURL = prodURL;

// Helper function to extract the data from Axios responses
const responseBody = (response: AxiosResponse) => response.data;

// Axios request methods wrapped for easier use
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

// Automatically attach the JWT token to every request if it exists in localStorage
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh and auto logout on 401 error
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

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

        localStorage.setItem('token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // Trigger auto logout if refresh fails
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
      return response;
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

const DropShip = {
  dropShipSendEmail: (emailInput: object) =>
    requests.post('/DropShipSendEmail', emailInput),
  getAllDropShipSalesReps: () => requests.get('/DropShipSalesReps'),
  getDropShipInfo: (poNum: string): Promise<any> =>
    requests.get(`/DropShipInfo/${poNum}`),
};

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

const OpenSalesOrderNotes = {
  addNote: async (note: TrkSoNote): Promise<TrkSoNote> => {
    try {
      const response = await requests.post(
        '/OpenSalesOrderNotes/AddNote',
        note
      );
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

const UserLogins = {
  authenticate: (loginInfo: LoginInfo): Promise<LoginInfo> =>
    requests.post('/UserLogins', loginInfo),
  refreshToken: (tokenRefreshRequest: {
    token: string;
  }): Promise<{ token: string }> =>
    requests.post('/Token/RefreshToken', tokenRefreshRequest),
};

// Export grouped modules
const Modules = {
  CamSearch,
  DataFetch,
  DropShip,
  MassMailer,
  MasterSearches,
  OpenSalesOrderNotes,
  OpenSalesOrderReport,
  PODeliveryLogService,
  TimeTrackers,
  UserList,
  UserLogins,
};

export default Modules;
