import { DeleteBlogReq, QueryBlogReq } from "../model/blogModel";
import request from "../utils/request";

export function queryBlog(data:any){
  return request({
    method:'POST',
    url:'/BLOG/blog/query',
    data:data,
  })
}
export function blogCollect(userId:any){
  return request({
    method:'GET',
    url:`/BLOG/blog/collect/${userId}`,
  })
}
export function blogAttention(data:QueryBlogReq){
  return request({
    method:'POST',
    url:`/BLOG/blog/attention`,
    data:data
  })
}

export function deleteBlog(data:DeleteBlogReq){
  return request({
    method:'POST',
    url:`/BLOG/blog/delete`,
    data:data
  })
}