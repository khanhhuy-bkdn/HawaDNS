export class ActorGenModel {
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
    acronymName: string;
    fax: string;
    address: string;
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
}
