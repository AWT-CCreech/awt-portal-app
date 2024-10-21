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
import {
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Star,
  StarBorder,
  Folder,
  FolderOpen,
  Settings,
  AccountCircle,
  PowerSettingsNew,
  ArrowBackIos,
  TravelExploreOutlined,
  PeopleOutlined,
  PinDropOutlined,
  EmailOutlined,
  ContactsOutlined,
  SellOutlined,
  MarkunreadMailboxOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { handleLogOut } from '../utils/authentication';
import UserInfoContext from '../stores/userInfo';
import logo from '../assets/images/fullLogo.png';
import { ROUTE_PATHS } from '../routes'; // Import the path constants

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

const iconMap: { [key: string]: React.ElementType } = {
  TravelExploreOutlined,
  PeopleOutlined,
  PinDropOutlined,
  EmailOutlined,
  ContactsOutlined,
  SellOutlined,
  MarkunreadMailboxOutlined,
  Folder,
  FolderOpen,
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
    setOpenFolders((prevOpenFolders) => ({
      ...prevOpenFolders,
      [folder]: !prevOpenFolders[folder],
    }));
  };

  const handleFavoriteToggle = (item: MenuItemType) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some((fav) => fav.label === item.label);
      if (isAlreadyFavorite) {
        return prevFavorites.filter((fav) => fav.label !== item.label);
      } else {
        const itemToAdd = { ...item };
        delete itemToAdd.onClick;
        itemToAdd.iconName = getIconName(item.icon);
        delete itemToAdd.icon;
        return [...prevFavorites, itemToAdd];
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
    return specialCases[folder] || capitalizeFirstLetter(folder);
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Helper function to get the name of the icon component
  const getIconName = (icon?: React.ElementType): string => {
    for (const [key, value] of Object.entries(iconMap)) {
      if (value === icon) {
        return key;
      }
    }
    return 'Folder';
  };

  // Define all your folders and their items
  const folders: { [key: string]: MenuItemType[] } = {
    accounting: [
      { label: 'Financial Reports', path: '/accounting/financial-reports' },
      { label: 'Budgeting', path: '/accounting/budgeting' },
      // Add more items as needed
    ],
    cam: [
      { label: 'CAM Dashboard', path: '/cam/dashboard', icon: ContactsOutlined },
      // Add more items as needed
    ],
    commissions: [
      { label: 'Commission Reports', path: '/commissions/reports' },
      // Add more items as needed
    ],
    consignment: [
      { label: 'Consignment Inventory', path: '/consignment/inventory' },
      // Add more items as needed
    ],
    helpDesk: [
      { label: 'Support Tickets', path: '/helpdesk/tickets' },
      // Add more items as needed
    ],
    inventory: [
      { label: 'Stock Levels', path: '/inventory/stock-levels' },
      // Add more items as needed
    ],
    it: [
      { label: 'IT Requests', path: '/it/requests' },
      // Add more items as needed
    ],
    operations: [
      { label: 'Operation Schedules', path: '/operations/schedules' },
      // Add more items as needed
    ],
    purchasing: [
      {
        label: 'Drop Ship',
        path: ROUTE_PATHS.PURCHASING.DROPSHIP,
        iconName: 'PinDropOutlined',
        icon: PinDropOutlined,
      },
      {
        label: 'Mass Mailer',
        path: ROUTE_PATHS.PURCHASING.MASS_MAILER,
        iconName: 'EmailOutlined',
        icon: EmailOutlined,
      },
      {
        label: 'PO Delivery Log',
        path: ROUTE_PATHS.PURCHASING.PO_DELIVERY_LOG,
        iconName: 'MarkunreadMailboxOutlined',
        icon: MarkunreadMailboxOutlined,
      },
      // Add more items as needed
    ],
    receiving: [
      { label: 'Received Goods', path: '/receiving/goods' },
      // Add more items as needed
    ],
    sales: [
      {
        label: 'Open SO Report',
        path: ROUTE_PATHS.SALES.OPEN_SO_REPORT,
        iconName: 'SellOutlined',
        icon: SellOutlined,
      },
      // Add more items as needed
    ],
    shipping: [
      { label: 'Shipping Schedule', path: '/shipping/schedule' },
      // Add more items as needed
    ],
  };

  const mainMenuItems: MenuItemType[] = [
    {
      label: 'Master Search',
      iconName: 'TravelExploreOutlined',
      icon: TravelExploreOutlined,
      path: ROUTE_PATHS.MASTER_SEARCH,
    },
    {
      label: 'User List',
      iconName: 'PeopleOutlined',
      icon: PeopleOutlined,
      path: ROUTE_PATHS.USER_LIST,
    },
  ];

  const menuData: { section: string; items: MenuItemType[]; showFavoriteIcon: boolean }[] = [
    {
      section: 'Favorites',
      items: favorites.map((item) => ({
        ...item,
        icon: item.icon || iconMap[item.iconName || 'Folder'],
      })),
      showFavoriteIcon: true,
    },
    {
      section: 'Main',
      items: mainMenuItems,
      showFavoriteIcon: false, // Do not show favorite icon for Main section
    },
    {
      section: 'Applications',
      items: Object.keys(folders).map((folder) => ({
        label: getFolderTitle(folder),
        iconName: openFolders[folder] ? 'FolderOpen' : 'Folder',
        icon: openFolders[folder] ? FolderOpen : Folder,
        open: openFolders[folder] || false,
        onClick: () => handleFolderToggle(folder),
        children: folders[folder].map((item) => ({
          ...item,
          icon: item.icon || iconMap[item.iconName || 'Folder'],
        })),
      })),
      showFavoriteIcon: true,
    },
  ];

  const renderMenuItems = (
    items: MenuItemType[],
    depth = 0,
    showFavoriteIcon: boolean = true
  ) =>
    items.map((item) => {
      const paddingLeft = depth * 2;

      if (item.children) {
        return (
          <React.Fragment key={item.label}>
            <ListItem disablePadding>
              <ListItemButton onClick={item.onClick} sx={{ pl: 2 + paddingLeft, pr: 1 }}>
                <NavItemIcon>
                  {item.icon ? React.createElement(item.icon as React.ElementType) : <Folder />}
                </NavItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                />
                {item.open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={item.open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.children!, depth + 1, showFavoriteIcon)}
              </List>
            </Collapse>
          </React.Fragment>
        );
      } else {
        return (
          <ListItem disablePadding key={item.label}>
            <ListItemButton
              onClick={() => handleNavigation(item.path!)}
              sx={{ pl: 2 + paddingLeft, pr: 1 }}
            >
              <NavItemIcon>
                {item.icon ? React.createElement(item.icon as React.ElementType) : <Folder />}
              </NavItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
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
                  {isFavorite(item.label) ? (
                    <Star sx={{ color: 'primary.main' }} />
                  ) : (
                    <StarBorder />
                  )}
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
            {/* Logo and Header */}
            <DrawerHeader>
              <LogoContainer href="/">
                <LogoImage src={logo} alt="AWT" />
              </LogoContainer>
              <IconButton onClick={handleDrawerToggle}>
                <ArrowBackIos />
              </IconButton>
            </DrawerHeader>
            <Divider />
            {/* Workspace Selector */}
            <WorkspaceSelector>
              <Avatar src="/assets/images/avatar.png" />
              <WorkspaceInfo>
                <Typography variant="caption">Company</Typography>
                <Typography variant="subtitle2">Technologies</Typography>
              </WorkspaceInfo>
              <IconButton>
                <ExpandMore />
              </IconButton>
            </WorkspaceSelector>
            <Divider />
          </Box>
          {/* Middle Section (Scrollable) */}
          <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <List>
              {/* Menu Sections */}
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
                  <Settings />
                </IconButton>
              </Tooltip>
              <Tooltip title="Account">
                <IconButton sx={{ color: 'text.secondary' }}>
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton
                  sx={{ color: 'text.secondary' }}
                  onClick={() => handleLogOut(navigate, setUserName, setPassWord)}
                >
                  <PowerSettingsNew />
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
