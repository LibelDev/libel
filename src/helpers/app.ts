export const isMainApp = () => {
  return (
    !isLoginPage()
    && !isEditProfilePage()
    && !isNoticePage()
    && !isStickersPage()
  );
};

export const isLoginPage = () => {
  const { pathname } = window.location;
  return pathname === '/login';
};

export const isEditProfilePage = () => {
  const { pathname } = window.location;
  return pathname === '/me/profile/edit';
};

export const isNoticePage = () => {
  const { pathname } = window.location;
  return pathname === '/notice';
};

export const isStickersPage = () => {
  const { pathname } = window.location;
  return pathname === '/stickers';
};
