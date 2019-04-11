export class SystemFeedback {
    id: number;
    isLike: boolean;
    date: number;
    content: string;
    user: {
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
        avatar: {
            guid: string,
            thumbSizeUrl: string,
            largeSizeUrl: string
        },
        stateProvince: {
            key: string,
            code: string,
            text: string
        },
        district: {
            key: string,
            code: string,
            text: string
        },
        commune: {
            key: string,
            code: string,
            text: string
        },
        status: {
            key: string,
            code: string,
            text: string
        }
    }
}