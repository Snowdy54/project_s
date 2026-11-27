import React from 'react';

// Пиксельная корзина для удаления карты из избранного (сетка 10x10 из Figma)
export const PixelTrashIcon: React.FC = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="shrink-0"
  >
    <path
      d="M3 0H7V1H3ZM2 1H3V2H2ZM7 1H8V2H7ZM0 2H10V3H0ZM1 3H2V4H1ZM8 3H9V4H8ZM1 4H2V5H1ZM8 4H9V5H8ZM1 5H2V6H1ZM8 5H9V6H8ZM1 6H2V7H1ZM8 6H9V7H8ZM1 7H2V8H1ZM8 7H9V8H8ZM1 8H2V9H1ZM8 8H9V9H8ZM2 9H8V10H2Z"
      fill="currentColor"
    />
  </svg>
);

// Пиксельная стрелка '>' для перехода к карте (сетка 4x7 из Figma)
export const PixelCardChevronRightIcon: React.FC = () => (
  <svg
    width="8"
    height="14"
    viewBox="0 0 4 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="shrink-0"
  >
    <path
      d="M0 0H1V1H0ZM1 1H2V2H1ZM2 2H3V3H2ZM3 3H4V4H3ZM2 4H3V5H2ZM1 5H2V6H1ZM0 6H1V7H0Z"
      fill="currentColor"
    />
  </svg>
);

// Пиксельная иконка пользователя внутри пустой жёлтой аватарки (сетка 12x12 из Figma)
export const PixelEmptyAvatarUserIcon: React.FC<{ size?: number }> = ({ size = 50 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="shrink-0"
  >
    <path
      d="M4 1H8V2H4ZM3 2H4V3H3ZM8 2H9V3H8ZM3 3H4V4H3ZM8 3H9V4H8ZM3 4H4V5H3ZM8 4H9V5H8ZM4 5H8V6H4ZM4 7H8V8H4ZM3 8H4V9H3ZM8 8H9V9H8ZM2 9H3V10H2ZM9 9H10V10H9ZM2 10H3V11H2ZM9 10H10V11H9Z"
      fill="currentColor"
    />
  </svg>
);

// Пиксельная галочка подтверждения поля Email / Телефон (сетка 10x7)
export const PixelVerifiedCheckIcon: React.FC = () => (
  <svg
    width="15"
    height="11"
    viewBox="0 0 10 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="shrink-0"
  >
    <path
      d="M9 0H10V1H9ZM8 1H9V2H8ZM7 2H8V3H7ZM0 3H1V4H0ZM6 3H7V4H6ZM1 4H2V5H1ZM5 4H6V5H5ZM2 5H3V6H2ZM4 5H5V6H4ZM3 6H4V7H3Z"
      fill="currentColor"
    />
  </svg>
);

// Иконка Профиль (20x20)
export const PixelSidebarProfileIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect x="5" y="1.66663" width="10" height="1.66667" fill="currentColor" />
    <rect x="5" y="16.6666" width="10" height="1.66667" fill="currentColor" />
    <rect x="1.66675" y="5" width="1.66667" height="10" fill="currentColor" />
    <rect x="16.6667" y="5" width="1.66667" height="10" fill="currentColor" />
    <rect x="5" y="15" width="1.66667" height="1.66667" fill="currentColor" />
    <rect x="13.3333" y="15" width="1.66667" height="1.66667" fill="currentColor" />
    <rect x="15" y="3.33337" width="1.66667" height="1.66667" fill="currentColor" />
    <rect x="3.33325" y="3.33337" width="1.66667" height="1.66667" fill="currentColor" />
    <rect x="3.33325" y="15" width="1.66667" height="1.66667" fill="currentColor" />
    <rect x="15" y="15" width="1.66667" height="1.66667" fill="currentColor" />
    <rect x="6.66675" y="13.3334" width="6.66667" height="1.66667" fill="currentColor" />
    <rect x="8.33325" y="10" width="3.33333" height="1.66667" fill="currentColor" />
    <rect x="6.66675" y="6.66663" width="1.66667" height="3.33333" fill="currentColor" />
    <rect x="8.33325" y="5" width="3.33333" height="1.66667" fill="currentColor" />
    <rect x="11.6667" y="6.66663" width="1.66667" height="3.33333" fill="currentColor" />
  </svg>
);

// Иконка Активность (20x20)
export const PixelSidebarBoltIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M3.33301 10.833H10V15.833H11.667V17.5H10V19.167H8.33301V12.5H1.66699V9.16699H3.33301V10.833ZM13.333 15.833H11.667V14.167H13.333V15.833ZM15 14.167H13.333V12.5H15V14.167ZM16.667 12.5H15V10.833H16.667V12.5ZM11.667 7.5H18.333V10.833H16.667V9.16699H10V4.16699H8.33301V2.5H10V0.833008H11.667V7.5ZM5 9.16699H3.33301V7.5H5V9.16699ZM6.66699 7.5H5V5.83301H6.66699V7.5ZM8.33301 5.83301H6.66699V4.16699H8.33301V5.83301Z"
      fill="currentColor"
    />
  </svg>
);

// Иконка Достижения (20x20)
export const PixelSidebarTrophyIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect x="5" y="2.5" width="10" height="1.66667" fill="currentColor" />
    <rect x="5" y="2.5" width="1.66667" height="10" fill="currentColor" />
    <rect x="13.3335" y="2.5" width="1.66667" height="10" fill="currentColor" />
    <rect x="13.3335" y="4.16663" width="5" height="1.66667" fill="currentColor" />
    <rect x="1.66675" y="4.16663" width="5" height="1.66667" fill="currentColor" />
    <rect x="1.66675" y="5.83337" width="1.66667" height="3.33333" fill="currentColor" />
    <rect x="3.33325" y="9.16663" width="1.66667" height="1.66667" fill="currentColor" />
    <rect x="15" y="9.16663" width="1.66667" height="1.66667" fill="currentColor" />
    <rect x="16.6667" y="5.83337" width="1.66667" height="3.33333" fill="currentColor" />
    <rect x="6.66675" y="12.5" width="6.66667" height="1.66667" fill="currentColor" />
    <rect x="9.16675" y="14.1667" width="1.66667" height="3.33333" fill="currentColor" />
    <rect x="7.5" y="15.8333" width="5" height="1.66667" fill="currentColor" />
  </svg>
);

// Пиксельная стрелка вправо для пунктов меню (5x9)
export const PixelMenuChevronRight: React.FC = () => (
  <svg
    width="6"
    height="11"
    viewBox="0 0 5 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="shrink-0"
  >
    <path
      d="M0 0H1V1H0ZM1 1H2V2H1ZM2 2H3V3H2ZM3 3H4V4H3ZM4 4H5V5H4ZM3 5H4V6H3ZM2 6H3V7H2ZM1 7H2V8H1ZM0 8H1V9H0Z"
      fill="currentColor"
    />
  </svg>
);

// Иконка Выйти (16x16)
export const PixelLogoutIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect x="5.3335" y="7.33337" width="8" height="1.33333" fill="currentColor" />
    <rect x="10.6665" y="6" width="1.33333" height="1.33333" fill="currentColor" />
    <rect x="9.3335" y="4.66663" width="1.33333" height="6.66667" fill="currentColor" />
    <rect x="10.6665" y="8.66663" width="1.33333" height="1.33333" fill="currentColor" />
    <rect x="4" y="1.33337" width="8" height="1.33333" fill="currentColor" />
    <rect x="4" y="13.3334" width="8" height="1.33333" fill="currentColor" />
    <rect x="2.6665" y="2.66663" width="1.33333" height="10.6667" fill="currentColor" />
    <rect x="12" y="2.66663" width="1.33333" height="2" fill="currentColor" />
    <rect x="12" y="11.3334" width="1.33333" height="2" fill="currentColor" />
  </svg>
);

// Иконка GitHub (25x25)
export const PixelGitHubIcon: React.FC = () => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M19.6992 14.5156H17.626V16.5889H15.5527V18.6631H17.626V22.8105H7.25781V18.6631H3.11035V16.5889H1.03711V14.5156H3.11035V16.5889H7.25781V14.5156H5.18457V12.4414H3.11035V6.2207H5.18457V2.07324H9.33105V4.14746H15.5527V2.07324H19.6992V6.2207H21.7734V12.4414H19.6992V14.5156ZM7.25781 18.6631H9.33105V16.5889H7.25781V18.6631Z"
      fill="currentColor"
    />
  </svg>
);

// Иконка Telegram (25x25)
export const PixelTelegramIcon: React.FC = () => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M19.6992 3.11035H21.7734V5.18457H23.8467V19.6992H21.7734V21.7734H19.6992V23.8467H5.18457V21.7734H3.11035V19.6992H1.03711V5.18457H3.11035V3.11035H5.18457V1.03711H19.6992V3.11035ZM12.4414 7.25781H9.33105V9.33105H7.25781V11.4053H4.14746V13.4785H7.25781V17.626H9.33105V15.5527H11.4053V17.626H15.5527V19.6992H17.626V5.18457H12.4414V7.25781ZM15.5527 15.5527H11.4053V13.4785H13.4785V11.4053H9.33105V9.33105H13.4785V7.25781H15.5527V15.5527ZM9.33105 13.4785H7.25781V11.4053H9.33105V13.4785Z"
      fill="currentColor"
    />
  </svg>
);

// Иконка VK (30x30)
export const PixelVKIcon: React.FC = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path d="M11.7939 14.5155H9.97949V16.3299H11.7939V14.5155Z" fill="currentColor" />
    <path
      d="M15.4228 13.6083V10.8866H13.6084V16.3299H11.7939V18.1444H15.4228V15.4227H18.1445V13.6083H15.4228Z"
      fill="currentColor"
    />
    <path d="M19.959 10.8866H18.1445V13.6083H19.959V10.8866Z" fill="currentColor" />
    <path d="M19.959 15.4227H18.1445V18.1444H19.959V15.4227Z" fill="currentColor" />
    <path d="M9.97948 10.8866H8.16504V14.5155H9.97948V10.8866Z" fill="currentColor" />
    <path d="M19.9589 3.62891H9.07227V5.44334H19.9589V3.62891Z" fill="currentColor" />
    <path d="M25.4023 19.9588V9.07214H23.5879V19.9588H25.4023Z" fill="currentColor" />
    <path d="M19.959 7.25781H21.7734V5.44337H19.959V7.25781Z" fill="currentColor" />
    <path d="M21.7735 9.07214H23.5879V7.2577H21.7735V9.07214Z" fill="currentColor" />
    <path d="M19.959 23.5876H21.7734V21.7732H19.959V23.5876Z" fill="currentColor" />
    <path d="M21.7735 21.7733H23.5879V19.9589H21.7735V21.7733Z" fill="currentColor" />
    <path d="M9.07235 25.4021H19.959V23.5877H9.07235V25.4021Z" fill="currentColor" />
    <path
      d="M3.62891 9.07223L3.62891 19.9589H5.44334L5.44334 9.07223H3.62891Z"
      fill="currentColor"
    />
    <path d="M9.07225 21.7733H7.25781V23.5878H9.07225V21.7733Z" fill="currentColor" />
    <path d="M7.2578 19.9589H5.44336V21.7733H7.2578V19.9589Z" fill="currentColor" />
    <path d="M7.25781 5.44337V7.25781H9.07225V5.44337H7.25781Z" fill="currentColor" />
    <path d="M5.44336 7.2577V9.07214H7.2578V7.2577H5.44336Z" fill="currentColor" />
  </svg>
);

// Иконка Website (25x25)
export const PixelWebsiteIcon: React.FC = () => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect x="6.2207" y="2.07361" width="12.4419" height="2.07364" fill="currentColor" />
    <rect x="6.2207" y="20.7365" width="12.4419" height="2.07364" fill="currentColor" />
    <rect x="4.14746" y="4.14734" width="2.07364" height="2.07364" fill="currentColor" />
    <rect x="9.33154" y="4.14734" width="2.07364" height="2.07364" fill="currentColor" />
    <rect x="9.33154" y="18.6628" width="2.07364" height="2.07364" fill="currentColor" />
    <rect x="13.4785" y="18.6628" width="2.07364" height="2.07364" fill="currentColor" />
    <rect x="7.25781" y="6.22095" width="2.07364" height="12.4419" fill="currentColor" />
    <rect x="15.5522" y="6.22095" width="2.07364" height="12.4419" fill="currentColor" />
    <rect x="13.4785" y="4.14734" width="2.07364" height="2.07364" fill="currentColor" />
    <rect x="18.6627" y="4.14734" width="2.07364" height="2.07364" fill="currentColor" />
    <rect x="2.07373" y="6.22095" width="2.07364" height="12.4419" fill="currentColor" />
    <rect x="20.7364" y="6.22095" width="2.07364" height="12.4419" fill="currentColor" />
    <rect x="4.14746" y="18.6628" width="2.07364" height="2.07364" fill="currentColor" />
    <rect x="18.6627" y="18.6628" width="2.07364" height="2.07364" fill="currentColor" />
    <rect x="3.11035" y="11.405" width="18.6628" height="2.07364" fill="currentColor" />
  </svg>
);