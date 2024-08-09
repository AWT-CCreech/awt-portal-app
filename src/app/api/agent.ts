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

const devURL = "http://localhost:5001/api"; //http://10.0.0.27/api
const prodURL = "http://10.0.0.8:82/api"; //http://10.0.0.8/api

if (process.env.NODE_ENV === "development")
    axios.defaults.baseURL = devURL;
else
    axios.defaults.baseURL = prodURL;

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    getWithParams: (url: string, body: Object) => axios.get(url, { params: body }).then(responseBody),
    post: (url: string, body: Object) => axios.post(url, body).then(responseBody),
    postNoBody: (url: string) => axios.post(url).then(responseBody),
    put: (url: string, body: Object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
};

const UserLogins = {
    authenticate: (loginInfo: Object): Promise<LoginInfo> => requests.post('/UserLogins', loginInfo)
};

const MassMailerEmailTemplates = {
    templatesForUser: (user: string): Promise<IMassMailerEmailTemplate[]> => requests.get(`/MassMailerEmailTemplates/${user}`)
};

const MassMailerManufacturers = {
    manufacturerList: (): Promise<string[]> => requests.get('/MassMailerManufacturers')
};

const MassMailerVendors = {
    vendorList: (mfg: string, anc: boolean, fne: boolean): Promise<IMassMailerVendor[]> => {
        return requests.get(`/MassMailerVendors/${mfg}/${anc}/${fne}`);
    }
};

const MassMailerPartItems = {
    partItemsForUser: (user: string): Promise<IMassMailerPartItem[]> => requests.get(`/MassMailerPartItems/${user}`)
};

const MassMailerEmailOuts = {
    sendEmail: (body: Object) => requests.post('/MassMailerEmailOuts', body)
};

const MassMailerUsers = {
    getAll: (): Promise<IMassMailerUser[]> => requests.get('/MassMailerUsers')
};

const MassMailerFileUpload = {
    upload: (body: FormData): Promise<string[]> => requests.post('/MassMailerFileUpload', body),
    clear: (username: string): Promise<any> => requests.get(`/MassMailerFileUpload/${username}`)
};

const MassMailerClearPartItems = {
    clear: (userid: string): Promise<any> => requests.get(`/MassMailerClearPartItems/${userid}`)
};

const TimeTrackers = {
    get: (userId: string): Promise<TimeTracker> => requests.get(`/TimeTrackers/${userId}`),
    update: (body: TimeTracker): Promise<TimeTracker> => requests.put('/TimeTrackers', body),
    getAllInPeriod: (userId: string, previousPeriod: boolean): Promise<TimeTracker[]> =>
        requests.get(`/PeriodTimeTrackers?userId=${userId}&previousPeriod=${previousPeriod}`),
    sendEmailReport: (body: Object) => requests.post('/TimeTrackerReportSender', body),
    isApproved: (userId: string, previousPeriod: boolean) => requests.get(`/TimeTrackerApprovals?userId=${userId}&previousPeriod=${previousPeriod}`),
    approve: (approvals: object) => requests.post('/TimeTrackerApprovals', approvals)
};

const MasterSearches = {
    getSellOppEvents: (input: MasterSearchInput): Promise<SellOppEvent[]> => requests.getWithParams('/SellOppEvents', input),
    getSellOppDetails: (input: MasterSearchInput): Promise<SellOppDetail[]> => requests.getWithParams('/SellOppDetails', input),
    getBuyOppEvents: (input: MasterSearchInput): Promise<BuyOppEvent[]> => requests.getWithParams('/BuyOppEvents', input),
    getBuyOppDetails: (input: MasterSearchInput): Promise<BuyOppDetail[]> => requests.getWithParams('/BuyOppDetails', input),
    getContacts: (searchValue: string, active: boolean): Promise<MasterSearchContact[]> => requests.getWithParams('/MasterSearchContacts', { searchValue, active })
};

const DropShip = {
    getDropShipInfo: (poNum: string): Promise<any> => requests.get(`/DropShipInfo/${poNum}`),
    sendDropShipEmail: (emailInput: object) => requests.post('/SendDropShipEmail', emailInput),
    getAllDropShipSalesReps: () => requests.get(`/DropShipSalesReps`)
};

const UserList = {
    // Function to fetch users
    fetchUserList: async (): Promise<User[]> => {
        try {
            const response = await requests.get('/UserList/GetUserList');
            return response as User[];
        } catch (error) {
            console.error('Error fetching users', error);
            throw error;
        }
    },

    // Function to add a new user
    addUser: async (newUser: User): Promise<User> => {
        try {
            const response = await requests.post('/UserList/AddUser', newUser);
            return response as User;
        } catch (error) {
            console.error('Error adding user', error);
            throw error;
        }
    },

    // Function to update a user
    updateUser: async (uid: number, updatedUser: User): Promise<User> => {
        try {
            const response = await requests.put(`/UserList/UpdateUser/${uid}`, updatedUser);
            return response as User;
        } catch (error) {
            console.error('Error updating user', error);
            throw error;
        }
    },

    // Function to delete a user
    deleteUser: async (uid: number): Promise<void> => {
        try {
            await requests.delete(`/UserList/DeleteUser/${uid}`);
        } catch (error) {
            console.error('Error deleting user', error);
            throw error;
        }
    }
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

    // Function to fetch open sales orders
    fetchOpenSalesOrders: async (params: OpenSalesOrderSearchInput): Promise<(OpenSOReport & { Notes: TrkSoNote[] })[]> => {
        try {
          const response = await requests.getWithParams('/OpenSalesOrder/GetOpenSalesOrders', params);
          return response as (OpenSOReport & { Notes: TrkSoNote[] })[];
        } catch (error) {
          console.error('Error fetching open sales orders', error);
          throw error;
        }
      }
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
    }
};


const Modules = {
    MassMailerEmailTemplates,
    MassMailerManufacturers,
    MassMailerVendors,
    MassMailerPartItems,
    MassMailerEmailOuts,
    UserLogins,
    MassMailerUsers,
    MassMailerFileUpload,
    MassMailerClearPartItems,
    TimeTrackers,
    MasterSearches,
    DropShip,
    UserList,
    OpenSalesOrderReport,
    OpenSalesOrderNotes // Include the new module here
};

export default Modules;
