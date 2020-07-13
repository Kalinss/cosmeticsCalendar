import { observable, action, computed } from "mobx";
type field = { value: string | number; error: string; text?: string };
import {
  CosmeticItemConstructor,
  CosmeticItemsModel,
} from "./../utils/database/cosmeticItemsModel";
type setStateCreateItemType = {
  field: string;
  value?: string | number;
  error?: string;
  text?: string;
};

export type itemCosmeticType = {
  name: string;
  description?: string;
  timingDelay: {
    value: number;
    text: string;
  }; // 0 to N day
  dayOrEvening: {
    value: number;
    text: string;
  }; // 0 - all, 1 - day 2 - evening
  type?: {
    value: number;
    text: string;
  }; // priority item for filter
};

export const itemsCosmeticInitialState = {
  name: {
    value: "",
    error: "",
    text: "",
  },
  description: {
    value: "",
    error: "",
    text: "",
  },
  timingDelay: {
    value: 2,
    error: "",
    text: "2 дня",
  },
  dayOrEvening: {
    value: 1,
    error: "",
    text: "День и вечер",
  },
  type: {
    value: 1,
    error: "",
    text: "Средство для снятия макияжа",
  },
} as { [key: string]: field };

export class ItemsCosmetic {
  @observable items: itemCosmeticType[] = [];

  @observable itemCreate = {
    ...itemsCosmeticInitialState,
  } as { [key: string]: field };

  @observable itemEdit: itemCosmeticType | undefined = {
    name: "",
    description: "",
    timingDelay: {
      value: 0,
      text: "",
    },
    dayOrEvening: {
      value: 0,
      text: "",
    },
    type: {
      value: 0,
      text: "",
    },
  };

  @action getAll(): itemCosmeticType[] {
    return [...this.items];
  }

  @action setCreateItem = (props: setStateCreateItemType) => {
    this.itemCreate[props.field] = {
      error: props.error || itemsCosmeticInitialState[props.field].error,
      value: props.value || itemsCosmeticInitialState[props.field].value,
      text: props.text || itemsCosmeticInitialState[props.field].text,
    };
  };
  @action findItemEdit(key: string) {
    const find = this.items.find((item) => item.name === key) as itemCosmeticType;
    console.log(find);
    this.itemEdit = find ? {...find} : undefined;
  };

  @action getLastItem() {
    return this.items[this.items.length - 1];
  }
  @action loadAllItems = () => {
    return new Promise((resolve, reject) => {
      CosmeticItemsModel.getAll()
        .then((data) => {
          this.items = [...data];
          resolve(true);
        })
        .catch((err) => reject(err));
    });
  };
  @action deleteItem = (key: string) => {
    this.items = this.items.filter((item) => item.name !== key);
  };
  @action saveItem = () => {
    this.items.push({
      name: ("" + this.itemCreate.name.value).trim(),
      description: "" + this.itemCreate.description.value,
      timingDelay: {
        value: +this.itemCreate.timingDelay.value,
        text: "" + this.itemCreate.timingDelay.text,
      },
      dayOrEvening: {
        value: +this.itemCreate.dayOrEvening.value,
        text: "" + this.itemCreate.dayOrEvening.text,
      },
      type: {
        value: +this.itemCreate.type.value,
        text: "" + this.itemCreate.type.text,
      },
    });
  };
  @action clearCreateItem = () => {
    this.itemCreate = { ...itemsCosmeticInitialState };
  };
}
