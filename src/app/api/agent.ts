import axios, { AxiosResponse } from 'axios';
import { IMassMailerEmailTemplate } from '../../models/MassMailer/MassMailerEmailTemplate';
import { IMassMailerVendor } from '../../models/MassMailer/MassMailerVendor';
import { IMassMailerPartItem } from '../../models/MassMailer/MassMailerPartItem';
import { LoginInfo } from '../../models/LoginInfo';
import IMassMailerUser from '../../models/MassMailer/MassMailerUser';
import { TimeTracker } from '../../models/TimeTracker/TimeTracker';
import SearchInput from '../../models/MasterSearch/SearchInput';
import SellOppEvent from '../../models/MasterSearch/SellOppEvent';
import SellOppDetail from '../../models/MasterSearch/SellOppDetail';
import BuyOppEvent from '../../models/MasterSearch/BuyOppEvent';
import BuyOppDetail from '../../models/MasterSearch/BuyOppDetail';
import MasterSearchContact from '../../models/MasterSearch/MasterSearchContact';
import { User } from '../../models/UserList/User';

const devURL = "http://localhost:5001/api";
const prodURL = "http://10.0.0.8:82/api";

if (process.env.NODE_ENV === "development")
    axios.defaults.baseURL = devURL;
else
    axios.defaults.baseURL = prodURL;

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    getWithParams: (url: string, body: Object) => axios.get(url, { params: body}).then(responseBody),
    post: (url: string, body: Object) => axios.post(url, body).then(responseBody),
    postNoBody: (url: string) => axios.post(url).then(responseBody),
    put: (url: string, body: Object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const UserLogins = {
    authenticate: (loginInfo: Object): Promise<LoginInfo> => requests.post('/UserLogins', loginInfo)
}

const MassMailerEmailTemplates = {
    templatesForUser: (user: string): Promise<IMassMailerEmailTemplate[]> => requests.get(`/MassMailerEmailTemplates/${user}`)
}

const MassMailerManufacturers = {
    manufacturerList: (): Promise<string[]> => requests.get('/MassMailerManufacturers')
}

const MassMailerVendors = {
    vendorList: (mfg: string, anc: boolean, fne: boolean): Promise<IMassMailerVendor[]> => {
        return requests.get(`/MassMailerVendors/${mfg}/${anc}/${fne}`)
    }
}

const MassMailerPartItems = {
    partItemsForUser: (user: string): Promise<IMassMailerPartItem[]> => requests.get(`/MassMailerPartItems/${user}`)
}

const MassMailerEmailOuts = {
    sendEmail: (body: Object) => requests.post('/MassMailerEmailOuts', body)
}


const MassMailerUsers = {
    getAll: (): Promise<IMassMailerUser[]> => requests.get('/MassMailerUsers')
}

const MassMailerFileUpload = {
    upload: (body: FormData): Promise<string[]> => requests.post('/MassMailerFileUpload', body),
    clear: (username: string): Promise<any> => requests.get(`/MassMailerFileUpload/${username}`)
}

const MassMailerClearPartItems = {
    clear: (userid: string): Promise<any> => requests.get(`/MassMailerClearPartItems/${userid}`)
}

const TimeTrackers = {
    get: (userId: string): Promise<TimeTracker> => requests.get(`/TimeTrackers/${userId}`),    
    update: (body: TimeTracker): Promise<TimeTracker> => requests.put('/TimeTrackers', body),
    getAllInPeriod: (userId: string, previousPeriod: boolean): Promise<TimeTracker[]> => 
            requests.get(`/PeriodTimeTrackers?userId=${userId}&previousPeriod=${previousPeriod}`),
    sendEmailReport: (body: Object) => requests.post('/TimeTrackerReportSender', body),
    isApproved: (userId: string, previousPeriod: boolean) => requests.get(`/TimeTrackerApprovals?userId=${userId}&previousPeriod=${previousPeriod}`),
    approve: (approvals: object) => requests.post('/TimeTrackerApprovals', approvals)
}

const MasterSearches = {
    getSellOppEvents: (input: SearchInput): Promise<SellOppEvent[]> => requests.getWithParams('/SellOppEvents',input),
    getSellOppDetails: (input: SearchInput): Promise<SellOppDetail[]> => requests.getWithParams('/SellOppDetails',input),
    getBuyOppEvents: (input: SearchInput): Promise<BuyOppEvent[]> => requests.getWithParams('/BuyOppEvents',input),
    getBuyOppDetails: (input: SearchInput): Promise<BuyOppDetail[]> => requests.getWithParams('/BuyOppDetails',input),
    getContacts: (searchValue: string, active: boolean): Promise<MasterSearchContact[]> => requests.getWithParams('/MasterSearchContacts', { searchValue, active })
}

const DropShip = {
    getDropShipInfo: (poNum: string): Promise<any> => requests.get(`/DropShipInfo/${poNum}`),
    sendDropShipEmail: (emailInput: object) => requests.post('/SendDropShipEmail', emailInput),
    getAllDropShipSalesReps: () => requests.get(`/DropShipSalesReps`)
}

// Function to fetch users
const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await requests.get('/User/GetUsers');
        return response as User[];
    } catch (error) {
        console.error('Error fetching users', error);
        throw error;
    }
};
  
// Function to add a new user
const addUser = async (newUser: User): Promise<User> => {
    try {
        const response = await requests.post('/User/AddUser', newUser);
        return response as User;
    } catch (error) {
        console.error('Error adding user', error);
        throw error;
    }
};

// Function to update a user
const updateUser = async (uid: number, updatedUser: User): Promise<User> => {
    try {
        const response = await requests.put(`/User/UpdateUser/${uid}`, updatedUser);
        return response as User;
    } catch (error) {
        console.error('Error updating user', error);
        throw error;
    }
};

// Function to delete a user
const deleteUser = async (uid: number): Promise<void> => {
    try {
        await requests.delete(`/User/DeleteUser/${uid}`);
    } catch (error) {
        console.error('Error deleting user', error);
        throw error;
    }
};
  

const massMailerModules = {
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
    DropShip
};

export { fetchUsers, addUser, updateUser, deleteUser };
export default massMailerModules;