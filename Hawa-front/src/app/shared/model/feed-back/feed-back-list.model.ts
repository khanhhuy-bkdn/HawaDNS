import { Dictionary } from "../dictionary/dictionary.model";
import { Image } from "../dictionary/image.model";

export class FeedBackList {
    isLike: boolean;
    date: number;
    content: string;
    user: {
        id: number;
        email: string;
        type: Dictionary;
        organizationName: string;
        acronymName: string;
        phone: string;
        avatar: Image;
        stateProvince: Dictionary;
        district: Dictionary;
        commune: Dictionary;
        status: Dictionary;
    };
    id: number;
}