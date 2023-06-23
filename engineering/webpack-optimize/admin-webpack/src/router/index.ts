import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/layouts/default.vue'
const router = createRouter({
    history: createWebHistory(

    ),
    routes: [
        { path: '/login', component: () => import('@/pages/login.vue') },
        {
            path: '/', component: Dashboard,
            children: [
                {
                    path: '',
                    component: () => import('@/pages/dashboard/index.vue')
                },
                {
                    path: 'vue',
                    // 懒加载
                    component: () => import('@/pages/vue.vue')

                    // 静态引入
                    // component: VueComp
                },
                {
                    path: 'react',
                    component: () => import('@/pages/react.vue')
                }


            ]
        },
    ]
})
export default router