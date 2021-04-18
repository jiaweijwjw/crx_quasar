
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PopupPage.vue') },
      { path: '/', redirect: '/popup' },
      { path: '/popup', name: 'PopupPage', component: () => import('pages/PopupPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
