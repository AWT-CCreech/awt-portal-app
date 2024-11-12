// src/components/LoadingIconButton.tsx

import React from 'react';
import {
    Button,
    CircularProgress,
    Box,
    SxProps,
    Theme,
    ButtonProps,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface LoadingIconButtonProps extends Omit<ButtonProps, 'onClick'> {
    /**
     * The text to display within the button.
     */
    text: string;

    /**
     * An optional icon component to display alongside the text.
     */
    icon?: SvgIconComponent;

    /**
     * Indicates whether the button is in a loading state.
     */
    loading: boolean;

    /**
     * Click handler for the button. Optional to accommodate form submissions.
     */
    onClick?: () => void;
}

/**
 * A reusable button component that displays a loading spinner when in a loading state.
 * It can optionally display an icon and supports various button types and styles.
 */
const LoadingIconButton: React.FC<LoadingIconButtonProps> = ({
    text,
    icon: Icon,
    loading,
    onClick,
    sx,
    color = 'primary',
    variant = 'contained',
    type = 'button',
    disabled = false,
    ...rest
}) => {
    return (
        <Button
            variant={variant}
            color={color}
            onClick={onClick}
            disabled={loading || disabled} // Disable the button when loading or explicitly disabled
            aria-busy={loading} // Indicates loading state for accessibility
            aria-label={text} // Provides an accessible label
            type={type} // Supports 'button', 'submit', 'reset'
            sx={{
                position: 'relative',
                minWidth: '150px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '40px', // Space reserved for icon/spinner
                paddingRight: '12px',
                ...sx, // Allow custom styles via the sx prop
            }}
            {...rest} // Forward any additional props to the Button component
        >
            {/* Positioned Icon or Spinner */}
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
                {/* Display the icon if not loading */}
                {!loading && Icon && <Icon />}

                {/* Display the loading spinner when loading */}
                {loading && (
                    <CircularProgress
                        size={20}
                        sx={{
                            color: variant === 'outlined' ? 'primary.main' : 'white',
                        }}
                    />
                )}
            </Box>

            {/* Centered Button Text */}
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

// Optimize performance by preventing unnecessary re-renders
export default React.memo(LoadingIconButton);
