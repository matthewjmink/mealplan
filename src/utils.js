/* eslint-disable import/prefer-default-export */

export const excludeId = function stripIdParamFromObject(obj) {
  const { id, ...newObj } = obj;
  return newObj;
};
