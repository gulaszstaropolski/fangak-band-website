export default {
  routes: [
    {
      method: 'GET',
      path: '/settings',
      handler: 'settings.find',
      config: { auth: false },
    },
  ],
};
