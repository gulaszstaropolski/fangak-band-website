export default {
  routes: [
    {
      method: 'GET',
      path: '/videos',
      handler: 'video.find',
      config: { auth: false },
    },
  ],
};
