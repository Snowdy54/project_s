import React from 'react';

// Кнопка показать пароль (точная сетка 16x16 из Figma)
export const PasswordShowIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M10.667 13.333H5.33301V12H10.667V13.333ZM5.33301 12H2.66699V10.667H5.33301V12ZM13.333 12H10.667V10.667H13.333V12ZM2.66699 10.667H1.33301V9.33301H2.66699V10.667ZM9.33301 6.66699H8V8H9.33301V6.66699H10.667V9.33301H9.33301V10.667H6.66699V9.33301H5.33301V6.66699H6.66699V5.33301H9.33301V6.66699ZM14.667 10.667H13.333V9.33301H14.667V10.667ZM1.33301 9.33301H0V6.66699H1.33301V9.33301ZM16 9.33301H14.667V6.66699H16V9.33301ZM2.66699 6.66699H1.33301V5.33301H2.66699V6.66699ZM14.667 6.66699H13.333V5.33301H14.667V6.66699ZM5.33301 5.33301H2.66699V4H5.33301V5.33301ZM13.333 5.33301H10.667V4H13.333V5.33301ZM10.667 4H5.33301V2.66699H10.667V4Z"
      fill="#FDFCEA"
      fillOpacity="0.75"
    />
  </svg>
);

// Кнопка скрыть пароль (точная сетка 16x16 из Figma)
export const PasswordHideIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect y="6.66669" width="1.33333" height="2.66667" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="14.6667" y="6.66669" width="1.33333" height="2.66667" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="9.33366" y="6.66669" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="5.33366" y="6.66669" width="1.33333" height="2.66667" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="1.33301" y="5.33331" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="1.33301" y="9.33335" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="13.3337" y="5.33331" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="13.3337" y="9.33335" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="2.66699" y="4" width="2.66667" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="2.66699" y="10.6667" width="2.66667" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="10.6663" y="4" width="2.66667" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="6.66699" y="2.66669" width="4" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="5.33301" y="12" width="5.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="8" y="5.33331" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="6.66699" y="9.33331" width="2.66667" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="5.33301" y="5.33331" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="6.66699" y="6.66669" width="1.33333" height="2.66667" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="8" y="8" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="4" y="4" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="2.66699" y="2.66669" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="1.33301" y="1.33331" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="9.33301" y="9.33331" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="10.667" y="10.6667" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="12" y="12" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
    <rect x="13.333" y="13.3333" width="1.33333" height="1.33333" fill="#FDFCEA" fillOpacity="0.75" />
  </svg>
);

// Пиксельный силуэт GitHub 16x16 (наследует currentColor: #FFF886 -> #05131C при hover)
export const GitHubCat16Icon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M12.667 9.33301H11.333V10.667H10V12H11.333V14.667H4.66699V12H2V10.667H0.666992V9.33301H2V10.667H4.66699V9.33301H3.33301V8H2V4H3.33301V1.33301H6V2.66699H10V1.33301H12.667V4H14V8H12.667V9.33301ZM4.66699 12H6V10.667H4.66699V12Z"
      fill="currentColor"
    />
  </svg>
);