import { QueryUserResp } from "./userModel"

export interface FollowReq{
  userId?: string,
  followUserId?: string
}
export interface FollowResp{
  userList:Array<QueryUserResp>,
  followIdList:Set<string>
}