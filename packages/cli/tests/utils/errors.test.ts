import { describe, expect, test } from 'vitest'

import { handleGrotteRequestError, GrotteRequestError } from '../../src/utils/errors'

describe('handleGrotteRequestError', () => {
  test('does not throw when there is no error', () => {
    const res = { data: { id: '123' } }
    expect(() => handleGrotteRequestError(res)).not.toThrow()
  })

  test('throws GrotteRequestError for known status codes', () => {
    const res = { error: { code: 401, message: 'invalid token' } }
    expect(() => handleGrotteRequestError(res, 'Auth failed')).toThrow(
      GrotteRequestError
    )
    expect(() => handleGrotteRequestError(res, 'Auth failed')).toThrow(
      'Auth failed: [401] unauthorized: invalid token'
    )
  })

  test('throws GrotteRequestError with message for status code 0', () => {
    const res = { error: { code: 0, message: 'connection reset' } }
    expect(() => handleGrotteRequestError(res, 'Request failed')).toThrow(
      GrotteRequestError
    )
    expect(() => handleGrotteRequestError(res, 'Request failed')).toThrow(
      'Request failed: [0] unknown error: connection reset'
    )
  })

  test('throws GrotteRequestError when error code is missing', () => {
    const res = { error: { message: 'something went wrong' } } as any
    expect(() => handleGrotteRequestError(res, 'Request failed')).toThrow(
      GrotteRequestError
    )
    expect(() => handleGrotteRequestError(res, 'Request failed')).toThrow(
      'Request failed: [0] unknown error: something went wrong'
    )
  })

  test('handles valid but unlisted HTTP status codes via statuses package', () => {
    const res = { error: { code: 502, message: 'upstream down' } }
    expect(() => handleGrotteRequestError(res)).toThrow(GrotteRequestError)
    expect(() => handleGrotteRequestError(res)).toThrow(
      '[502] Bad Gateway: upstream down'
    )
  })
})
