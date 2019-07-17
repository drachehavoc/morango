import { FieldController } from "./FieldControllers/FieldController";
import { EntityController } from "./EntityController";

/**
 * 
 */
// export declare interface IListFieldControllers { [fieldName: string]: FieldController }

/**
 * 
 */
// export declare interface Clazz<T = any> { new(...args: any): T }

/**
 * 
 */
export declare interface IFieldControllerConfig {
    key?: boolean
    nil?: boolean
    type?: string
    size?: any
    serial?: boolean
}

/**
 * 
 */
export declare interface FieldControllesMetadataList {
    [fieldName: string]: typeof FieldController
}