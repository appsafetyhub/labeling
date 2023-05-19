import { getDefaultFont } from '@appsafetyhub/common';
import { createContext } from 'react';
import { DEFAULT_LANG } from './constants';
import { curriedI18n } from './i18n';

export const I18nContext = createContext(curriedI18n(DEFAULT_LANG));

export const FontContext = createContext(getDefaultFont());
