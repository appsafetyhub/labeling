import { PreviewProps } from '@appsafetyhub/common';
import React from 'react';
import ReactDOM from 'react-dom';
import { PreviewUI } from './class';
import Preview from './components/Preview';
import { DESTROYED_ERR_MSG } from './constants';
import { FontContext, I18nContext } from './contexts';

class Viewer extends PreviewUI {
  constructor(props: PreviewProps) {
    super(props);
    this.render();
  }

  protected render() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    ReactDOM.render(
      <I18nContext.Provider value={this.getI18n()}>
        <FontContext.Provider value={this.getFont()}>
          <Preview template={this.template} size={this.size} inputs={this.inputs} />
        </FontContext.Provider>
      </I18nContext.Provider>,
      this.domContainer
    );
  }
}

export default Viewer;
