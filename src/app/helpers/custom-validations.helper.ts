import { AbstractControl } from "@angular/forms";
import { addressIsValid } from "./utils";

/**
 * Validar si una dirección es correcta
 * @param control 
 * @returns
 */
export function cmIsValidAddress(control: AbstractControl){
    return (addressIsValid(control.value)) ? null : { isValidAddress: true };
}