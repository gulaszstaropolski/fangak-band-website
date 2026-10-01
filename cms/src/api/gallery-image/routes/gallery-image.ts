export default {
  routes: [
    {
      method: 'GET',
      path: '/gallery-images',
      handler: 'gallery-image.find',
      config: { auth: false },
    },
  ],
};
