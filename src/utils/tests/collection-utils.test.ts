import { lastElement } from '../collection-utils';

it('should return the last element which is 4', () => {
  expect(lastElement([1, 2, 3, 4])).toBe(4);
});

it('should return the last element which is `d`', () => {
  expect(lastElement(['a', 'b', 'c', 'd'])).toBe('d');
});
