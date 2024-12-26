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
    size = 'medium',
    ...rest
}) => {
    // Define icon and spinner sizes based on the button size
    const iconSize = React.useMemo(() => {
        switch (size) {
            case 'small':
                return 18;
            case 'large':
                return 24;
            default:
                return 20;
        }
    }, [size]);

    return (
        <Button
            variant={variant}
            color={color}
            onClick={onClick}
            disabled={loading || disabled} // Disable the button when loading or explicitly disabled
            aria-busy={loading} // Indicates loading state for accessibility
            aria-label={text} // Provides an accessible label
            type={type} // Supports 'button', 'submit', 'reset'
            size={size} // Utilize MUI's size prop
            sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: Icon || loading ? `${iconSize + 16}px` : undefined, // Adjust padding if icon/spinner is present
                paddingRight: '12px',
                minWidth: 'auto', // Remove fixed minWidth
                // Optional: Add responsive styles if needed
                ...sx, // Allow custom styles via the sx prop
            }}
            {...rest} // Forward any additional props to the Button component
        >
            {/* Positioned Icon or Spinner */}
            {(Icon || loading) && (
                <Box
                    sx={{
                        position: 'absolute',
                        left: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: `${iconSize}px`,
                        height: `${iconSize}px`,
                    }}
                >
                    {/* Display the icon if not loading */}
                    {!loading && Icon && <Icon fontSize="inherit" />}

                    {/* Display the loading spinner when loading */}
                    {loading && (
                        <CircularProgress
                            size={iconSize}
                            sx={{
                                color:
                                    variant === 'outlined'
                                        ? 'primary.main'
                                        : 'white',
                            }}
                        />
                    )}
                </Box>
            )}

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
