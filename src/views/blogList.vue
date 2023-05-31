<template>
  <div>
    <a-table :columns="columns" :dataSource="blogs" class="table" row-key="id" :pagination="pagination"
      @change="changeTable" :row-selection="{ selectedRowKeys: ids, onChange: addDeleteIds }" :scroll="{ x: 1300 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <div class="row-operations">
            <span>
              <a-popconfirm :title="ids.length ? '确定要删除选择的所有博客吗?' : '确认要删除选中的博客吗?'" ok-text="确定" cancel-text="取消"
                @confirm="deleteById(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </template>
      <template #title>
        博客列表
        <a-input-search placeholder="输入搜索内容" enter-button class="search" v-model:value="searchBlogData.searchContent"
          style="width: 350px;" @search="searchBlogs">
          <template #addonBefore>
            <a-select style="width: 100px;" v-model:value="searchBlogData.searchType">
              <a-select-option value="title">标题</a-select-option>
              <a-select-option value="author">作者</a-select-option>
              <a-select-option value="userId">用户ID</a-select-option>
              <a-select-option value="blogId">博客ID</a-select-option>
            </a-select>
          </template>
        </a-input-search>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { QueryBlogResp, QueryBlogReq, DeleteBlogReq, UpdateBlogReq } from "../model/blogModel"
import { PageDTO } from "../model/frontModel";
import { useResult } from "../model/frontModel";
import { useRequest } from "vue-request";
import { PaginationProps } from "ant-design-vue";
import request from "../utils/request";
//用户类型
const searchBlogData = ref({
  searchType: 'title',
  searchContent: '',
});
const queryBlogReq = ref<QueryBlogReq>({
  blogId: '',
  title: '',
  author: '',
  userId: '',
  currentPage: 1,
  pageSize: 6,
});
const { data, run: search } = useRequest<useResult<PageDTO<QueryBlogResp>>>(() =>
  request.post("/BLOG/blog/query", queryBlogReq.value)
);
const pagination = computed<PaginationProps>(() => {
  return {
    current: queryBlogReq.value.currentPage, // 当前页
    pageSize: queryBlogReq.value.pageSize, // 页大小
    total: data.value?.data.data.total,
    showSizeChanger: true, // 显示页大小的下拉列表
    pageSizeOptions: ["4", "6", "8", "10"], // 总记录数
  };
});
const changeTable = (pagination: PaginationProps) => {
  queryBlogReq.value.currentPage = pagination.current ?? 1;
  queryBlogReq.value.pageSize = pagination.pageSize ?? 5;
  search(queryBlogReq.value);
};
const blogs = computed(() => {
  return data.value?.data.data.dataVO || [];
});
//删除博客
const deleteBlogReq = ref<DeleteBlogReq>({
  userId: '',
  blogIdLists: [],
});
const ids = ref<string[]>([])
const { runAsync: deleteBlog } = useRequest<useResult<string>>(
  () => request.post("/BLOG/blog/delete", deleteBlogReq.value),
  {
    manual: true,
  }
);
const addDeleteIds = (keys: string[]) => {
  ids.value = keys
}
const deleteById = async (id: string) => {
  if (!ids.value.length) {
    deleteBlogReq.value.blogIdLists?.push(id);
  } else {
    deleteBlogReq.value.blogIdLists = ids.value
  }
  await deleteBlog();
  search();
  deleteBlogReq.value.blogIdLists = [];
};
//搜索用户
const searchBlogs = () => {
  const query = ref<QueryBlogReq>({
    blogId: '',
    title: '',
    author: '',
    userId: '',
    currentPage: 1,
    pageSize: queryBlogReq.value.pageSize,
  });
  switch (searchBlogData.value.searchType) {
    case 'title': query.value.title = searchBlogData.value.searchContent; break;
    case 'author': query.value.author = searchBlogData.value.searchContent; break;
    case 'userId': query.value.userId = searchBlogData.value.searchContent; break;
    case 'blogId': query.value.blogId = searchBlogData.value.searchContent; break;
    default: break;
  }
  queryBlogReq.value = query.value;
  search()
}




const columns = [
  {
    title: "博客ID",
    dataIndex: "id",
    fixed: "left",
    ellipsis: true,
  },
  {
    title: "标题",
    dataIndex: "title",
    fixed: "left",
    ellipsis: true,
  },
  {
    title: "作者",
    dataIndex: "author",
  },
  {
    title: "作者ID",
    dataIndex: "userId",
    ellipsis: true,
  },
  {
    title: "点赞数",
    dataIndex: "likeNumber",
  },
  {
    title: "收藏数",
    dataIndex: "collectNumber",
  },
  {
    title:"描述",
    dataIndex:"description",
    ellipsis:true,
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
<style scoped>
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