import { Add, Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import { useDatasheets, useSelectedSheet, makeRecipe, recipeId, recipeName } from "../store";
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
    ADD_RECIPE: {
      id: "ADD_RECIPE",
      title: t("confirmAddTitle"),
    },
    EDIT_RECIPE: {
      id: "EDIT_RECIPE",
      title: t("confirmEditTitle"),
    },
    DELETE_RECIPE: {
      id: "DELETE_RECIPE",
      title: t("confirmDeleteTitle"),
    },
  };
  
  const [openConfirmDialog, setOpenConfirmDialog] = useState<string | undefined>(undefined);
  const [showProductsModal, setShowProductsModal] = useState(false);

  const handleOpenConfirmDialog = (type: string) => setOpenConfirmDialog(type);
  const handleCloseConfirmDialog = () => setOpenConfirmDialog(undefined);

  const handleAddRecipe = (value: string) => {
    if (!value) return;

    const newRecipe = makeRecipe(getNextId(), value);
    const newRecipesState = [...datasheets, newRecipe]

    setDatasheets(newRecipesState);
    setSelectedSheet(newRecipe[0])
    handleCloseConfirmDialog();
  };

  const handleRename = (value: string) => {
    if (!selectedSheet) return;

    const currentDatasheetObj = datasheets.find(d => recipeId(d) === selectedSheet)
    if (!currentDatasheetObj) return;

    if (!value) return;

    const updatedDatasheets = datasheets.map((d) =>
      recipeId(d) === recipeId(currentDatasheetObj) ? makeRecipe(recipeId(d), value) : d
    )

    setDatasheets(updatedDatasheets);
    handleCloseConfirmDialog();
  };

  const handleDelete = (value: string) => {
    if (!selectedSheet) return;

    const currentDatasheetObj = datasheets.find(d => recipeId(d) === selectedSheet)
    if (!currentDatasheetObj) return;

    if (!value) return;

    const updatedDatasheets = datasheets.filter(d => recipeId(d) !== recipeId(currentDatasheetObj))
    setDatasheets(updatedDatasheets);

    handleCloseConfirmDialog();
  };

  const handleSelect = (id: string) => {
    if (id) setSelectedSheet(id);
  };

  const CONFIRM_HANDLERS = {
    [DIALOG_ACTIONS.ADD_RECIPE.id]: handleAddRecipe,
    [DIALOG_ACTIONS.EDIT_RECIPE.id]: handleRename,
    [DIALOG_ACTIONS.DELETE_RECIPE.id]: handleDelete,
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
          <option value="">{t("selectRecipePlaceholder")}</option>
          {datasheets.map((r) => (
            <option key={recipeId(r)} value={recipeId(r)}>
              {recipeName(r)}
            </option>
          ))}
        </select>

        {selectedSheet && (
          <>
            <button
              className="bg-ink hover:bg-black text-white p-2 rounded transition"
              onClick={() => handleOpenConfirmDialog(DIALOG_ACTIONS.EDIT_RECIPE.id)}
              aria-label={t("editRecipe")}
            >
              <Edit fontSize="small" />
            </button>
            <button
              className="bg-ink hover:bg-black text-white p-2 rounded transition"
              onClick={() => handleOpenConfirmDialog(DIALOG_ACTIONS.DELETE_RECIPE.id)}
              aria-label={t("deleteRecipe")}
            >
              <Delete fontSize="small" />
            </button>
          </>
        )}

        <button
          className="bg-grape-600 hover:bg-grape-700 text-white p-2 rounded shadow transition m-1 sm:m-2"
          onClick={() => handleOpenConfirmDialog(DIALOG_ACTIONS.ADD_RECIPE.id)}
          aria-label={t("addRecipe")}
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
        noText={openConfirmDialog === DIALOG_ACTIONS.DELETE_RECIPE.id}
      />
    </header>
  );
};
