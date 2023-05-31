export interface MessageReq{
    userId?:string,
    chatUserId:string,
    content:string,
}

export interface QueryChatMessageReq{
    userId?:string,
    chatUserId?:string,
    type?:string,
}

export interface QueryChatMessageResp{
    id:string,
    userId:string,
    chatUserId:string,
    content:string,
    type:string,
    createTime:Date,
    updateTime:Date,
}