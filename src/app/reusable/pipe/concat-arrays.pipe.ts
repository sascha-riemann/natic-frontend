import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'concatArrays',
})
export class ConcatArraysPipe<T = any> implements PipeTransform {
  transform(arrays: T[][]): T[] {
    return ([] as T[]).concat(...arrays.filter(arr => Array.isArray(arr)));
  }
}
