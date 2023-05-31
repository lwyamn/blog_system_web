//查询博客响应体
export interface QueryBlogResp {
  id: string;
  title: string;
  content: string;
  description: string;
  cover: string;
  author: string;
  userId: string;
  likeNumber: number;
  collectNumber:number;
  createTime: Date;
  updateTime: Date;
}
//博客首页
export interface HomeBlogResp {
  id: string;
  title: string;
  content: string;
  description: string;
  cover: string;
  author: string;
  userId: string;
  likeNumber: number;
  userAvatar: string;
}
//查询博客请求体
export interface QueryBlogReq {
  blogId?: string;
  title?: string;
  author?: string;
  userId?: string;
  currentPage: number;
  pageSize: number;
}
//删除博客请求体
export interface DeleteBlogReq {
  userId?: string;
  blogIdLists?: string[];
}
//更新博客请求体
export interface UpdateBlogReq {
  blogId: string;
  description: string;
  cover: string;
  title: string;
  content: string;
  author: string;
  likeNumber: number;
}
//添加博客请求体
export interface AddBlogReq{
  title:string,
  content:string,
  description:string,
  cover:string,
  author:string,
  userId:string,
}
