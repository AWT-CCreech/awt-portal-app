import axios, { AxiosResponse } from 'axios';
import { IMassMailerEmailTemplate } from '../../models/MassMailer/MassMailerEmailTemplate';
import { IMassMailerVendor } from '../../models/MassMailer/MassMailerVendor';
import { IMassMailerPartItem } from '../../models/MassMailer/MassMailerPartItem';
import IMassMailerUser from '../../models/MassMailer/MassMailerUser';
import BuyOppEvent from '../../models/MasterSearch/BuyOppEvent';
import BuyOppDetail from '../../models/MasterSearch/BuyOppDetail';
import LoginInfo from '../../models/Login/LoginInfo';
import MasterSearchContact from '../../models/MasterSearch/MasterSearchContact';
import MasterSearchInput from '../../models/MasterSearch/SearchInput';
import OpenSOReport from '../../models/OpenSOReport/OpenSOReport';
import OpenSalesOrderSearchInput from '../../models/OpenSOReport/SearchInput';
import SellOppEvent from '../../models/MasterSearch/SellOppEvent';
import SellOppDetail from '../../models/MasterSearch/SellOppDetail';
import { TimeTracker } from '../../models/TimeTracker/TimeTracker';
import { User } from '../../models/User';
import { AccountNumbers } from '../../models/OpenSOReport/AccountNumbers';
import { ActiveSalesReps } from '../../models/OpenSOReport/ActiveSalesReps';
import { ActiveSalesTeams } from '../../models/OpenSOReport/ActiveSalesTeams';
import { ItemCategories } from '../../models/OpenSOReport/ItemCategories';
import { TrkSoNote } from '../../models/TrkSoNote';
import { CamContact } from '../../models/CamContact';

const devURL = 'http://localhost:5001/api'; // Use for development environment
const prodURL = 'http://10.0.0.8:82/api'; // Use for production environment

// Set the base URL based on the environment
if (process.env.NODE_ENV === 'development') axios.defaults.baseURL = devURL;
else axios.defaults.baseURL = prodURL;

// Helper function to extract the data from Axios responses
const responseBody = (response: AxiosResponse) => response.data;

// Axios request methods wrapped for easier use
const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  getWithParams: (url: string, body: Object) =>
    axios.get(url, { params: body }).then(responseBody),
  post: (url: string, body: Object) => axios.post(url, body).then(responseBody),
  postNoBody: (url: string) => axios.post(url).then(responseBody),
  put: (url: string, body: Object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
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

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentToken = localStorage.getItem('token');
        const refreshResponse = await axios.post('/UserLogins/refresh', { token: currentToken });
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

// Group all MassMailer-related modules into one constant
const MassMailer = {
  EmailTemplates: {
    templatesForUser: (user: string): Promise<IMassMailerEmailTemplate[]> =>
      requests.get(`/MassMailerEmailTemplates/${user}`),
  },
  Manufacturers: {
    manufacturerList: (): Promise<string[]> => requests.get('/MassMailerManufacturers'),
  },
  Vendors: {
    vendorList: (mfg: string, anc: boolean, fne: boolean): Promise<IMassMailerVendor[]> => {
      return requests.get(`/MassMailerVendors/${mfg}/${anc}/${fne}`);
    },
  },
  PartItems: {
    partItemsForUser: (user: string): Promise<IMassMailerPartItem[]> =>
      requests.get(`/MassMailerPartItems/${user}`),
  },
  EmailOuts: {
    sendEmail: (body: Object) => requests.post('/MassMailerEmailOuts', body),
  },
  Users: {
    getAll: (): Promise<IMassMailerUser[]> => requests.get('/MassMailerUsers'),
  },
  FileUpload: {
    upload: (body: FormData): Promise<string[]> => requests.post('/MassMailerFileUpload', body),
    clear: (username: string): Promise<any> => requests.get(`/MassMailerFileUpload/${username}`),
  },
  ClearPartItems: {
    clear: (userid: string): Promise<any> => requests.get(`/MassMailerClearPartItems/${userid}`),
  },
};

const UserLogins = {
    authenticate: (loginInfo: LoginInfo): Promise<LoginInfo> => requests.post('/UserLogins', loginInfo),
    refreshToken: (tokenRefreshRequest: { token: string }): Promise<{ token: string }> => requests.post('/Token/RefreshToken', tokenRefreshRequest)
};

const TimeTrackers = {
  get: (userId: string): Promise<TimeTracker> => requests.get(`/TimeTrackers/${userId}`),
  update: (body: TimeTracker): Promise<TimeTracker> => requests.put('/TimeTrackers', body),
  getAllInPeriod: (userId: string, previousPeriod: boolean): Promise<TimeTracker[]> =>
    requests.get(`/PeriodTimeTrackers?userId=${userId}&previousPeriod=${previousPeriod}`),
  sendEmailReport: (body: Object) => requests.post('/TimeTrackerReportSender', body),
  isApproved: (userId: string, previousPeriod: boolean) =>
    requests.get(`/TimeTrackerApprovals?userId=${userId}&previousPeriod=${previousPeriod}`),
  approve: (approvals: object) => requests.post('/TimeTrackerApprovals', approvals),
};

// Update the MasterSearches module to use the new centralized MasterSearchController
const MasterSearches = {
  getSellOppEvents: (input: MasterSearchInput): Promise<SellOppEvent[]> =>
    requests.getWithParams('/MasterSearch/SellOppEvents', input),
  getSellOppDetails: (input: MasterSearchInput): Promise<SellOppDetail[]> =>
    requests.getWithParams('/MasterSearch/SellOppDetails', input),
  getBuyOppEvents: (input: MasterSearchInput): Promise<BuyOppEvent[]> =>
    requests.getWithParams('/MasterSearch/BuyOppEvents', input),
  getBuyOppDetails: (input: MasterSearchInput): Promise<BuyOppDetail[]> =>
    requests.getWithParams('/MasterSearch/BuyOppDetails', input),
  getContacts: (searchValue: string, active: boolean): Promise<MasterSearchContact[]> =>
    requests.getWithParams('/MasterSearch/Contacts', { searchValue, active }),
};

const CamSearch = {
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
  getSearchFields: (): Promise<string[]> => {
    return requests.get('/Cam/SearchFields');
  },
  getAdvancedSearchFields: (): Promise<{ FieldValue: string; FieldValue2: string; FieldValue4: string }[]> => {
    return requests.get('/Cam/AdvancedSearchFields');
  },
  getContactTypes: (): Promise<string[]> => {
    return requests.get('/Cam/ContactTypes');
  },
};

const DropShip = {
  getDropShipInfo: (poNum: string): Promise<any> => requests.get(`/DropShipInfo/${poNum}`),
  dropShipSendEmail: (emailInput: object) => requests.post('/DropShipSendEmail', emailInput),
  getAllDropShipSalesReps: () => requests.get(`/DropShipSalesReps`),
};

const UserList = {
  fetchUserList: async (): Promise<User[]> => {
    try {
      const response = await requests.get('/UserList/GetUserList');
      return response as User[];
    } catch (error) {
      console.error('Error fetching users', error);
      throw error;
    }
  },
  addUser: async (newUser: User): Promise<User> => {
    try {
      const response = await requests.post('/UserList/AddUser', newUser);
      return response as User;
    } catch (error) {
      console.error('Error adding user', error);
      throw error;
    }
  },
  updateUser: async (uid: number, updatedUser: User): Promise<User> => {
    try {
      const response = await requests.put(`/UserList/UpdateUser/${uid}`, updatedUser);
      return response as User;
    } catch (error) {
      console.error('Error updating user', error);
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
};

const OpenSalesOrderReport = {
  fetchActiveSalesReps: async (): Promise<ActiveSalesReps[]> => {
    try {
      const response = await requests.get('/Sales/GetSalesReps');
      return response as ActiveSalesReps[];
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
      console.error('Error fetching sales teams', error);
      throw error;
    }
  },

  fetchAccountNumbers: async (): Promise<AccountNumbers[]> => {
    try {
      const response = await requests.get('/Sales/GetAccountNumbers');
      return response as AccountNumbers[];
    } catch (error) {
      console.error('Error fetching sales teams', error);
      throw error;
    }
  },

  fetchOpenSalesOrders: async (
    params: OpenSalesOrderSearchInput
  ): Promise<(OpenSOReport & { Notes: TrkSoNote[] })[]> => {
    try {
      const response = await requests.getWithParams('/OpenSalesOrder/GetOpenSalesOrders', params);
      return response as (OpenSOReport & { Notes: TrkSoNote[] })[];
    } catch (error) {
      console.error('Error fetching open sales orders', error);
      throw error;
    }
  },
};

const OpenSalesOrderNotes = {
  getNotes: async (soNum: string, partNum: string): Promise<TrkSoNote[]> => {
    try {
      const response = await requests.get(`/OpenSalesOrderNotes/GetNotes/${soNum}/${partNum}`);
      return response as TrkSoNote[];
    } catch (error) {
      console.error('Error fetching notes', error);
      throw error;
    }
  },

  addNote: async (note: TrkSoNote): Promise<TrkSoNote> => {
    try {
      const response = await requests.post('/OpenSalesOrderNotes/AddNote', note);
      return response as TrkSoNote;
    } catch (error) {
      console.error('Error adding note', error);
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

  deleteNote: async (id: number): Promise<void> => {
    try {
      await requests.delete(`/OpenSalesOrderNotes/DeleteNote/${id}`);
    } catch (error) {
      console.error('Error deleting note', error);
      throw error;
    }
  },
};

// Export grouped modules
const Modules = {
  MassMailer,
  TimeTrackers,
  MasterSearches,
  CamSearch,
  DropShip,
  UserList,
  OpenSalesOrderReport,
  OpenSalesOrderNotes,
  UserLogins,
};

export default Modules;
