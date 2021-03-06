// tslint:disable
/**
 * Api Documentation
 * Api Documentation
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface ColorSpace
 */
export interface ColorSpace {
    /**
     * 
     * @type {boolean}
     * @memberof ColorSpace
     */
    csSRGB?: boolean;
    /**
     * 
     * @type {number}
     * @memberof ColorSpace
     */
    numComponents?: number;
    /**
     * 
     * @type {number}
     * @memberof ColorSpace
     */
    type?: number;
}

export function ColorSpaceFromJSON(json: any): ColorSpace {
    return {
        'csSRGB': !exists(json, 'cs_sRGB') ? undefined : json['cs_sRGB'],
        'numComponents': !exists(json, 'numComponents') ? undefined : json['numComponents'],
        'type': !exists(json, 'type') ? undefined : json['type'],
    };
}

export function ColorSpaceToJSON(value?: ColorSpace): any {
    if (value === undefined) {
        return undefined;
    }
    return {
        'cs_sRGB': value.csSRGB,
        'numComponents': value.numComponents,
        'type': value.type,
    };
}


