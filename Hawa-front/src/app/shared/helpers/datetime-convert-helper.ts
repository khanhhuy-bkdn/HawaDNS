import * as moment from 'moment';

export default class DateTimeConvertHelper {
    private static readonly dateFormat = 'DD/MM/YYYY';
    private static readonly datetimeFormat = 'DD/MM/YYYY HH:mm';
    private static readonly timeFormat = 'HH:mm';
    private static readonly seconFormat = 'X';

    static fromDtObjectToTimestamp(dtObject: Date): number {
        return dtObject ? moment.utc(dtObject).add(7, 'hours').unix() : null;
    }

    static fromTimestampToDtObject(timestamp: number): Date {
        return timestamp ? moment.utc(timestamp).subtract(7, 'hours').toDate() : null;
    }

    static fromTimestampToDtStr(timestamp: number): string {
        return moment(timestamp).format(this.dateFormat);
    }

    static fromDtObjectToSecon(dtObject: Date): number {
        return dtObject ? Number(moment.utc(dtObject).add(7, 'hours').format(this.seconFormat)) : null;
    }
}
