export default {
  routes: [
    {
      method: 'GET',
      path: '/tracks',
      handler: 'track.find',
      config: { auth: false },
    },
  ],
};
