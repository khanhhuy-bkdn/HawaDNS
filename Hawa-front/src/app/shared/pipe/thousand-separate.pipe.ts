import { Pipe, PipeTransform } from '@angular/core';
const PADDING = '0';
@Pipe({
  name: 'thousandSeparate'
})
export class ThousandSeparatePipe implements PipeTransform {
  private DECIMAL_SEPARATOR: string;
  private THOUSANDS_SEPARATOR: string;
  private CURRENCY_UNIT: string;

  constructor() {
    this.DECIMAL_SEPARATOR = '.';
    this.THOUSANDS_SEPARATOR = ',';
    this.CURRENCY_UNIT = '';
  }

  transform(value: number | string, fractionSize: number = 2): string {
    if (!value) { return ''; }
    if (isNaN(+value)) { return value.toString(); }

    let [integer, fraction = ''] = (+value).toString()
      .split(this.DECIMAL_SEPARATOR);

    fraction = fractionSize > 0
      ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
      : '';

    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

    return integer + fraction + (integer && this.CURRENCY_UNIT);
  }

  parse(value: string, fractionSize: number = 0): number {
    if (!isNaN(+value)) { return +value; }

    let integer = (value || '').replace(this.CURRENCY_UNIT, '');

    integer = integer.split(this.THOUSANDS_SEPARATOR).join('');

    return +integer;
  }
}
