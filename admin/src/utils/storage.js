// 获取item
export const getItem = name => decodeURIComponent(localStorage.getItem(name));

// 获取纯净item
export const getPureItem = name => localStorage.getItem(name);

// 设置item
export const setItem = (name, val = '') => localStorage.setItem(name, encodeURIComponent(val));

// 清除item
export const removeItem = name => localStorage.removeItem(name);

// 清除所有
export const removeItemAll = () => localStorage.clear();
