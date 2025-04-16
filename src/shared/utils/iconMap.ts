import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import MarkunreadMailboxOutlinedIcon from '@mui/icons-material/MarkunreadMailboxOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';

const iconMap: { [key: string]: React.ElementType } = {
    TravelExploreOutlinedIcon,
    PeopleOutlinedIcon,
    PinDropOutlinedIcon,
    EmailOutlinedIcon,
    ContactsOutlinedIcon,
    SellOutlinedIcon,
    MarkunreadMailboxOutlinedIcon,
    ManageSearchIcon,
    HandymanOutlinedIcon,
    TodayOutlinedIcon,
    ShoppingCartOutlinedIcon,
    FolderIcon,
    SearchOutlinedIcon,
    QrCodeScannerOutlinedIcon
};

export const getIconComponent = (iconName?: string): React.ElementType => {
    return iconMap[iconName || 'FolderIcon'] || FolderIcon;
};
