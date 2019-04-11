export class UserBuyerItem {
    id: number;
    email: string;
    type: {
        key: string,
        code: string,
        text: string
    };
    organizationName: string;
    acronymName: string;
    phone: string;
    homePhone: string;
    stateProvince: {
        key: string,
        code: string,
        text: string
    };
    district: {
        key: string,
        code: string,
        text: string
    };
    commune: {
        key: string,
        code: string,
        text: string
    };
    status: {
        key: string,
        code: string,
        text: string
    };
    checked: boolean;
}