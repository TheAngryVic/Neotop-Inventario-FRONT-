
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name:"home", component: () => import('pages/Index.vue'),
       meta: { requiresAuth: true } },
      { path: 'login', name:"login" ,component: () => import('pages/Login.vue') },
      { path: 'categorias', name:"categorias" ,component: () => import('pages/Mantenedor-categoria.vue'), 
        meta: { requiresAuth: true, bodegaOnly: true } },
      { path: 'bodegas', name:"bodegas" ,component: () => import('pages/Mantenedor-bodega.vue'),
       meta: { requiresAuth: true, bodegaOnly: true } },
      { path: 'modelos', name:"modelos" ,component: () => import('pages/Mantenedor-modelos.vue'),
       meta: { requiresAuth: true, bodegaOnly: true } },
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
