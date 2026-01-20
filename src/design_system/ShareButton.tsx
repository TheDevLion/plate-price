import { Button, Tooltip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import { exportLocalStorageToURL, PAGE_TO_REDIRECT, QUERY_PARAM_KEY } from "./RestoreFromUrlHelper";
import { useI18n } from "../i18n/useI18n";

export const ShareButton = () => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const compressed = exportLocalStorageToURL();

    const basePath = import.meta.env.BASE_URL || "/";
    const base = `${window.location.origin}${basePath}#${PAGE_TO_REDIRECT}`;
    const shareUrl = `${base}?${QUERY_PARAM_KEY}=${encodeURIComponent(compressed)}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {console.log(err)}
  };

  return (
    <Tooltip title={copied ? t("copied") : t("shareTooltip")}>
      <Button
        variant="contained"
        color="primary"
        startIcon={copied ? <ContentCopyIcon /> : <ShareIcon />}
        onClick={handleShare}
        sx={{ m: 1 }}
      >
        {copied ? t("copied") : t("share")}
      </Button>
    </Tooltip>
  );
};
