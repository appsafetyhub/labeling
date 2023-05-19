/**
 * @jest-environment jsdom
 */
import { getDefaultFont } from '@appsafetyhub/common';
import '@testing-library/jest-dom';
import { act, render, waitFor } from '@testing-library/react';
import React from 'react';
import Preview from '../../src/components/Preview';
import { SELECTABLE_CLASSNAME } from '../../src/constants';
import { FontContext, I18nContext } from '../../src/contexts';
import { curriedI18n } from '../../src/i18n';
import { getSampleTemplate, setupUIMock } from '../assets/helper';

test('Preview(as Viewer) snapshot', async () => {
  setupUIMock();
  let container: HTMLElement = document.createElement('a');
  act(() => {
    const { container: c } = render(
      <I18nContext.Provider value={curriedI18n('en')}>
        <FontContext.Provider value={getDefaultFont()}>
          <Preview
            template={getSampleTemplate()}
            inputs={[{ field1: 'field1', field2: 'field2' }]}
            size={{ width: 1200, height: 1200 }}
          />
        </FontContext.Provider>
      </I18nContext.Provider>
    );
    container = c;
  });

  await waitFor(() => Boolean(container?.getElementsByClassName(SELECTABLE_CLASSNAME)));
  expect(container.firstChild).toMatchSnapshot();
});

test('Preview(as Form) snapshot', async () => {
  setupUIMock();
  let container: HTMLElement = document.createElement('a');
  act(() => {
    const { container: c } = render(
      <I18nContext.Provider value={curriedI18n('en')}>
        <FontContext.Provider value={getDefaultFont()}>
          <Preview
            template={getSampleTemplate()}
            inputs={[{ field1: 'field1', field2: 'field2' }]}
            size={{ width: 1200, height: 1200 }}
            onChangeInput={console.log}
          />
        </FontContext.Provider>
      </I18nContext.Provider>
    );
    container = c;
  });

  await waitFor(() => Boolean(container?.getElementsByClassName(SELECTABLE_CLASSNAME)));
  expect(container.firstChild).toMatchSnapshot();
});
