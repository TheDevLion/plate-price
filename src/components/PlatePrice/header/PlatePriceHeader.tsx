import { Add, Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import { useDatasheets, useSelectedSheet, type TechnicalDatasheetRecord } from "../store";
import { getNextId } from "../../../helpers/idCounter";
import Inventory2 from "@mui/icons-material/Inventory2";
import { ProductsModal } from "../product/ProductModal";
import { ShareButton } from "../../../design_system/ShareButton";
import { ConfirmDialog } from "../../../design_system/ConfirmDialog";
import { useI18n } from "../../../i18n/useI18n";

export const PlatePriceHeader = () => {
  const { t } = useI18n();
  const {selectedSheet, setSelectedSheet} = useSelectedSheet()
  const {datasheets, setDatasheets} = useDatasheets()

  const DIALOG_ACTIONS = {
    ADD_RECEIPT: {
      id: "ADD_RECEIPT",
      title: t("confirmAddTitle"),
    },
    EDIT_RECEIPT: {
      id: "EDIT_RECEIPT",
      title: t("confirmEditTitle"),
    },
    DELETE_RECEIPT: {
      id: "DELETE_RECEIPT",
      title: t("confirmDeleteTitle"),
    },
  };
  
  const [openConfirmDialog, setOpenConfirmDialog] = useState<string | undefined>(undefined);
  const [showProductsModal, setShowProductsModal] = useState(false);

  const handleOpenConfirmDialog = (type: string) => setOpenConfirmDialog(type);
  const handleCloseConfirmDialog = () => setOpenConfirmDialog(undefined);

  const handleAddReceipt = (value: string) => {    
    if (!value) return;

    const newReceipt: TechnicalDatasheetRecord = { id: getNextId(), name: value };
    const newReceiptsState = [...datasheets, newReceipt]

    setDatasheets(newReceiptsState);
    setSelectedSheet(newReceipt.id)
    handleCloseConfirmDialog();
  };

  const handleRename = (value: string) => {
    if (!selectedSheet) return;

    const currentDatasheetObj = datasheets.find(d => d.id === selectedSheet)
    if (!currentDatasheetObj) return;

    if (!value) return;

    currentDatasheetObj.name = value
    const updatedDatasheets = datasheets.filter(d => d.id !== currentDatasheetObj?.id)
    updatedDatasheets.push(currentDatasheetObj)

    setDatasheets(updatedDatasheets);
    handleCloseConfirmDialog();
  };

  const handleDelete = (value: string) => {
    if (!selectedSheet) return;

    const currentDatasheetObj = datasheets.find(d => d.id === selectedSheet)
    if (!currentDatasheetObj) return;

    if (!value) return;

    const updatedDatasheets = datasheets.filter(d => d.id !== currentDatasheetObj?.id)    
    setDatasheets(updatedDatasheets);

    handleCloseConfirmDialog();
  };

  const handleSelect = (id: string) => {
    if (id) setSelectedSheet(id);
  };

  const CONFIRM_HANDLERS = {
    [DIALOG_ACTIONS.ADD_RECEIPT.id]: handleAddReceipt,
    [DIALOG_ACTIONS.EDIT_RECEIPT.id]: handleRename,
    [DIALOG_ACTIONS.DELETE_RECEIPT.id]: handleDelete,
  } as const;


  return (
    <header className="relative flex flex-col items-center justify-center py-2 border-b border-grape-200 bg-white shadow-sm">
      <div className="self-end mb-2 sm:mb-0 sm:absolute sm:top-1 sm:right-1">
        <ShareButton />
      </div>

      <h1 className="font-bold text-3xl mb-3">{t("headerTitle")}</h1>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <select
          value={selectedSheet ?? ""}
          onChange={(e) => handleSelect(e.target.value)}
          className="w-full sm:w-auto border border-grape-200 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-grape-400"
        >
          <option value="">{t("selectReceiptPlaceholder")}</option>
          {datasheets.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        {selectedSheet && (
          <>
            <button
              className="bg-ink hover:bg-black text-white p-2 rounded transition"
              onClick={() => handleOpenConfirmDialog(DIALOG_ACTIONS.EDIT_RECEIPT.id)}
              aria-label={t("editReceipt")}
            >
              <Edit fontSize="small" />
            </button>
            <button
              className="bg-ink hover:bg-black text-white p-2 rounded transition"
              onClick={() => handleOpenConfirmDialog(DIALOG_ACTIONS.DELETE_RECEIPT.id)}
              aria-label={t("deleteReceipt")}
            >
              <Delete fontSize="small" />
            </button>
          </>
        )}

        <button
          className="bg-grape-600 hover:bg-grape-700 text-white p-2 rounded shadow transition m-1 sm:m-2"
          onClick={() => handleOpenConfirmDialog(DIALOG_ACTIONS.ADD_RECEIPT.id)}
          aria-label={t("addReceipt")}
        >
          <Add />
        </button>

      </div>

      <button
        className="w-full sm:w-auto bg-grape-600 hover:bg-grape-700 text-white p-2 rounded shadow transition m-2"
        onClick={() => setShowProductsModal(true)}
      >
        <Inventory2 fontSize="small" /> {t("manageProducts")}
      </button>

      {showProductsModal && (
        <ProductsModal onClose={() => setShowProductsModal(false)} />
      )}

      <ConfirmDialog
        open={!!openConfirmDialog} 
        title={DIALOG_ACTIONS[openConfirmDialog as keyof typeof DIALOG_ACTIONS]?.title || ''}
        onClose={handleCloseConfirmDialog} 
        onConfirm={CONFIRM_HANDLERS[openConfirmDialog as keyof typeof CONFIRM_HANDLERS] || (() => {})} 
        noText={openConfirmDialog === DIALOG_ACTIONS.DELETE_RECEIPT.id}
      />
    </header>
  );
};
