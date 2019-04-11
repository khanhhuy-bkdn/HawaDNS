import { Dictionary } from "../dictionary/dictionary.model";
import { ContactPercent } from "./contact-percent.model";
import { Image } from "../dictionary/image.model";

export class ContactList {
    id: number;
    contactName: string;
    userContact: string;
    phone1: string;
    contributor: {
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
    contributeDate: number;
    evalution: number;
    email: string;
    status: Dictionary;
    averageRating: number;
    aggregateOfRatings: ContactPercent [];
}