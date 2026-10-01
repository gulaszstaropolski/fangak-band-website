export default {
  routes: [
    {
      method: 'GET',
      path: '/pages',
      handler: 'page.find',
      config: { auth: false },
    },
  ],
};
