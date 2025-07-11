/**
 * Fihub API Swagger
 *
 * Contact: contact@matthieu-freitag.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ModelsTransactionType } from './modelsTransactionType';


export interface ModelsTransactionInput { 
    asset?: string;
    broker_id?: string;
    date?: string;
    fee?: number;
    id?: string;
    price?: number;
    price_unit?: number;
    quantity?: number;
    transaction_type?: ModelsTransactionType;
    user_id?: string;
}
export namespace ModelsTransactionInput {
}


