export class ActorReviewModel {
    id: number;
    actor: {
        id: number,
        name: string,
        email: string,
        phone: string,
        website: string,
        avatar: {
            guid: string,
            thumbSizeUrl: string,
            largeSizeUrl: string
        },
        averageRating: number,
        aggregateOfRatings: [
            {
                key: string,
                code: string,
                text: string
            }
        ]
    };
    reviewUser: {
        id: number,
        email: string,
        type: {
            key: string,
            code: string,
            text: string
        },
        organizationName: string,
        acronymName: string,
        phone: string,
        stateProvince: {
            key: string,
            code: string,
            text: string,
        },
        district: {
            key: string,
            code: string,
            text: string,
        },
        commune: {
            key: string,
            code: string,
            text: string,
        },
        status: {
            key: string,
            code: string,
            text: string,
        },
        avatar: {
            guid: string,
            thumbSizeUrl: string,
            largeSizeUrl: string,
        }
    };
    rating: number;
    title: string;
    content: string;
    reviewDate: number;
    hidden: boolean;
}