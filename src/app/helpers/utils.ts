
import Web3 from 'web3';
import BigNumber from "bignumber.js";
import { environment } from 'src/environments/environment';

// https://ethereum.stackexchange.com/questions/35014/how-to-show-18-decimals-token-balance-in-readable-format


/**
 * @name toWei
 * @description                 Convert from Ether to Wei  in the correct format
 * @param value 
 * @returns 
 */
export function toWei(value: any, decimals: any = 18): any {
    if (!value) { return 0 }
    if (decimals == 18) {
        return Web3.utils.toWei(value.toString());
    } else {
        let x = new BigNumber(value).multipliedBy(10 ** decimals)
        return x.toString()
    }
}


export function toTokenDecimals(value: any, decimals = 18): any {
    if (!value) { return 0 }
    if (decimals == 18) {
        return value;
    } else {
        const decimalsLeft = (18 - decimals);
        let x = new BigNumber(value).dividedBy(10 ** decimalsLeft)

        if (x.toString().search(/./) !== -1) {
            const toArray = x.toString().split('.');
            x = new BigNumber(toArray[0]).plus(1);
        }
        return x.toString()
    }
}


/**
 * @name toGwei
 * @description                 Convert from Ether to Wei  in the correct format
 * @param value 
 * @returns 
 */
export function toGwei(value: any): any {
    return Web3.utils.toWei(value.toString(), 'gwei');

}

/**
 * @name toHex
 * @param value 
 * @returns 
 */
export function toHex(value: any): any {
    return Web3.utils.toHex(value);
}


/**
 * @name fromGwei
 * @param value 
 * @returns 
 */
export function fromGwei(value: any): any {
    return Web3.utils.fromWei(value.toString(), 'gwei');

}


/**
 * @name parseUnits
 * @param value 
 * @returns 
 */
export function parseUnits(value: any): any {
    return Web3.utils.fromWei(value.toString(), 'gwei');
}





/**
 * @name fromWei
 * @description                     Convert from Wei to Ether in the correct format
 * @param value 
 * @param decimals 
 * @returns 
 */
export function fromWei(value: any, decimals: any = 18): any {
    if (!value) { return 0 }
    if (decimals == 18) {
        return Web3.utils.fromWei(value.toString());
    } else {
        let x = new BigNumber(value).dividedBy(10 ** decimals).toString(10)
        return x.toString()
    }
}

/**
 * @name toBN
 * @param value 
 * @returns 
 */
export function toBN(value: any): any {
    return Web3.utils.toBN(value)
}


/**
 * @name addressIsValid
 * @description                     Verify that the address is valid
 * @param accounts 
 * @returns 
 */
export function addressIsValid(accounts: any) {
    return Web3.utils.isAddress(accounts)
}

export function getCurrentDateTimeBlock() {
    let dateInAWeek = new Date(); // now
    const deadline = Math.floor(dateInAWeek.getTime() / 1000); // unix timestamp
    return deadline.toString()
}

/**
 * @name addDays
 * @description                       Agregamos dias a la fecha actual      
 * @param days 
 * @returns 
 */
export function addDays(days: any) {
    let dateInAWeek = new Date(); // now
    dateInAWeek.setDate(dateInAWeek.getDate() + days); // add 7 days
    const deadline = Math.floor(dateInAWeek.getTime() / 1000); // unix timestamp
    return deadline.toString()
}


/**
 * @name getDateFromBlock
 * @description                     Transforma una fecha de bloque a js
 * @param timestamp 
 * @returns 
 */
export function getDateFromBlock(timestamp: any) {
    let date = new Date(timestamp * 1000);
    return date
}


/**
 * @name fromBasicPoint
 * @param value 
 * @returns 
 */
export function fromBasicPoint(value: any) {
    return Number(value) / 100;
}


/**
 * @name toBasicPoint
 * @param value 
 * @returns 
 */
export function toBasicPoint(value: any) {
    return Number(value) * 100;
}


/**
 * @name convertFromDaysToSeconds
 * @description                 Convertimos los dias por segundo
 * @param day 
 * @returns 
 */
export function convertFromDaysToSeconds(day: any) {
    return 86400 * day;
}

export function clearDecimalsOnBN(value: any) {
    let amount = new BigNumber(value);
    if (amount.toString().search(/./) !== -1) {
        const toArray = amount.toFixed().split('.');
        amount = new BigNumber(toArray[0]).plus(1);
    }
    return amount.toFixed();
}

export function customArrayNumber(from: number, to: number) : any[] {
    return [...Array((to - 1) - from + 1).keys()].map(x => x + from);
}

export function chunkArray(array: any[] = [], chunkSize = 10){
    const newArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        newArray.push(chunk);
    }
    return newArray;
}

export function getCollectionName(name: string){
    return [environment.dbPrefix, name].join('')
}


