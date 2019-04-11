import { PagedResult } from "../dictionary/paging-result.model";
import { ContactList } from "./contact-list.model";
import { ItemUnit } from "../dictionary/item-unit.model";
import { Dictionary } from "../dictionary/dictionary.model";

export class ContactListAll {
    contacts: PagedResult<ContactList>;
    ubnd: ItemUnit;
    forestProtectionDepartment: {
        id: number;
        name: string;
        phone: string;
        district: Dictionary;
        stateProvince: Dictionary;
    }
}