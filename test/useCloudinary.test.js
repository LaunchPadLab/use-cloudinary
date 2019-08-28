import useCloudinary from '../src'
import { renderHook, act } from '@testing-library/react-hooks'

// Relies on fetch mock to return request options.
// Does not test upload state updates since those are handled by react-use.

describe('useCloudinary', () => {
  it('requires cloudName and resourceType arguments', async () => {
    const { result } = renderHook(() => useCloudinary())
    const fetch = result.current[1]
    await expect(() => act(() => fetch('my file'))).toThrow()
    await expect(() => act(() => fetch('my file', { cloudName: 'foo' }))).toThrow()
    await expect(() => act(() => fetch('my file', { resourceType: 'bar' }))).toThrow()
    await expect(() => act(() => fetch('my file', { cloudName: 'foo', resourceType: 'bar' }))).not.toThrow()
  })
  it('builds endpoint with cloudName and resourceType', async () => {
    const { result } = renderHook(() => useCloudinary({ cloudName: 'foo', resourceType: 'bar' }))
    const fetch = result.current[1]
    await act(() => fetch())
    const { url } = result.current[0].value
    expect(url).toEqual('https://api.cloudinary.com/v1_1/foo/bar/upload')
  })
  it('can receive custom endpoint', async () => {
    const { result } = renderHook(() => useCloudinary({ cloudName: 'foo', resourceType: 'bar', endpoint: 'baz' }))
    const fetch = result.current[1]
    await act(() => fetch())
    const { url } = result.current[0].value
    expect(url).toEqual('baz/foo/bar/upload')
  })
  it('passes file to request', async () => {
    const { result } = renderHook(() => useCloudinary({ cloudName: 'foo', resourceType: 'bar' }))
    const fetch = result.current[1]
    await act(() => fetch('my file'))
    const { body } = result.current[0].value
    expect(JSON.parse(body).file).toEqual('my file')
  })
  it('passes through other options to request', async () => {
    const { result } = renderHook(() => useCloudinary({ cloudName: 'foo', resourceType: 'bar', folder: 'folder', otherThing: 'otherThing' }))
    const fetch = result.current[1]
    await act(() => fetch())
    const { body } = result.current[0].value
    expect(JSON.parse(body).folder).toEqual('folder')
    expect(JSON.parse(body).otherThing).toEqual('otherThing')
  })
  it('can overwrite options with fetch function', async () => {
    const { result } = renderHook(() => useCloudinary({ cloudName: 'foo', resourceType: 'bar', folder: 'custom' }))
    const fetch = result.current[1]
    await act(() => fetch('my file', { folder: 'custom' }))
    const { body } = result.current[0].value
    expect(JSON.parse(body).folder).toEqual('custom')
  })
})