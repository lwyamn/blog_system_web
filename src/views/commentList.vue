<template>
    <div>
        <a-table :columns="columns" :dataSource="blogs" class="table" row-key="id" :pagination="pagination"
            @change="changeTable" :row-selection="{ selectedRowKeys: ids, onChange: addDeleteIds }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'operation'">
                    <div class="row-operations">
                        <span>
                            <a-popconfirm :title="ids.length ? '确定要删除选择的所有评论吗?' : '确认要删除选中的评论吗?'" ok-text="确定"
                                cancel-text="取消" @confirm="deleteById(record.id)">
                                <a>删除</a>
                            </a-popconfirm>
                        </span>
                    </div>
                </template>
                <template v-if="column.dataIndex === 'type'">
                    <a-tag :color="verifyCommentType(record.type).color">{{
                        verifyCommentType(record.type).commentType
                    }}</a-tag>
                </template>
            </template>
            <template #title>
                评论列表
                <a-input-search placeholder="输入搜索内容" enter-button class="search"
                    v-model:value="searchCommentData.searchContent" style="width: 350px;" @search="searchBlogs">
                    <template #addonBefore>
                        <a-select style="width: 100px;" v-model:value="searchCommentData.searchType">
                            <a-select-option value="id">评论ID</a-select-option>
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
import { PageDTO } from "../model/frontModel";
import { useResult } from "../model/frontModel";
import { useRequest } from "vue-request";
import { PaginationProps } from "ant-design-vue";
import request from "../utils/request";
import { DeleteCommentReq, ViewCommentReq, ViewCommentResp } from "../model/commentModel";
import { verifyCommentType } from "../utils/verify";

const searchCommentData = ref({
    searchType: 'id',
    searchContent: '',
});
const viewCommentReq = ref<ViewCommentReq>({
    id: '',
    userId: '',
    blogId: '',
    type: '',
    currentPage: 1,
    pageSize: 6,
});
const { data, run: search } = useRequest<useResult<PageDTO<ViewCommentResp>>>(() =>
    request.post("/BLOG/comment/view", viewCommentReq.value)
);
const pagination = computed<PaginationProps>(() => {
    return {
        current: viewCommentReq.value.currentPage, // 当前页
        pageSize: viewCommentReq.value.pageSize, // 页大小
        total: data.value?.data.data.total,
        showSizeChanger: true, // 显示页大小的下拉列表
        pageSizeOptions: ["4", "6", "8", "10"], // 总记录数
    };
});
const changeTable = (pagination: PaginationProps) => {
    viewCommentReq.value.currentPage = pagination.current ?? 1;
    viewCommentReq.value.pageSize = pagination.pageSize ?? 5;
    search(viewCommentReq.value);
};
const blogs = computed(() => {
    return data.value?.data.data.dataVO || [];
});
//删除评论
const deleteCommentReq = ref<DeleteCommentReq>({
    userId: '',
    blogId: '',
    type: '',
    idList: [],
});
const ids = ref<string[]>([])
const { runAsync: deleteBlog } = useRequest<useResult<string>>(
    () => request.post("/BLOG/comment/delete", deleteCommentReq.value),
    {
        manual: true,
    }
);
const addDeleteIds = (keys: string[]) => {
    ids.value = keys
}
const deleteById = async (id: string) => {
    if (!ids.value.length) {
        deleteCommentReq.value.idList.push(id);
    } else {
        deleteCommentReq.value.idList = ids.value
    }
    await deleteBlog();
    search();
    deleteCommentReq.value.idList = [];
};

//搜索评论
const searchBlogs = () => {
    const query = ref<ViewCommentReq>({
        id: '',
        userId: '',
        blogId: '',
        type: '',
        currentPage: 1,
        pageSize: viewCommentReq.value.pageSize,
    });
    switch (searchCommentData.value.searchType) {
        case 'id': query.value.id = searchCommentData.value.searchContent; break;
        case 'userId': query.value.userId = searchCommentData.value.searchContent; break;
        case 'blogId': query.value.blogId = searchCommentData.value.searchContent; break;
        default: break;
    }
    viewCommentReq.value = query.value;
    search()
}




const columns = [
    {
        title: "评论ID",
        dataIndex: "id",
        ellipsis: true,
    },
    {
        title: "用户ID",
        dataIndex: "userId",
        ellipsis: true,
    },
    {
        title: "评论者",
        dataIndex: "username",
        ellipsis: true,
    },
    {
        title: "回复评论",
        dataIndex: "commentId",
        ellipsis: true,
    },
    {
        title: "博客ID",
        dataIndex: "blogId",
        ellipsis: true,
    },
    {
        title: "类型",
        dataIndex: "type",
    },
    {
        title: "评论内容",
        dataIndex: "content",
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