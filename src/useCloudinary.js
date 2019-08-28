import fetch from 'isomorphic-fetch'
import useAsyncFn from 'react-use/lib/useAsyncFn'

function useCloudinary({
  endpoint = 'https://api.cloudinary.com/v1_1',
  ...defaults
} = {}) {
  return useAsyncFn((file, options = {}) => {
    const combinedOptions = { ...defaults, ...options }
    const { cloudName, resourceType } = combinedOptions
    if (!cloudName) throw new Error('Must provide cloudName.')
    if (!resourceType) throw new Error('Must provide resourceType.')
    const url = `${endpoint}/${cloudName}/${resourceType}/upload`
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({ file, ...defaults, ...options }),
    })
  })
}

export default useCloudinary
