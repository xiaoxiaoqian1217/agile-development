export interface Users {
  users: UserItem[];
}

export interface UserItem {
  id: number;
  roles: Role[];
  user: UserInfo;
}

export interface Role {
  id: number;
  name: string;
}
export interface UserInfo {
  id: number;
  name: string;
}
