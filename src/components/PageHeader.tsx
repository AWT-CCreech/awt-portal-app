import React from 'react';
import { Box, Container, Grid, Typography, Breadcrumbs } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PortalMenu from './PortalMenu';
import { useLocation } from 'react-router-dom';
import { ROUTE_PATHS } from '../routes';
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
   * Function to retrieve the folder name based on the current path.
   * It traverses the ROUTE_PATHS to find a matching path and returns the parent folder name.
   */
  const getFolderNameFromPath = (path: string): string => {
    const folderName = findFolderName(ROUTE_PATHS, path);
    return folderName ? capitalizeFirstLetter(folderName) : '';
  };

  /**
   * Recursive function to find the folder name corresponding to the current path.
   * @param routes - The ROUTE_PATHS object.
   * @param path - The current URL path.
   * @param parentKey - The current folder key being traversed.
   * @returns The folder name if found, otherwise null.
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
   * Function to capitalize the first letter of the folder name.
   * Handles special cases like 'it' and 'cam'.
   * @param string - The folder name string.
   * @returns The capitalized folder name.
   */
  const capitalizeFirstLetter = (string: string): string => {
    const specialCases: { [key: string]: string } = {
      it: 'IT',
      cam: 'CAM',
    };
    const lowerCased = string.toLowerCase();
    return (
      specialCases[lowerCased] ||
      string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    );
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
        zIndex: 1100, // Ensure it's above other elements
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <Grid container alignItems="center">
        {/* Left Side: PortalMenu and Breadcrumbs */}
        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <PortalMenu />
          {/* Breadcrumbs for styling without navigation */}
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

            {/* Conditionally render Folder Name if it exists */}
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
        </Grid>

        {/* Right Side: User Information */}
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
        </Grid>

        {/* Optional: You can remove the following Grid item if you don't want additional content */}
        {/* 
        <Grid item xs={12} sx={{ marginTop: '15px' }}>
          <Breadcrumbs
            separator=">"
            aria-label="breadcrumb"
            sx={{ color: '#384959' }}
          >
            <Typography
              variant="body2"
              sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}
            >
              <HomeIcon fontSize="small" sx={{ marginRight: '4px' }} />
              Home
            </Typography>
            {folderName && (
              <Typography
                variant="body2"
                sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}
              >
                {folderName}
              </Typography>
            )}
            <Typography variant="body2" color="textPrimary">
              {pageName}
            </Typography>
          </Breadcrumbs>
        </Grid>
        */}
      </Grid>
    </Container>
  );
};

export default PageHeader;
