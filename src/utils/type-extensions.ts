interface ObjectConstructor {
  values<T>(o: { [p: string]: T }): T[];
}

Object.values = <T>(o: { [p: string]: T }): T[] => {
  return Object.keys(o).map(key => o[key]);
};
