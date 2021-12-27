
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name:"home", component: () => import('pages/Index.vue') },
      { path: 'login', name:"login" ,component: () => import('pages/Login.vue') },
      { path: 'categorias', name:"categorias" ,component: () => import('pages/Mantenedor-categoria.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
