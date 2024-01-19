import { ConcatArraysPipe } from './concat-arrays.pipe';

describe('ConcatArraysPipe', () => {
  it('create an instance', () => {
    const pipe = new ConcatArraysPipe();
    expect(pipe).toBeTruthy();
  });
});
