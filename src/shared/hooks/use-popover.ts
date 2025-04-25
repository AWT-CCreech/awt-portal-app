import * as React from 'react';

export interface PopoverController<T> {
  anchorRef: React.RefObject<T | null>;
  handleOpen: () => void;
  handleClose: () => void;
  handleToggle: () => void;
  open: boolean;
}

export function usePopover<T = HTMLElement>(): PopoverController<T> {
  const anchorRef: React.RefObject<T | null> = React.useRef<T | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleOpen = React.useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const handleToggle = React.useCallback(() => {
    setOpen(o => !o);
  }, []);

  return { anchorRef, open, handleOpen, handleClose, handleToggle };
}