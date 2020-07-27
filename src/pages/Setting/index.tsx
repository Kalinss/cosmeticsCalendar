import React from "react";
import { Content } from "../../components/Content/index";
import { Page } from "../../components/Page/index";
import { Header } from "../../components/Header/index";
import { Checkbox } from "semantic-ui-react";
import style from "./style.scss";
import { inject, observer } from "mobx-react";
import { settingComponentType } from "types";
import { toJS } from "mobx";
import { settingType } from "types";
import {toggleSettingField} from "../../utils/controlData";

export const Setting: React.FunctionComponent<settingComponentType> = inject(
  "stores"
)(
  observer(({ stores }) => {
    const settingItem = ({ name, value, key }: settingType) => {
      return (
        <li className={style.item} key={key}>
          <Checkbox
            label={name}
            name={name}
            value={key}
            checked={value}
            onClick={(e) => {
                toggleSettingField(key);
            }}
          />
        </li>
      );
    };

    return (
      <Page>
        <Header />
        <Content>
          <h2>Настройки:</h2>
          <ul className={style.list}>
            {stores!.Setting.config.map((item) => settingItem(item))}
          </ul>
        </Content>
      </Page>
    );
  })
);