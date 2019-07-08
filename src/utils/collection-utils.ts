export interface Collection<T> {
  length: number;
  [key: number]: T;
}

export const lastElement = <T>(collection: Collection<T>): T => {
  return collection[collection.length - 1];
};
