import { defineStore } from "pinia";
import { Result } from "../model/frontModel";
import { QueryUserResp } from "../model/userModel";
import request from "../utils/request";
import { userId } from "../router/router";

export const useUserInfo = defineStore("userInfo", {
  state: () => {
    return {
      username: "",
      email: "",
      userType: 1,
      id: "",
      avatar: "",
      phone:"",
      personalProfile:"",
      createTime: undefined,
      updateTime: undefined,
    };
  },
  actions: {
    async get() {
      const resp = await request.get<Result<QueryUserResp>>("/BLOG/user/getUser");
      userId.value = resp.data.data.id
      Object.assign(this, resp.data.data);
    },
    async update(dto: any) {
      await request.post("/BLOG/user/update", dto);
      Object.assign(this, dto);
    },
  },
});
