export interface ViewCommentReq{
    id:string,
    userId:string,
    blogId:string,
    type:string,
    currentPage:number,
    pageSize:number,
}
export interface ViewCommentResp{
    id:string,
    userId:string,
    blogId:string,
    commentId:string,
    replyName:string,
    replyId:string,
    content:string,
    avatar:string,
    username:string,
    type:string,
    createTime:Date,
    updateTime:Date,
}
export interface UpdateCommentReq{
    id:string,
    content:string,
    avatar:string,
    username:string,
    type:string
}
export interface DeleteCommentReq{
    userId:string,
    blogId:string,
    type:string,
    idList:string[],
}
export interface AddCommentReq{
    userId:string,
    blogId:string,
    avatar:string,
    replyId?:string,
    replyName?:string,
    commentId?:string,
    username:string,
    content:string,
    type:string,
}