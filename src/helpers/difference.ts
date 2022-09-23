export const difference = (obj1: any, obj2: any) => {
  let keyFound = false;
  const result = [];
  Object.keys(obj1).forEach(key => {
    if (obj1[key] !== obj2[key]) {
      return result.push(key);
    }
  });
  return result;
};
