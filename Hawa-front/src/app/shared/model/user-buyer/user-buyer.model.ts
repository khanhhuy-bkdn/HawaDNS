export class UserBuyerModel {
    id: number;
    userName: string;
    email: string;
    type: {
        key: string,
        code: string,
        text: string
    };
    organizationName: string;
    taxNumber: string;
    acronymName: string;
    representative: string;
    phone: number;
    fax: number;
    website: string;
    houseNumber: string;
    address: string;
    identityCard: number;
    stateProvince: {
        key: string,
        code: number,
        text: string
    };
    district: {
        key: string,
        code: number,
        text: string
    };
    commune: {
        key: string,
        code: number,
        text: string
    };
    avatar: {
        guid: string,
        thumbSizeUrl: string,
        largeSizeUrl: string,
    };
    evaluate: number; //rating
    status: {
        key: string,
        code: string,
        text: string
    }
}