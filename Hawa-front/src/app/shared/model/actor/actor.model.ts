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
    roles: {
        key: string;
        code: string;
        text: string;
    } [];
    type: {
        id: number;
        name: string;
        code: string;
        acronymName: string;
    }
    identityCard: string;
    acronymName: string;
    representative: string;
    fax: string;
    address: string;
    houseNumber: string;
    stateProvince: {
        key: string;
        code: string;
        text: string;
    }
    district: {
        key: string;
        code: string;
        text: string;
    }
    commune: {
        key: string;
        code: string;
        text: string;
    }
    status: {
        key: string;
        code: string;
        text: string;
    };
    aggregateOfRatings: {
        rating: number,
        percent: number,
    }[];
    reviews: ReviewItem[];
    contactName: string;
    contactPhone: string;
    note: string;
}
