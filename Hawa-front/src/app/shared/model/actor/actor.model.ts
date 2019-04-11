import { ReviewItem } from "../dictionary/review-item.model";

export class ActorModel {
    id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
    avatar: {
        guid: string,
        thumbSizeUrl: string,
        largeSizeUrl: string
    };
    averageRating: number;
    aggregateOfRatings: {
        rating: number,
        percent: number,
    }[];
    reviews: ReviewItem[];
}
