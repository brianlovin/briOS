export const getItemFromStorage = key => {
  if (!localStorage) return;

  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {}
};

export const storeItem = (key, value) => {
  if (!localStorage) return;

  try {
    return localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {}
};

export const removeItemFromStorage = key => {
  if (!localStorage) return;

  try {
    return localStorage.removeItem(key);
  } catch (err) {}
};
