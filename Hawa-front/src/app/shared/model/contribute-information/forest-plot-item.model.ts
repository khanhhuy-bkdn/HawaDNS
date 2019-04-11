export class ForestPlotItem {
    id: number;
    contactName: string;
    userContact: string;
    phone1: string;
    contributor: string;
    contributeDate: number;
    evalution: number;
    email: string;
    status: {
        key: string,
        code: string,
        text: string
    };
    averageRating: number;
    aggregateOfRatings: {
        rating: number,
        percent: number,
    }[];
}
