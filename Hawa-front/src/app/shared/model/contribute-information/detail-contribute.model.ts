export class DetailContribute {
    title: string;
    date: number;
    target: string;
    host: string;
    acronymname: string;
    contact: string;
    phone: string[];
    email: string;
    website: string;
    province: {
        key: string,
        code: string,
        text: string
    };
    district: {
        key: string,
        code: string,
        text: string
    };
    ward: {
        key: string,
        code: string,
        text: string
    };
    houseNo: string;
    address: string;
    note: string;
    images: ImageItem[];
    status: {
        key: string;
        code: string;
        text: string;
    }
}

export class ImageItem {
    guid: string;
    thumbSizeUrl: string;
    largeSizeUrl: string;
}