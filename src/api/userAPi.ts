import request from "../utils/request";
import { QueryUserReq, UpdateUserReq } from "../model/userModel";
export function getUserById(id: any) {
    return request({
        method: 'GET',
        url: `/BLOG/user/get/${id}`,
    })
}

export function queryUser(queryUserReq: QueryUserReq) {
    return request({
        method: 'POST',
        url: '/BLOG/user/query',
        data: {
            id: queryUserReq.id,
            username: queryUserReq.username,
            userTypes: queryUserReq.userTypes,
            email: queryUserReq.email,
            phone: queryUserReq.phone,
            currentPage: queryUserReq.currentPage ? queryUserReq.currentPage : 1,
            pageSize: queryUserReq.pageSize ? queryUserReq.pageSize : 10,
        }
    })
}
export function updateUser(updateUserReq: UpdateUserReq) {
    return request({
        method: 'POST',
        url: 'BLOG/user/update',
        data: updateUserReq
    })
}