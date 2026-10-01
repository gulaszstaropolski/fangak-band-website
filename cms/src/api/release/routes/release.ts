export default {
  routes: [
    {
      method: 'GET',
      path: '/releases',
      handler: 'release.find',
      config: { auth: false },
    },
  ],
};
