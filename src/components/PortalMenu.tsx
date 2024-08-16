import React, { useState, useEffect, useContext } from 'react';
import {
  List,
  ListItemText,
  ListItemIcon,
  Collapse,
  Drawer,
  IconButton,
  Divider,
  ListItemButton,
  CssBaseline,
  Tooltip,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Menu,
  Star,
  StarBorder,
  Folder,
  FolderOpen,
  ArrowBackIos,
  Settings,
  AccountCircle,
  PowerSettingsNew,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { grey, blue } from '@mui/material/colors';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { handleLogOut } from '../utils/authentication';
import UserInfoContext from '../stores/userInfo';
import logo from '../assets/images/fullLogo.png';

// Set drawer width
const drawerWidth = 300;

// Custom styled components
const DrawerPaper = {
  width: drawerWidth,
  backgroundColor: '#ffffff',
  color: grey[900],
  overflowX: 'hidden',
};

const TitleRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '60px',
  padding: '16px',
  backgroundColor: grey[200],
  position: 'sticky',
  top: 0,
  zIndex: 1001,
});

const MenuHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  justifyContent: 'space-between', 
  backgroundColor: grey[200],
  position: 'sticky',
  top: '60px',
  zIndex: 1000,
});

const LogoContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const LogoImage = styled('img')({
  height: '36px',
  marginRight: '8px',
});

const IconButtonContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const ListItemCustom = styled(ListItemButton)({
  padding: '10px 20px',
  borderRadius: '8px',
  margin: '4px 0',
  '&:hover': {
    backgroundColor: grey[100],
  },
});

const ListItemTextCustom = styled(ListItemText)({
  color: grey[900],
  fontWeight: '500',
});

const ListItemIconCustom = styled(ListItemIcon)({
  color: grey[900],
});

const ListItemFavorite = styled(ListItemButton)({
  padding: '10px 20px',
  backgroundColor: blue[50],
  borderRadius: '8px',
  margin: '4px 0',
  '&:hover': {
    backgroundColor: blue[100],
  },
});

const NestedListItem = styled(ListItemButton)({
  paddingLeft: '40px',
  borderRadius: '8px',
  margin: '4px 0',
  '&:hover': {
    backgroundColor: grey[100],
  },
});

const SectionHeader = styled('div')({
  backgroundColor: grey[300],
  padding: '10px 20px',
  borderRadius: '8px',
  margin: '8px 0',
});

const SectionHeaderText = styled(ListItemText)({
  color: grey[900],
  fontWeight: 'bold',
});

const FavoritesHeader = styled(SectionHeader)({
  backgroundColor: blue[500],
  color: 'white',
});

const MainHeader = styled(SectionHeader)({
  backgroundColor: grey[300],
  color: 'white',
});

const ScrollbarContainer = styled('div')({
  overflowY: 'auto',
  height: '100%',
  '&::-webkit-scrollbar': {
    width: '12px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f5f5f5',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#dcdcdc',
    borderRadius: '6px',
    border: '3px solid #f5f5f5',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#cccccc',
  },
});

const PortalMenu: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

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

  const navigate = useNavigate();
  const userInfo = useContext(UserInfoContext);
  const { setUserName, setPassWord } = userInfo;

  useEffect(() => {
    if (drawerOpen !== false) {
      localStorage.setItem('drawerOpen', JSON.stringify(drawerOpen));
    }
  }, [drawerOpen]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('openFolders', JSON.stringify(openFolders));
  }, [openFolders]);

  const handleDrawerToggle = () => {
    const newDrawerOpen = !drawerOpen;
    setDrawerOpen(newDrawerOpen);
    localStorage.setItem('drawerOpen', JSON.stringify(newDrawerOpen));
  };

  const handleNavigation = (path: string) => {
    setDrawerOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const handleFolderToggle = (folder: string) => {
    setOpenFolders({ ...openFolders, [folder]: !openFolders[folder] });
  };

  const handleFavoriteToggle = (app: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(app)
        ? prevFavorites.filter((fav) => fav !== app)
        : [...prevFavorites, app]
    );
  };

  const isFavorite = (app: string) => favorites.includes(app);

  const getFolderTitle = (folder: string) => {
    return folder === 'it'
      ? 'IT'
      : folder === 'cam'
      ? 'CAM'
      : folder.charAt(0).toUpperCase() + folder.slice(1);
  };

  const formatPath = (path: string) => path.toLowerCase().replace(/\s+/g, '');

  return (
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <IconButton onClick={handleDrawerToggle} sx={{ color: grey[900] }}>
        <Menu />
      </IconButton>
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{ '& .MuiDrawer-paper': DrawerPaper }}
      >
        <ScrollbarContainer>
          <TitleRow>
            <LogoContainer>
              <LogoImage src={logo} alt="AWT" />
            </LogoContainer>
          </TitleRow>
          <MenuHeader>
            <IconButton onClick={handleDrawerToggle} sx={{ color: grey[900] }}>
              <ArrowBackIos />
            </IconButton>
            <IconButtonContainer>
              <Tooltip title="Settings">
                <IconButton sx={{ color: grey[900] }}>
                  <Settings />
                </IconButton>
              </Tooltip>
              <Tooltip title="Account">
                <IconButton sx={{ color: grey[900] }}>
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton
                  sx={{ color: grey[900] }}
                  onClick={() => handleLogOut(navigate, setUserName, setPassWord)}
                >
                  <PowerSettingsNew />
                </IconButton>
              </Tooltip>
            </IconButtonContainer>
          </MenuHeader>
          <List>
            {favorites.length > 0 && (
              <>
                <FavoritesHeader>
                  <SectionHeaderText primary="Favorites" />
                </FavoritesHeader>
                {favorites.map((favorite) => (
                  <ListItemFavorite
                    key={favorite}
                    onClick={() => handleNavigation(`/${formatPath(favorite)}`)}
                  >
                    <ListItemTextCustom primary={favorite} />
                    <ListItemIconCustom
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(favorite);
                      }}
                    >
                      {isFavorite(favorite) ? (
                        <Star sx={{ color: blue[800] }} />
                      ) : (
                        <StarBorder sx={{ color: blue[800] }} />
                      )}
                    </ListItemIconCustom>
                  </ListItemFavorite>
                ))}
                <Divider />
              </>
            )}
            <MainHeader>
              <SectionHeaderText primary="Main" />
            </MainHeader>
            <ListItemCustom onClick={() => handleNavigation('/mastersearch')}>
              <ListItemTextCustom primary="Master Search" />
              <ListItemIconCustom
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavoriteToggle('Master Search');
                }}
              >
                {isFavorite('Master Search') ? (
                  <Star sx={{ color: blue[800] }} />
                ) : (
                  <StarBorder sx={{ color: blue[800] }} />
                )}
              </ListItemIconCustom>
            </ListItemCustom>
            <ListItemCustom onClick={() => handleNavigation('/userlist')}>
              <ListItemTextCustom primary="User List" />
              <ListItemIconCustom
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavoriteToggle('User List');
                }}
              >
                {isFavorite('User List') ? (
                  <Star sx={{ color: blue[800] }} />
                ) : (
                  <StarBorder sx={{ color: blue[800] }} />
                )}
              </ListItemIconCustom>
            </ListItemCustom>
            <Divider />
            <Collapse in={drawerOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {Object.keys(openFolders).map((folder) => (
                  <div key={folder}>
                    <ListItemCustom onClick={() => handleFolderToggle(folder)}>
                      <ListItemIconCustom>
                        {openFolders[folder] ? <FolderOpen /> : <Folder />}
                      </ListItemIconCustom>
                      <ListItemTextCustom primary={getFolderTitle(folder)} />
                      {openFolders[folder] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemCustom>
                    <Collapse in={openFolders[folder]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {folder === 'purchasing' && (
                          <>
                            <NestedListItem
                              onClick={() => handleNavigation('/dropship')}
                            >
                              <ListItemTextCustom primary="Drop Ship" />
                              <ListItemIconCustom onClick={(e) => { e.stopPropagation(); handleFavoriteToggle('Drop Ship'); }}>
                                {isFavorite('Drop Ship') ? <Star sx={{ color: blue[700] }} /> : <StarBorder sx={{ color: blue[700] }} />}
                              </ListItemIconCustom>
                            </NestedListItem>
                            <NestedListItem
                              onClick={() => handleNavigation('/massmailer')}
                            >
                              <ListItemTextCustom primary="Mass Mailer" />
                              <ListItemIconCustom onClick={(e) => { e.stopPropagation(); handleFavoriteToggle('Mass Mailer'); }}>
                                {isFavorite('Mass Mailer') ? <Star sx={{ color: blue[700] }} /> : <StarBorder sx={{ color: blue[700] }} />}
                              </ListItemIconCustom>
                            </NestedListItem>
                          </>
                        )}
                        {folder === 'sales' && (
                          <NestedListItem
                            onClick={() => handleNavigation('/opensalesorderreport')}
                          >
                            <ListItemTextCustom primary="Open SO Report" />
                            <ListItemIconCustom
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFavoriteToggle('Open Sales Order Report');
                              }}
                            >
                              {isFavorite('Open Sales Order Report') ? (
                                <Star sx={{ color: blue[700] }} />
                              ) : (
                                <StarBorder sx={{ color: blue[700] }} />
                              )}
                            </ListItemIconCustom>
                          </NestedListItem>
                        )}
                        <NestedListItem
                          onClick={() => handleNavigation(`/${formatPath(folder + ' item1')}`)}
                        >
                          <ListItemTextCustom primary={`${getFolderTitle(folder)} Item 1`} />
                          <ListItemIconCustom
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteToggle(`${getFolderTitle(folder)} Item 1`);
                            }}
                          >
                            {isFavorite(`${getFolderTitle(folder)} Item 1`) ? (
                              <Star sx={{ color: blue[800] }} />
                            ) : (
                              <StarBorder sx={{ color: blue[800] }} />
                            )}
                          </ListItemIconCustom>
                        </NestedListItem>
                        <NestedListItem onClick={() => handleNavigation(`/${formatPath(folder + ' item2')}`)}>
                          <ListItemTextCustom primary={`${getFolderTitle(folder)} Item 2`} />
                          <ListItemIconCustom
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteToggle(`${getFolderTitle(folder)} Item 2`);
                            }}
                          >
                            {isFavorite(`${getFolderTitle(folder)} Item 2`) ? (
                              <Star sx={{ color: blue[800] }} />
                            ) : (
                              <StarBorder sx={{ color: blue[800] }} />
                            )}
                          </ListItemIconCustom>
                        </NestedListItem>
                      </List>
                    </Collapse>
                  </div>
                ))}
              </List>
            </Collapse>
          </List>
        </ScrollbarContainer>
      </Drawer>
    </ThemeProvider>
  );
};

export default PortalMenu;
