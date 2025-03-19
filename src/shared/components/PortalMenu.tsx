import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Typography,
  Tooltip,
  CssBaseline,
  ListItemButton,
  Avatar
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
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import UserInfoContext from '../stores/userInfo';
import { handleLogOut } from '../utils/authentication';
import fullLogo from '../images/fullLogo.png';
import Modules from '../../app/api/agent';
import { getIconComponent } from '../utils/iconMap';
import '../styles/portal-menu/PortalMenu.scss';

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  justifyContent: 'space-between',
}));

const LogoContainer = styled('a')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
});

const LogoImage = styled('img')({
  height: '36px',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

const WorkspaceSelector = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const WorkspaceInfo = styled(Box)({
  flex: 1,
  marginLeft: 12,
  overflow: 'hidden',
});

interface Workspace {
  id: number;
  name: string;
  description?: string;
}

const PortalMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<number>(() =>
    JSON.parse(localStorage.getItem('selectedWorkspace') || '1')
  );
  const [openFolders, setOpenFolders] = useState(() => JSON.parse(localStorage.getItem('openFolders') || '{}'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { setUserName, setPassWord } = useContext(UserInfoContext);
  const userId = Number(localStorage.getItem('userid'));

  useEffect(() => {
    Modules.PortalMenu.getWorkspaces().then(setWorkspaces);
  }, []);

  useEffect(() => {
    Modules.PortalMenu.getMenu(selectedWorkspace, userId).then(setMenuItems);
  }, [selectedWorkspace, userId]);

  const flattenMenuItems = (items: any[]): any[] => {
    return items.reduce((acc, item) => {
      acc.push(item);
      if (item.children) {
        acc = acc.concat(flattenMenuItems(item.children));
      }
      return acc;
    }, []);
  };

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleFolderToggle = (label: string) => {
    setOpenFolders((prev: any) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleNavigation = (path?: string) => {
    if (path) navigate(path);
    setDrawerOpen(false);
  };

  const toggleFavorite = async (item: any) => {
    if (item.isFavorite) {
      await Modules.PortalMenu.removeFavorite(userId, item.id);
    } else {
      await Modules.PortalMenu.addFavorite(userId, item.id);
    }

    // Immediately refresh menu items after favorite update
    const updatedMenuItems = await Modules.PortalMenu.getMenu(selectedWorkspace, userId);
    setMenuItems(updatedMenuItems);
  };

  const handleWorkspaceChange = () => {
    const currentIndex = workspaces.findIndex(ws => ws.id === selectedWorkspace);
    const nextWorkspace = workspaces[(currentIndex + 1) % workspaces.length];
    setSelectedWorkspace(nextWorkspace.id);
  };

  const renderMenuItems = (items: any[], depth = 0, showFavorites = true): React.ReactNode =>
    items.map((item) => {
      const paddingLeft = depth * 2;
      const IconComponent = getIconComponent(item.iconName);

      return item.itemType === 'folder' ? (
        <React.Fragment key={item.id}>
          <ListItemButton onClick={() => handleFolderToggle(item.label)} sx={{ pl: 2 + paddingLeft }}>
            <ListItemIcon>{openFolders[item.label] ? <FolderOpenIcon /> : <FolderIcon />}</ListItemIcon>
            <ListItemText primary={item.label} />
            {openFolders[item.label] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={openFolders[item.label]} timeout="auto" unmountOnExit>
            <List disablePadding>{renderMenuItems(item.children || [], depth + 1, showFavorites)}</List>
          </Collapse>
        </React.Fragment>
      ) : (
        <ListItemButton key={item.id} onClick={() => handleNavigation(item.path)} sx={{ pl: 2 + paddingLeft }}>
          <ListItemIcon>{IconComponent && <IconComponent />}</ListItemIcon>
          <ListItemText primary={item.label} />
          {showFavorites && (
            <IconButton edge="end" size="small" onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}>
              {item.isFavorite ? <StarIcon color="primary" /> : <StarBorderIcon />}
            </IconButton>
          )}
        </ListItemButton>
      );
    });

  const currentWorkspace = workspaces.find(ws => ws.id === selectedWorkspace);

  return (
    <>
      <CssBaseline />
      <IconButton onClick={handleDrawerToggle}><MenuIcon /></IconButton>
      <Drawer variant="temporary" open={drawerOpen} onClose={handleDrawerToggle} classes={{ paper: 'drawer-paper' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <DrawerHeader>
            <LogoContainer href="/">
              <LogoImage src={fullLogo} alt="AWT" />
            </LogoContainer>
            <IconButton onClick={handleDrawerToggle}><ArrowBackIosIcon /></IconButton>
          </DrawerHeader>
          <Divider />
          <WorkspaceSelector onClick={handleWorkspaceChange}>
            <Avatar src="../images/avatar.png" />
            <WorkspaceInfo>
              <Typography variant="caption">Company</Typography>
              <Typography variant="subtitle2">{currentWorkspace?.name || 'Select Workspace'}</Typography>
            </WorkspaceInfo>
            <ExpandMore />
          </WorkspaceSelector>
          <Divider />
          <Box className="scrollable-content">
            <SectionTitle>Favorites</SectionTitle>
            <List>
              {renderMenuItems(
                flattenMenuItems(menuItems).filter((item) => item.isFavorite),
                0,
                false
              )}
            </List>
            <Divider />
            <SectionTitle>Main</SectionTitle>
            <List>
              {renderMenuItems(
                menuItems.filter((i) => !i.parentId && i.itemType !== 'folder')
              )}
            </List>
            <Divider />
            <SectionTitle>Applications</SectionTitle>
            <List>
              {renderMenuItems(menuItems.filter((i) => i.itemType === 'folder'))}
            </List>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
            <Tooltip title="Settings"><IconButton><SettingsIcon /></IconButton></Tooltip>
            <Tooltip title="Account"><IconButton><AccountCircleIcon /></IconButton></Tooltip>
            <Tooltip title="Logout">
              <IconButton onClick={() => handleLogOut(navigate, setUserName, setPassWord)}>
                <PowerSettingsNewIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default PortalMenu;
