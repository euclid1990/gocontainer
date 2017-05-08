export default (uri, params = []) => {
  let i = 0;
  return String(uri).replace(/({[^}]+})/g, (match) => {
    if ((params instanceof Array) && (params.length > i)) {
      return params[i++];
    }
    return params;
  });
}
