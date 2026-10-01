export default {
  routes: [
    {
      method: 'GET',
      path: '/musics',
      handler: 'music.find',
      config: { auth: false },
    },
  ],
};
