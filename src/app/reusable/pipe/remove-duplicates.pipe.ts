import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeDuplicates',
})
export class RemoveDuplicatesPipe<T extends { id: number }> implements PipeTransform {
  transform(array: T[]): T[] {
    const uniqueItemsMap: Map<number, T> = new Map();

    for (const item of array) {
      uniqueItemsMap.set(item.id, item);
    }

    return Array.from(uniqueItemsMap.values());
  }
}
