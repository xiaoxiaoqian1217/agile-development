import { TaskItem } from '../../types/task';
export type FilterOptionConfig = {
  type: {
    value: undefined | Array<any> | string;
    field: keyof TaskItem;
  };
  flag: {
    value: number;
  };
  orAndFlag: {
    value: string;
  };
  id: number;
};
