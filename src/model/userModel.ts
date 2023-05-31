export interface QueryUserReq {
  id?: string;
  username?: string;
  userTypes?: number[];
  email?: string;
  phone?:string;
  currentPage?: number;
  pageSize?: number;
}
export interface QueryUserResp {
  id: string;
  avatar:string;
  email:string;
  username: string;
  userType: number;
  phone:string;
  personalProfile:string;
  createTime: Date;
  updateTime: Date;
}
export interface AddUserResp {
  username: string;
  password: string;
  email: string;
  phone:string;
  userType:number;
}
export interface UpdateUserReq{
  id:string ;
  username?:string ;
  email?:string ;
  userType?:number;
  avatar?:string;
  phone?:string;
  personalProfile?:string;
}
export interface DeleteUserResp {
  userLists: string[];
}
