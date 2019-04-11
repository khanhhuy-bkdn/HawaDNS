import { ContactDetail } from "./contact-detail.model";
import { Dictionary } from "../dictionary/dictionary.model";
import { Image } from "../dictionary/image.model";

export class ReviewContactList {
    id: number;
    contact: ContactDetail;
    reviewUser: {
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
    }
    rating: number;
    title: string;
    content: string;
    reviewDate: number;
    hidden: boolean;
}