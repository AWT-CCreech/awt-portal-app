import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Divider,
  Typography,
  Avatar,
  Tooltip,
  CssBaseline,
  ListItemButton,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
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
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { handleLogOut } from '../utils/authentication';
import UserInfoContext from '../stores/userInfo';
import fullLogo from '../images/fullLogo.png';
import { ROUTE_PATHS } from '../../routes';

const drawerWidth = 280;

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  justifyContent: 'space-between',
}));

const LogoContainer = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
}));

const LogoImage = styled('img')(({ theme }) => ({
  height: '36px',
  marginRight: theme.spacing(1),
}));

const WorkspaceSelector = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const WorkspaceInfo = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

const NavItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 0,
  marginRight: theme.spacing(2),
}));

// Update the iconMap to include our new BarChartOutlined icon
const iconMap: { [key: string]: React.ElementType } = {
  TravelExploreOutlinedIcon,
  PeopleOutlinedIcon,
  PinDropOutlinedIcon,
  EmailOutlinedIcon,
  ContactsOutlinedIcon,
  SellOutlinedIcon,
  MarkunreadMailboxOutlinedIcon,
  ManageSearchIcon,
  FolderIcon,
  FolderOpenIcon,
  TodayOutlinedIcon, // New entry for Daily Goals Report
  // Add other icons as needed
};

interface MenuItemType {
  label: string;
  iconName?: string;
  icon?: React.ElementType;
  path?: string;
  open?: boolean;
  onClick?: () => void;
  children?: MenuItemType[];
}

const PortalMenu: React.FC = () => {
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>(() => {
    const savedFolders = localStorage.getItem('openFolders');
    return savedFolders
      ? JSON.parse(savedFolders)
      : {
        accounting: false,
        cam: false,
        commissions: false,
        consignment: false,
        helpDesk: false,
        inventory: false,
        it: false,
        operations: false,
        purchasing: false,
        receiving: false,
        sales: false,
        shipping: false,
      };
  });

  const [favorites, setFavorites] = useState<MenuItemType[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites) as MenuItemType[];
      return parsedFavorites.map((item) => ({
        ...item,
        icon: iconMap[item.iconName || 'Folder'],
      }));
    }
    return [];
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const userInfo = useContext(UserInfoContext);
  const { setUserName, setPassWord } = userInfo;

  useEffect(() => {
    const favoritesToStore = favorites.map(({ icon, onClick, ...rest }) => rest);
    localStorage.setItem('favorites', JSON.stringify(favoritesToStore));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('openFolders', JSON.stringify(openFolders));
  }, [openFolders]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleFolderToggle = (folder: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }));
  };

  const handleFavoriteToggle = (item: MenuItemType) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((fav) => fav.label === item.label);
      if (isAlreadyFavorite) {
        return prev.filter((fav) => fav.label !== item.label);
      } else {
        const itemToAdd = { ...item };
        delete itemToAdd.onClick;
        itemToAdd.iconName = getIconName(item.icon);
        delete itemToAdd.icon;
        return [...prev, itemToAdd];
      }
    });
  };

  const isFavorite = (label: string) => favorites.some((fav) => fav.label === label);

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const getFolderTitle = (folder: string) => {
    const specialCases: { [key: string]: string } = {
      it: 'IT',
      cam: 'CAM',
    };
    return specialCases[folder] || folder.charAt(0).toUpperCase() + folder.slice(1);
  };

  const getIconName = (icon?: React.ElementType): string => {
    for (const [key, value] of Object.entries(iconMap)) {
      if (value === icon) {
        return key;
      }
    }
    return 'Folder';
  };

  // Define folders and their items. Update accounting folder to include "Daily Goals Report".
  const folders: { [key: string]: MenuItemType[] } = {
    accounting: [
      { label: 'Daily Goals Report', path: ROUTE_PATHS.ACCOUNTING.DAILY_GOALS, iconName: 'TodayOutlinedIcon', icon: TodayOutlinedIcon },
    ],
    cam: [
      { label: 'CAM Dashboard', path: '/cam/dashboard', icon: ContactsOutlinedIcon },
    ],
    commissions: [
    ],
    consignment: [
    ],
    helpDesk: [
    ],
    inventory: [
    ],
    it: [
    ],
    operations: [
    ],
    purchasing: [
      { label: 'Drop Ship', path: ROUTE_PATHS.PURCHASING.DROPSHIP, iconName: 'PinDropOutlinedIcon', icon: PinDropOutlinedIcon },
      { label: 'Mass Mailer', path: ROUTE_PATHS.PURCHASING.MASS_MAILER, iconName: 'EmailOutlinedIcon', icon: EmailOutlinedIcon },
      { label: 'PO Delivery Log', path: ROUTE_PATHS.PURCHASING.PO_DELIVERY_LOG, iconName: 'MarkunreadMailboxOutlinedIcon', icon: MarkunreadMailboxOutlinedIcon },
    ],
    receiving: [
    ],
    sales: [
      { label: 'Customer PO Search', path: ROUTE_PATHS.SALES.CUSTOMER_PO_SEARCH, iconName: 'SellOutlinedIcon', icon: ShoppingCartOutlined },
      { label: 'Event Search', path: ROUTE_PATHS.SALES.EVENT_SEARCH, iconName: 'ManageSearchIcon', icon: ManageSearchIcon },
      { label: 'Open SO Report', path: ROUTE_PATHS.SALES.OPEN_SO_REPORT, iconName: 'SellOutlinedIcon', icon: SellOutlinedIcon },
      { label: 'SO Workbench', path: ROUTE_PATHS.SALES.SALES_ORDER_WB, iconName: 'HandymanOutlinedIcon', icon: HandymanOutlinedIcon },
    ],
    shipping: [
    ],
  };

  const mainMenuItems: MenuItemType[] = [
    {
      label: 'Master Search',
      iconName: 'TravelExploreOutlinedIcon',
      icon: TravelExploreOutlinedIcon,
      path: ROUTE_PATHS.MASTER_SEARCH,
    },
    {
      label: 'User List',
      iconName: 'PeopleOutlinedIcon',
      icon: PeopleOutlinedIcon,
      path: ROUTE_PATHS.USER_LIST,
    },
  ];

  const menuData: { section: string; items: MenuItemType[]; showFavoriteIcon: boolean }[] = [
    {
      section: 'Favorites',
      items: favorites.map((item) => ({
        ...item,
        icon: item.icon || iconMap[item.iconName || 'FolderIcon'],
      })),
      showFavoriteIcon: true,
    },
    {
      section: 'Main',
      items: mainMenuItems,
      showFavoriteIcon: false,
    },
    {
      section: 'Applications',
      items: Object.keys(folders).map((folder) => ({
        label: getFolderTitle(folder),
        iconName: openFolders[folder] ? 'FolderOpenIcon' : 'FolderIcon',
        icon: openFolders[folder] ? FolderOpenIcon : FolderIcon,
        open: openFolders[folder] || false,
        onClick: () => handleFolderToggle(folder),
        children: folders[folder].map((item) => ({
          ...item,
          icon: item.icon || iconMap[item.iconName || 'FolderIcon'],
        })),
      })),
      showFavoriteIcon: true,
    },
  ];

  const renderMenuItems = (items: MenuItemType[], depth = 0, showFavoriteIcon = true) =>
    items.map((item) => {
      const paddingLeft = depth * 2;
      if (item.children) {
        return (
          <React.Fragment key={item.label}>
            <ListItem disablePadding>
              <ListItemButton onClick={item.onClick} sx={{ pl: 2 + paddingLeft, pr: 1 }}>
                <NavItemIcon>
                  {item.icon ? React.createElement(item.icon) : <FolderIcon />}
                </NavItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                />
                {item.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
            </ListItem>
            <Collapse in={item.open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.children, depth + 1, showFavoriteIcon)}
              </List>
            </Collapse>
          </React.Fragment>
        );
      } else {
        return (
          <ListItem disablePadding key={item.label}>
            <ListItemButton onClick={() => handleNavigation(item.path!)} sx={{ pl: 2 + paddingLeft, pr: 1 }}>
              <NavItemIcon>
                {item.icon ? React.createElement(item.icon) : <FolderIcon />}
              </NavItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              />
              {showFavoriteIcon && (
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(item);
                  }}
                >
                  {isFavorite(item.label) ? <StarIcon sx={{ color: 'primary.main' }} /> : <StarBorderIcon />}
                </IconButton>
              )}
            </ListItemButton>
          </ListItem>
        );
      }
    });

  return (
    <>
      <CssBaseline />
      <IconButton onClick={handleDrawerToggle} sx={{ color: 'inherit' }}>
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box
          sx={{
            width: drawerWidth,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {/* Top Section */}
          <Box>
            <DrawerHeader>
              <LogoContainer href="/">
                <LogoImage src={fullLogo} alt="AWT" />
              </LogoContainer>
              <IconButton onClick={handleDrawerToggle}>
                <ArrowBackIosIcon />
              </IconButton>
            </DrawerHeader>
            <Divider />
            <WorkspaceSelector>
              <Avatar src="../images/avatar.png" />
              <WorkspaceInfo>
                <Typography variant="caption">Company</Typography>
                <Typography variant="subtitle2">Technologies</Typography>
              </WorkspaceInfo>
              <IconButton>
                <ExpandMoreIcon />
              </IconButton>
            </WorkspaceSelector>
            <Divider />
          </Box>
          {/* Middle Section (Scrollable) */}
          <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <List>
              {menuData.map(
                (section) =>
                  section.items.length > 0 && (
                    <Box key={section.section}>
                      <SectionTitle>{section.section}</SectionTitle>
                      {renderMenuItems(section.items, 0, section.showFavoriteIcon)}
                    </Box>
                  )
              )}
            </List>
          </Box>
          {/* Bottom Icons */}
          <Divider />
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 2 }}>
              <Tooltip title="Settings">
                <IconButton sx={{ color: 'text.secondary' }}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Account">
                <IconButton sx={{ color: 'text.secondary' }}>
                  <AccountCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton sx={{ color: 'text.secondary' }} onClick={() => handleLogOut(navigate, setUserName, setPassWord)}>
                  <PowerSettingsNewIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default PortalMenu;
