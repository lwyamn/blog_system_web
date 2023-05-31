import request from "../utils/request";

export function getAchievement(userId:string){
  return request({
    method:'GET',
    url:`BLOG/open/achievement/${userId}`
  })
}

export function getPersonal(userId:string){
  return request({
    method:'GET',
    url:`BLOG/open/personal/${userId}`
  })
}

export function searchAll(searchKey:string){
  return request({
    method:'GET',
    url:`BLOG/open/search/${searchKey}`
  })
}
