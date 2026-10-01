export default {
  routes: [
    {
      method: 'GET',
      path: '/home',
      handler: 'home.find',
      config: { auth: false },
    },
  ],
};
