
const fetch = jest.fn(function (url, options) {
  // Echoes back passed options
  return Promise.resolve({ url, ...options })
})

export default fetch