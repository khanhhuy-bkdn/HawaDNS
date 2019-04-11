import { Validators, AbstractControl, ValidationErrors } from '@angular/forms';

const PHONE_NUMBER_MIN_LENGTH = 10;
const FAX_NUMBER_MIN_LENGTH = 10;
const PASSWORD_MIN_LENGTH = 6;
const TAX_NUMBER_MIN_LENGTH = 10;
const TAX_NUMBER_MAX_LENGTH = 13;
const USERNAME_LOGIN_MIN_LENGTH = 6;

export default class CustomValidator {

    static emailOrEmpty(control: AbstractControl): ValidationErrors | null {
        return (control.value === '' || control.value === null) ? null : Validators.email(control);
    }

    static required(control: AbstractControl): ValidationErrors | null {
        return (control.value === '' || control.value === null || control.value.trim() === '')
            ? {
                required: {
                    valid: false
                }
            }
            : null;
    }

    static requiredDate(control: AbstractControl): ValidationErrors | null {
        return (control.value === null || control.value === '')
            ? {
                required: {
                    valid: false
                }
            }
            : null;
    }

    static website(control: AbstractControl): ValidationErrors | null {
        const WEBSITE_REGEX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
        return (WEBSITE_REGEX.test(control.value) || (control.value === '' || control.value === null)) ? null : {
            website: {
                valid: false
            }
        };
    }

    static totalValue(control: AbstractControl): ValidationErrors | null {
        return ((control.value === '' || control.value === null) || (control.value > 0)) ? null : {
            totalValue: {
                valid: false
            }
        };
    }

    static probability(control: AbstractControl): ValidationErrors | null {
        return ((control.value === '' || control.value === null) || (control.value >= 0 && control.value <= 100)) ? null : {
            probability: {
                valid: false
            }
        };
    }

    static phoneNumber(control: AbstractControl): ValidationErrors | null {
        return (CustomValidator.isNullOrEmpty(control.value)
            || (control.value.length >= PHONE_NUMBER_MIN_LENGTH))
            ? null
            : {
                phoneNumber: {
                    valid: false
                }
            };
    }

    static faxNumber(control: AbstractControl): ValidationErrors | null {
        return (CustomValidator.isNullOrEmpty(control.value)
            || (control.value.length >= FAX_NUMBER_MIN_LENGTH))
            ? null
            : {
                faxNumber: {
                    valid: false
                }
            };
    }

    static taxNumber(control: AbstractControl): ValidationErrors | null {
        return (CustomValidator.isNullOrEmpty(control.value)
            || ((control.value.length >= TAX_NUMBER_MIN_LENGTH) && (control.value.length <= TAX_NUMBER_MAX_LENGTH)))
            ? null
            : {
                taxNumber: {
                    valid: false
                }
            };
    }

    static password(control: AbstractControl): ValidationErrors | null {
        return (CustomValidator.isNullOrEmpty(control.value)
            || (control.value.length >= PASSWORD_MIN_LENGTH))
            ? null
            : {
                password: {
                    valid: false
                }
            };
    }

    private static isNullOrEmpty(value) {
        return value === undefined || value === null || value === '';
    }

    static loginName(control: AbstractControl): ValidationErrors | null {
        return (CustomValidator.isNullOrEmpty(control.value)
            || (control.value.length >= USERNAME_LOGIN_MIN_LENGTH))
            ? null
            : {
                userName: {
                    valid: false
                }
            };
    }

    static validateEmail(email) {
        return /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(email);
    }
    static email(email: AbstractControl): ValidationErrors | null {
        var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (EMAIL_REGEX.test(email.value) || (email.value === '' || email.value === null)) ? null : {
            email: {
                valid: false
            }
        };
    }
}
