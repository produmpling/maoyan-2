// 由id数组获取对应的名称数组
export function getTreeVal(tree, valArr, label = 'areaName', key = 'id') {
  const nameArr = [];
  let list = [...tree];
  let item;
  for (let i = 0, len = valArr.length; i < len; i++) {
    item = list.find(r => r[key] === valArr[i]);
    nameArr.push(item[label]);
    list = item.children || [];
  }
  return nameArr;
}

/**
 * 查找父节点，按顺序组成数组
 * @param {String} targetKey 要到达的值
 * @param {String} key 字段标识
 * @param {Array} targetData 目标数据
 * @param {String} children 子级的字段
 * return 以字段标识值组成的数组，按照层级关系，如[111,222,333]
 */
export function fetchTreeById(targetKey, key, targetData, children = 'children') {
  const keyArray = [];
  let found = false;
  function loop(list) {
    for (let i = 0, length = list.length; i < length; i++) {
      keyArray.push(list[i][key]);
      if (list[i][key] === targetKey) {
        // 如果找到id了，则跳出当前循环
        found = true;
        break;
      } else {
        // 否则如果还有子级，则继续循环
        if (list[i][children] && list[i][children].length) {
          loop(list[i][children]);
          if (found) {
            break;
          }
        }
      }
      keyArray.pop();
    }
  }
  loop(targetData);
  return keyArray;
}

/**
 * 遍历树结构，搜索指定值
 * @param {String} key 搜索的字段
 * @param {String} keyword 搜索的值
 * @param {String} value 返回此字段的值
 * @param {Array} tree 树结构数据
 * @param {String} childrenKey 子级的字段名
 * return 返回查询到到值
 */
export function getValueFromTree(key, keyword, value, tree, childrenKey = 'children') {
  let result = '';
  function loop(list) {
    for (let i = 0, length = list.length; i < length; i++) {
      if (list[i][key] === keyword) {
        result = list[i][value];
        break;
      }
      if (list[i][childrenKey] && list[i][childrenKey].length) {
        loop(list[i][childrenKey]);
      }
    }
  }
  loop(tree);
  return result;
}

// 获取地址栏里的对象
export const getUrlObj = function getUrlObj() {
  // const searchStr = location.search ? location.search.substring(1) : '';
  const searchStr = location.href.split('?')[1];
  if (!searchStr) {
    return '';
  }

  const paramsArr = searchStr.split('&');
  const result = {};
  let par;
  paramsArr.forEach((item) => {
    par = item.split('=');
    result[par[0]] = decodeURIComponent(par[1]);
  });

  return result;
};

// 获取地址栏里的参数
export const getUrlParams = function getUrlParams(queryName) {
  return decodeURIComponent(getUrlObj()[queryName]);
};

// 过滤机构空间类型
export const filterSpaceType = (arr = [], spaceTypeList = []) => {
  if (spaceTypeList.length > 0) {
    spaceTypeList.forEach((item) => {
      if (item.childList && item.childList.length > 0) {
        filterSpaceType(arr, item.childList);
      } else {
        arr.push(item);
      }
    });
  }
};
