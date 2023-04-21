import { FilterTypeField } from '@/types';

export const filterOptionConfig = {
  type: {
    value: undefined,
    field: FilterTypeField.priority_id,
  },
  flag: {
    value: 1,
  },
  orAndFlag: {
    value: 'and',
  },
  id: Date.now(),
};
