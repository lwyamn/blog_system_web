export interface LoginReq{
    username:string,
    password:string,
    type:string,
}
export interface LoginResp{
    token:string,
}
export interface SignUpReq{
    username:string,
    password:string,
    email:string,
    phone:string,
}
export interface useResult<T>{
    data:{
        data:T,
        code:number,
        msg?:string,
    }
}
export interface Result<T>{
    data:T,
    code:number,
    msg?:string,
}
export interface PageDTO<T> {
  dataVO: Array<T>;
  total: number;
}