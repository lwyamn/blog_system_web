import { FollowReq } from "../model/followModel";
import request from "../utils/request";

export function addFollow(data:FollowReq){
  return request({
    method:'POST',
    url:'BLOG/follow/add',
    data:data
  })
}

export function cancelFollow(data:FollowReq){
  return request({
    method:'POST',
    url:'BLOG/follow/cancel',
    data:data
  })
}

export function isFollow(data:FollowReq){
  return request({
    method:'POST',
    url:'BLOG/follow/isFollow',
    data:data
  })
}

export function followList(){
  return request({
    method:'GET',
    url:'BLOG/follow/list',
  })
}

export function fansList(){
  return request({
    method:'GET',
    url:'BLOG/follow/fansList',
  })
}
