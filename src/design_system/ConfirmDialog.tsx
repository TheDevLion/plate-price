import { useEffect, useId, useState, type FormEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useI18n } from "../i18n/useI18n";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
  noText: boolean;
  initialValue?: string;
  description?: string;
  confirmLabel?: string;
};

export const ConfirmDialog = ({
  open, title, onClose, onConfirm, noText, initialValue = "", description, confirmLabel,
}: ConfirmDialogProps) => {
  const { t } = useI18n();
  const titleId = useId();
  const descriptionId = useId();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  const handleConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!noText && !value.trim()) return;
    onConfirm(noText ? "true" : value.trim());
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      slotProps={{ paper: { component: "form", onSubmit: handleConfirm, sx: {
        "@media (max-width: 639px), (max-height: 480px)": { m: 2, width: "calc(100% - 32px)", maxHeight: "calc(100dvh - 32px)", overflowWrap: "anywhere" },
      } } }}
    >
      <DialogTitle id={titleId}>{title}</DialogTitle>
      <DialogContent>
        {description && <DialogContentText id={descriptionId}>{description}</DialogContentText>}
        {!noText && (
          <TextField
            autoFocus
            label={t("recipeName")}
            margin="dense"
            fullWidth
            required
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, "@media (max-width: 639px)": {
        display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1,
        "& > :not(style) ~ :not(style)": { marginLeft: 0 },
      } }}>
        <Button onClick={onClose} color="secondary" autoFocus={noText}>
          {t("cancel")}
        </Button>
        <Button type="submit" variant="contained" color={noText ? "error" : "primary"} disabled={!noText && !value.trim()}>
          {confirmLabel ?? t(noText ? "delete" : "save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
