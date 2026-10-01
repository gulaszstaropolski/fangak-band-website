export default {
  routes: [
    {
      method: 'GET',
      path: '/streams',
      handler: 'stream.find',
      config: { auth: false },
    },
  ],
};
