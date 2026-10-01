export default {
  routes: [
    {
      method: 'GET',
      path: '/events',
      handler: 'event.find',
      config: { auth: false },
    },
  ],
};
