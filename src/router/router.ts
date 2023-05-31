import {
  createRouter,
  createWebHistory,
} from "vue-router";
import { useStorage } from "@vueuse/core";
import { message } from "ant-design-vue";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: () => import("../views/login.vue"),
    name: "登录",
  },
  {
    path: "/main",
    component: () => import("../views/main.vue"),
    name: "博客系统",
    redirect: "/main/home",
    children: [
      {
        path: "blog/:blogId",
        name: '博客',
        props:true,
        key: (to: { parms: { blogId: any; }; })=>to.parms.blogId,
        component: () => import("../views/viewBlog.vue")
      },
      {
        path: "write",
        name: '编写博客',
        component: () => import("../views/writeBlog.vue")
      },
      {
        path: "userHome/:userId",
        props:true,
        key: (to: { parms: { userId: any; }; })=>to.parms.userId,
        component: () => import("../views/userHome.vue"),
        name: "个人首页",
      },
      {
        path: "home",
        component: () => import("../views/home.vue"),
        name: "首页",
        children: [
          {
            path: "recommend",
            component: () => import("../views/recommend.vue"),
            name: "推荐",
          },
          {
            path: "attention",
            component: () => import("../views/attention.vue"),
            name: "关注",
          }
        ]
      },
      {
        path: "message",
        component: () => import("../views/message.vue"),
        name: "私信",
        children: [
          {
            path: ":userId",
            component: () => import("../views/message.vue"),
            name:"私聊"
          }
        ]
      },
      {
        path: "userCenter",
        component: () => import("../views/userCenter.vue"),
        name: "个人中心",
        redirect: "/main/userCenter/userInfo",
        children: [
          {
            path: "userInfo",
            component: () => import("../views/userInfo.vue"),
            name: "个人资料",
          },
          {
            path: "accountSettings",
            component: () => import("../views/accountSettings.vue"),
            name: "账号设置",
          },
          {
            path: "accountSettings/password",
            component: () => import("../views/password.vue"),
            name: "设置密码",
          }
        ]
      },
    ]
  },
  {
    path: "/back",
    component: () => import("../views/back.vue"),
    redirect: "/back/userList",
    name: "后台",
    children: [
      {
        path: "userList",
        component: () => import("../views/userList.vue"),
        name: "用户列表",
      },
      {
        path: "addUser",
        component: () => import("../views/addUser.vue"),
        name: "添加用户",
      },
      {
        path: "blogList",
        component: () => import("../views/blogList.vue"),
        name: "博客列表",
      },
      {
        path: "commentList",
        component: () => import("../views/commentList.vue"),
        name: "评论列表",
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
export const token = useStorage<string>('token', null);
export const userId = useStorage<string>('userId', null);
router.beforeEach(async (to, from, next) => {
  if (to.path === '/login' || to.path === '/') {
    next();
  }

  else {
    if (token.value) {
      next();
    } else {
      message.error("未登录")
      next('/login');
    }
  }
})

router.afterEach((to, from) => {
  document.title = to.name?.toString() || "博客系统";
});

export default router;
