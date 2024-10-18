import { HeadersMiddleware } from './headers.middleware';

describe('HeaderssMiddlewareMiddleware', () => {
  it('should be defined', () => {
    expect(new HeadersMiddleware()).toBeDefined();
  });
});
