export class PopupGeneral {
    title: string;
    notices: string[];
    fields: Field[];
    actions: Action[];
}

class Field {
    fieldname: string;
    fieldvalue: string | number;
    fieldid: string;
    fieldtype: string;
    required: boolean;
}
class Action {
    actionname: string;
    actionvalue: boolean;
    actiontype: string;
}
