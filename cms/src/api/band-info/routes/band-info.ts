export default {
  routes: [
    {
      method: 'GET',
      path: '/band-info',
      handler: 'band-info.find',
      config: { auth: false },
    },
  ],
};
