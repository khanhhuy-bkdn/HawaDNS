import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  transform(value: string, length: number = 400): string {
    if (!value) return null;
    if (length == 0 || value.length < length) return value;
    return value.substring(0, length) + '...';
  }

}
