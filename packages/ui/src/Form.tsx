import { PreviewProps } from '@appsafetyhub/common';
import React from 'react';
import ReactDOM from 'react-dom';
import { PreviewUI } from './class';
import Preview from './components/Preview';
import { DESTROYED_ERR_MSG } from './constants';
import { FontContext, I18nContext } from './contexts';

class Form extends PreviewUI {
  private onChangeInputCallback?: (arg: { index: number; value: string; key: string }) => void;

  constructor(props: PreviewProps) {
    super(props);
    this.render();
  }

  public onChangeInput(cb: (arg: { index: number; value: string; key: string }) => void) {
    this.onChangeInputCallback = cb;
  }

  protected render() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    ReactDOM.render(
      <I18nContext.Provider value={this.getI18n()}>
        <FontContext.Provider value={this.getFont()}>
          <Preview
            template={this.template}
            size={this.size}
            inputs={this.inputs}
            onChangeInput={(arg: { index: number; value: string; key: string }) => {
              const { index, value, key } = arg;
              if (this.onChangeInputCallback) {
                this.onChangeInputCallback({ index, value, key });
              }
              this.inputs[index][key] = value;
              this.render();
            }}
          />
        </FontContext.Provider>
      </I18nContext.Provider>,
      this.domContainer
    );
  }
}

export default Form;
