import React from 'react';
import { Box, Container, Typography, Breadcrumbs } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PortalMenu from './PortalMenu';
import { useLocation } from 'react-router-dom';
import { ROUTE_PATHS } from '../../routes';
import { Home } from '@mui/icons-material';

interface IProps {
  pageName: string;
  pageHref: string;
}

const PageHeader: React.FC<IProps> = ({ pageName, pageHref }) => {
  const username = localStorage.getItem('username') || 'User';
  const location = useLocation();
  const currentPath = location.pathname;

  /**
   * Retrieve the folder name based on the current path.
   */
  const getFolderNameFromPath = (path: string): string => {
    const folderName = findFolderName(ROUTE_PATHS, path);
    return folderName ? capitalizeFirstLetter(folderName) : '';
  };

  /**
   * Recursive function to find the folder name corresponding to the current path.
   */
  const findFolderName = (
    routes: any,
    path: string,
    parentKey: string = ''
  ): string | null => {
    for (const [key, value] of Object.entries(routes)) {
      if (typeof value === 'string') {
        if (value === path) {
          return parentKey;
        }
      } else if (typeof value === 'object') {
        const result = findFolderName(value, path, key);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  /**
   * Capitalize the first letter of the folder name (with special cases).
   */
  const capitalizeFirstLetter = (str: string): string => {
    const specialCases: { [key: string]: string } = {
      it: 'IT',
      cam: 'CAM',
    };
    const lowerCased = str.toLowerCase();
    return specialCases[lowerCased] || str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const folderName = getFolderNameFromPath(currentPath);

  return (
    <Container
      maxWidth={false}
      sx={{
        padding: '15px 50px',
        backgroundColor: 'whiteSmoke',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <Grid2 container alignItems="center">
        {/* Left Side: PortalMenu and Breadcrumbs */}
        <Grid2 size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <PortalMenu />
          <Breadcrumbs
            separator=">"
            aria-label="breadcrumb"
            sx={{ marginLeft: '15px', color: '#384959' }}
          >
            {/* Home Icon and Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#384959' }}>
              <Home fontSize="small" sx={{ marginRight: '4px' }} />
              <Typography variant="body2">Home</Typography>
            </Box>
            {/* Conditionally render Folder Name */}
            {folderName && (
              <Typography variant="body2" sx={{ color: '#384959' }}>
                {folderName}
              </Typography>
            )}
            {/* Current Page Name */}
            <Typography variant="body2" color="textPrimary">
              {pageName}
            </Typography>
          </Breadcrumbs>
        </Grid2>

        {/* Right Side: User Information */}
        <Grid2
          size={{ xs: 6 }}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Box display="flex" alignItems="center">
            <Typography
              variant="h6"
              component="div"
              sx={{ display: 'inline-flex', alignItems: 'center', color: '#384959' }}
            >
              <AccountCircleIcon fontSize="small" sx={{ marginRight: '3px' }} />
              {username}
            </Typography>
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default PageHeader;
