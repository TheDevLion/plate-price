import { Button, Tooltip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import { exportLocalStorageToURL, PAGE_TO_REDIRECT, QUERY_PARAM_KEY } from "./RestoreFromUrlHelper";

export const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const compressed = exportLocalStorageToURL();

    const base = `${window.location.origin}${window.location.pathname}#${PAGE_TO_REDIRECT}`;
    const shareUrl = `${base}?${QUERY_PARAM_KEY}=${compressed}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {console.log(err)}
  };

  return (
    <Tooltip title={copied ? "Copied!" : "Share this datasheet"}>
      <Button
        variant="contained"
        color="primary"
        startIcon={copied ? <ContentCopyIcon /> : <ShareIcon />}
        onClick={handleShare}
        className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded shadow transition m-2"
      >
        {copied ? "Copied!" : "Share"}
      </Button>
    </Tooltip>
  );
};
