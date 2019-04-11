import { Dictionary } from "../dictionary/dictionary.model";
import { Image } from "../dictionary/image.model";
import { ContactPercent } from "./contact-percent.model";

export class ContactDetail {
    id?: number;
    contributor: string;
    titleContribute: string;
    contactType: Dictionary;
    userType: Dictionary;
    contactName: string;
    acronymName: string;
    detail: string;
    userContact: string;
    phone1: string;
    phone2: string;
    email: string;
    website: string;
    note: string;
    images: Image [];
    stateProvince: Dictionary;
    district: Dictionary;
    commune: Dictionary;
    houseNumber: string;
    address: string;
    averageRating: number;
    aggregateOfRatings: ContactPercent[];
    locationInCharge: {
        stateProvince: Dictionary;
        district: Dictionary;
        commune: Dictionary;
    } [];
}