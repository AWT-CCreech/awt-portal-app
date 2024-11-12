import React from 'react';
import {
    Button,
    CircularProgress,
    Box,
    SxProps,
    Theme,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface LoadingIconButtonProps {
    text: string;
    icon?: SvgIconComponent; // Optional icon
    loading: boolean; // Controls the loading state
    onClick: () => void; // Click handler for the button
    sx?: SxProps<Theme>; // Optional custom styles
}

const LoadingIconButton: React.FC<LoadingIconButtonProps> = ({
    text,
    icon: Icon,
    loading,
    onClick,
    sx,
}) => {
    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onClick}
            disabled={loading}
            sx={{
                position: 'relative',
                minWidth: '150px',
                height: '56px', // Adjusted to match other components
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '40px', // Reserve space for icon/spinner
                paddingRight: '12px',
                ...sx, // Apply custom styles passed in via sx
            }}
        >
            {/* Absolute Positioned Icon/Spinner */}
            <Box
                sx={{
                    position: 'absolute',
                    left: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                }}
            >
                {!loading && Icon && <Icon />}
                {loading && (
                    <CircularProgress
                        size={20}
                        sx={{
                            color: 'white',
                        }}
                    />
                )}
            </Box>

            {/* Button Text */}
            <Box
                sx={{
                    flexGrow: 1,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                }}
            >
                {text}
            </Box>
        </Button>
    );
};

export default LoadingIconButton;
