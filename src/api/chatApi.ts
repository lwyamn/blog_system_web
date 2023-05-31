import { MessageReq, QueryChatMessageReq } from "../model/chatModel";
import request from "../utils/request";

export function send(messageReq:MessageReq){
    return request({
        method:'POST',
        url:'BLOG/mongo/chat/send',
        data:messageReq
    })
}

export function get(queryChatMessageReq:QueryChatMessageReq){
    return request({
        method:'POST',
        url:'BLOG/mongo/chat/get',
        data:queryChatMessageReq
    })
}
export function getChatList() {
  return request({
    method:'GET',
    url:'BLOG/mongo/chat/getChatList',
  });
}
export function addChatList(chatUserId:string) {
  return request({
    method:'POST',
    url:'BLOG/mongo/chat/addChatList',
    data:{
      chatUserId:chatUserId
    }
  })
}