import { Add, Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
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
  const selectedRecipe = datasheets.find(d => recipeId(d) === selectedSheet);

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
    setSelectedSheet(updatedDatasheets[0]?.[0]);

    handleCloseConfirmDialog();
  };

  const handleSelect = (id: string) => {
    setSelectedSheet(id || undefined);
  };

  const CONFIRM_HANDLERS = {
    [DIALOG_ACTIONS.ADD_RECIPE.id]: handleAddRecipe,
    [DIALOG_ACTIONS.EDIT_RECIPE.id]: handleRename,
    [DIALOG_ACTIONS.DELETE_RECIPE.id]: handleDelete,
  } as const;


  return (
    <header className="border-b border-grape-100 bg-white px-4 py-4 sm:px-6 sm:py-5">
      <div className="mx-auto max-w-5xl space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-3 sm:flex-wrap">
          <h1 className="min-w-0 text-xl font-bold sm:text-3xl">{t("headerTitle")}</h1>
          <ShareButton />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_44px_44px] items-center gap-2 sm:flex sm:flex-wrap">
          <select
            value={selectedRecipe ? selectedSheet : ""}
            onChange={event => handleSelect(event.target.value)}
            aria-label={t("selectRecipePlaceholder")}
            className={`ui-control w-full sm:w-72 ${selectedRecipe ? "" : "col-span-3"}`}
          >
            <option value="">{t("selectRecipePlaceholder")}</option>
            {datasheets.map(recipe => (
              <option key={recipeId(recipe)} value={recipeId(recipe)}>
                {recipeName(recipe)}
              </option>
            ))}
          </select>

          {selectedRecipe && (
            <>
              <Tooltip title={t("editRecipe")}>
                <IconButton onClick={() => handleOpenConfirmDialog(DIALOG_ACTIONS.EDIT_RECIPE.id)} aria-label={t("editRecipe")} color="primary">
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("deleteRecipe")}>
                <IconButton onClick={() => handleOpenConfirmDialog(DIALOG_ACTIONS.DELETE_RECIPE.id)} aria-label={t("deleteRecipe")} color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}

          <div className="col-span-3 grid grid-cols-2 gap-2 sm:contents">
            <Button variant="contained" startIcon={<Add />} aria-label={t("addRecipe")} onClick={() => handleOpenConfirmDialog(DIALOG_ACTIONS.ADD_RECIPE.id)}>
              <span className="sm:hidden">{t("newRecipe")}</span>
              <span className="hidden sm:inline">{t("addRecipe")}</span>
            </Button>
            <Button variant="outlined" startIcon={<Inventory2 fontSize="small" />} aria-label={t("manageProducts")} onClick={() => setShowProductsModal(true)} sx={{ marginLeft: { sm: "auto" }, "@media (max-width: 639px)": { marginLeft: 0 } }}>
              <span className="sm:hidden">{t("productsShort")}</span>
              <span className="hidden sm:inline">{t("manageProducts")}</span>
            </Button>
          </div>
        </div>
      </div>

      {showProductsModal && <ProductsModal onClose={() => setShowProductsModal(false)} />}

      <ConfirmDialog
        open={!!openConfirmDialog}
        title={DIALOG_ACTIONS[openConfirmDialog as keyof typeof DIALOG_ACTIONS]?.title || ""}
        onClose={handleCloseConfirmDialog}
        onConfirm={CONFIRM_HANDLERS[openConfirmDialog as keyof typeof CONFIRM_HANDLERS] || (() => {})}
        noText={openConfirmDialog === DIALOG_ACTIONS.DELETE_RECIPE.id}
        initialValue={openConfirmDialog === DIALOG_ACTIONS.EDIT_RECIPE.id && selectedRecipe ? recipeName(selectedRecipe) : ""}
        description={openConfirmDialog === DIALOG_ACTIONS.DELETE_RECIPE.id && selectedRecipe ? recipeName(selectedRecipe) : undefined}
      />
    </header>
  );
};
