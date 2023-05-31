<template>
  <div>
    <a-table :columns="columns" :dataSource="users" class="table" row-key="id" :pagination="pagination"
      @change="changeTable" :row-selection="{ selectedRowKeys: ids, onChange: addDeleteIds }" :scroll="{ x: 1300 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <div class="row-operations">
            <span v-if="editableData[record.id]">
              <a-typography-link @click="save(record.id)">保存</a-typography-link>
              <a-popconfirm title="确定取消保存?" ok-text="确定" cancel-text="取消" @confirm="cancel(record.id)">
                <a>取消</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a-popconfirm :title="ids.length ? '确定要删除选择的所有用户嘛' : '确认要删除选中的用户吗?'" ok-text="确定" cancel-text="取消"
                @confirm="deleteById(record.id)">
                <a>删除</a>
              </a-popconfirm>
              <a
                @click="change(record.id, record.userType, record.username, record.email, record.personalProfile, record.phone)">修改</a>
            </span>
          </div>
        </template>
        <template v-else>
          <template v-if="editableData[record.id]">
            <a-input allowClear="true" v-if="['username', 'email', 'phone', 'personalProfile'].includes(column.dataIndex)"
              v-model:value="editableData[record.id][column.dataIndex]" />
            <a-select v-else-if="['userType'].includes(column.dataIndex)"
              v-model:value="editableData[record.id][column.dataIndex]" placeholder="用户类型" :options="useroptions" />
          </template>
          <template v-else>
            <template v-if="column.dataIndex === 'userType'">
              <a-tag :color="verifyUserType(record.userType).color">{{
                verifyUserType(record.userType).userType
              }}</a-tag>
            </template>
          </template>
        </template>
      </template>
      <template #title>
        <a-checkbox-group class="check" :options="useroptions" v-model:value="queryUserReq.userTypes"
          @change="searchByUserType" />
        用户列表
        <a-input-search placeholder="输入搜索内容" enter-button class="search" v-model:value="searchUserData.searchContent"
          style="width: 350px;" @search="searchUsers">
          <template #addonBefore>
            <a-select style="width: 100px;" v-model:value="searchUserData.searchType">
              <a-select-option value="username">用户名</a-select-option>
              <a-select-option value="email">邮箱</a-select-option>
              <a-select-option value="id">ID</a-select-option>
              <a-select-option value="phone">手机号</a-select-option>
            </a-select>
          </template>
        </a-input-search>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { UnwrapRef } from "vue";
import {
  QueryUserResp,
  QueryUserReq,
  DeleteUserResp,
  UpdateUserReq,
} from "../model/userModel";
import { PageDTO } from "../model/frontModel";
import { useResult } from "../model/frontModel";
import { useRequest } from "vue-request";
import { PaginationProps } from "ant-design-vue";
import request from "../utils/request";
import { verifyUserType } from "../utils/verify";
import { cloneDeep } from "lodash-es";
//用户类型
const useroptions = ref([
  { value: 1, label: "管理员" },
  { value: 2, label: "普通用户" },
]);
const searchUserData = ref({
  searchType: 'id',
  searchContent: '',
});
const queryUserReq = ref<QueryUserReq>({
  id: "",
  username: "",
  userTypes: [],
  email: "",
  phone: "",
  currentPage: 1,
  pageSize: 6,
});
const deleteUserResp = ref<DeleteUserResp>({
  userLists: [],
});
const { data, run: search } = useRequest<useResult<PageDTO<QueryUserResp>>>(() =>
  request.post("/BLOG/user/query", queryUserReq.value)
);
const pagination = computed<PaginationProps>(() => {
  return {
    current: queryUserReq.value.currentPage, // 当前页
    pageSize: queryUserReq.value.pageSize, // 页大小
    total: data.value?.data.data.total,
    showSizeChanger: true, // 显示页大小的下拉列表
    pageSizeOptions: ["4", "6", "8", "10"], // 总记录数
  };
});
const changeTable = (pagination: PaginationProps) => {
  queryUserReq.value.currentPage = pagination.current ?? 1;
  queryUserReq.value.pageSize = pagination.pageSize ?? 5;
  search();
};
const users = computed(() => {
  return data.value?.data.data.dataVO || [];
});
//删除用户
const ids = ref<string[]>([])
const { runAsync: deleteUser } = useRequest<useResult<string>>(
  () => request.post("/BLOG/user/delete", deleteUserResp.value),
  {
    manual: true,
  }
);
const addDeleteIds = (keys: string[]) => {
  ids.value = keys
}
const deleteById = async (id: string) => {
  if (!ids.value.length) {
    deleteUserResp.value.userLists.push(id);
  } else {
    deleteUserResp.value.userLists = ids.value
  }
  await deleteUser();
  search();
  deleteUserResp.value.userLists = [];
};
//修改用户
const updateData: UpdateUserReq[] = [];
const editableData: UnwrapRef<Record<string, UpdateUserReq>> = reactive({});
const change = (
  id: string,
  userType: number,
  username: string,
  email: string,
  personalProfile: string,
  phone: string,
) => {
  updateData.push({
    username: username,
    userType: userType,
    id: id,
    phone: phone,
    personalProfile: personalProfile,
    email: email,
  });
  editableData[id] = cloneDeep(updateData.filter((item) => id === item.id)[0]);
};
const cancel = (id: string) => {
  delete editableData[id];
};
const save = async (id: string) => {
  await updateUser(editableData[id]);
  search(queryUserReq);
  delete editableData[id];
};
const { runAsync: updateUser } = useRequest<useResult<string>>(
  (user: UpdateUserReq) => request.post("/BLOG/user/update", user),
  {
    manual: true,
  }
);
//搜索用户
const searchUsers = () => {
  const query = ref<QueryUserReq>({
    id: "",
    username: "",
    userTypes: queryUserReq.value.userTypes,
    email: "",
    phone: "",
    currentPage: 1,
    pageSize: queryUserReq.value.pageSize,
  });

  switch (searchUserData.value.searchType) {
    case 'email': query.value.email = searchUserData.value.searchContent; break;
    case 'username': query.value.username = searchUserData.value.searchContent; break;
    case 'id': query.value.id = searchUserData.value.searchContent; break;
    case 'phone': query.value.phone = searchUserData.value.searchContent; break;
    default: break;
  }
  queryUserReq.value = query.value
  search()
}
const searchByUserType = () => {
  queryUserReq.value.currentPage = 1
  search()
}
const columns = [
  {
    title: "用户ID",
    dataIndex: "id",
    ellipsis: true,
    fixed: "left",
  },
  {
    title: "用户名",
    dataIndex: "username",
    fixed: "left"
  },
  {
    title: "用户类型",
    dataIndex: "userType",
  },
  {
    title: "邮箱",
    dataIndex: "email",
    ellipsis: true,
  },
  {
    title: "手机号",
    dataIndex: "phone",
    ellipsis: true,
  },
  {
    title: "个人简介",
    dataIndex: "personalProfile",
    ellipsis: true,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    ellipsis: true,
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    ellipsis: true,
  },
  {
    title: "操作",
    dataIndex: "operation",
    fixed: "right"
  },
];
</script>
<style scoped lang="less">
.search {
  right: 0;
  width: 200px;
  position: absolute;
}

.check {
  left: 0;
  position: absolute;
}

.row-operations a {
  margin-right: 8px;
}

.table {
  position: relative;
  padding-right: 50px;
  padding-left: 50px;
}
</style>
  