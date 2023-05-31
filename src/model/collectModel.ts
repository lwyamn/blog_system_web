export interface CollectResp{
    blogId:string,
    collectNumber:number,
    isCollect:boolean,
}
export interface CollectReq{
    userId:string,
    blogId:string,
    author:string,
    blogIds:string[],
}