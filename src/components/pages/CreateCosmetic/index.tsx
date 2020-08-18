import React, { FunctionComponent, useReducer, useState } from "react";
import { inject, observer } from "mobx-react";
import { IMainStore } from "../../../stores";
import { CreateCosmeticTemplate } from "../../templates/CreateCosmeticTemplate";
import {
  alreadyIdExistsInDB,
  getErrorValidation,
  isNotEmpty,
} from "../../../utils/validation";
import { expendedItemType, formDataType } from "types";
import {
  saveInDBNewItemCosmetic,
  updateTaskAfterNewItem,
} from "../../../controller";
import config from "../../../config";

export const CreateCosmetic: FunctionComponent<IMainStore> = inject("stores")(
  observer(({ stores }) => {
    const itemsCosmetic = stores!.ItemsCosmetic;
    const [buttonFormDisabled, setButtonFormDisabled] = useState(true);
    const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
    const [isOpenAlert, setOpenAlert] = useState(false);
    const [currentName, setCurrentName] = useState("");

    const nameFieldChange = (e: React.SyntheticEvent) => {
      const value = (e.target as HTMLInputElement).value.trim();
      const empty = isNotEmpty(value);

      itemsCosmetic.setCurrentField({ field: "name", error: "" });
      if (empty) {
        itemsCosmetic.setCurrentField({
          field: "name",
          error: getErrorValidation(empty),
        });
        setButtonFormDisabled(true);
        forceUpdate();
        return;
      }

      alreadyIdExistsInDB(value).then((result: any) => {
        if (result) {
          itemsCosmetic.setCurrentField({
            field: "name",
            error: "Такое имя уже существует",
          });
          setButtonFormDisabled(true);
        } else {
          itemsCosmetic.setCurrentField({
            field: "name",
            value: value,
            error: "",
          });
          setCurrentName(value);
          setButtonFormDisabled(false);
        }
        forceUpdate();
      });
    };

    const changeField = (e: any, data: formDataType) => {
      if (data.field === "name") {
        nameFieldChange(e);
        return;
      }
      itemsCosmetic.setCurrentField({
        ...data,
      });
      forceUpdate();
    };

    const popupConfirmation = () => {
      setOpenAlert(false);
      window.location.href = config.baseHref+"/items";
    };

    const buttonClick = () => {
      saveInDBNewItemCosmetic(itemsCosmetic!.currentItem as expendedItemType)
        .then(() => updateTaskAfterNewItem())
        .then(() => itemsCosmetic.clearCurrentItem())
        .then(() => setOpenAlert(true));
    };

    return (
      <CreateCosmeticTemplate
        changeHandler={changeField}
        stores={stores!}
        disabledButton={buttonFormDisabled}
        error={itemsCosmetic.currentItem.name.error || ""}
        clickHandler={buttonClick}
        isOpenAlert={isOpenAlert}
        popupHandler={popupConfirmation}
        cosmeticName={currentName}
      />
    );
  })
);
