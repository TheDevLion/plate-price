import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import { useI18n } from "../i18n/useI18n";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
  noText: boolean;
};

export const ConfirmDialog = ({ open, title, onClose, onConfirm, noText }: ConfirmDialogProps) => {
  const { t } = useI18n();
  const [value, setValue] = useState('');

  const handleConfirm = () => {
    onConfirm(noText ? 'true' : value);
    setValue('');
  };

  const handleClose = () => {
    onClose();
    setValue('');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {!noText && (
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleConfirm();
          }}
            />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          {t("cancel")}
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          {t("ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
