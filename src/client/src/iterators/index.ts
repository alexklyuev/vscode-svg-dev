import { MakeIterator, FindIterator } from '@common/iterators';

const map = new Map();

export const makeIterator = MakeIterator(map);
export const findIterator = FindIterator(map);
