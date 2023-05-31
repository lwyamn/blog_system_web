export interface LikeResp{
    blogId:string;
    likeNumber:number;
    isLike:boolean;
}
export interface LikeReq{
    author:string,
    blogId:string;
    userId:string;
    blogIds:string[];
}