import { EntityController } from "./EntityController";
import { FieldController } from "./FieldController";

export declare interface Clazz<T extends Object = Object> {
    new(...params: any): T
}

export declare type placeholder = any

export declare interface IFieldControllers {
    [fieldName: string]: FieldController
}

export declare interface IFieldControllersConstructors {
    [fieldName: string]: typeof FieldController
}

export declare interface IMetaFieldControllerParameters {
    nil?: boolean
    type?: string
    size?: any
    serial?: boolean
}

export declare interface IMetaFieldController {
    BaseClass: Clazz
    fieldName: string
    fieldControllerConstructorName: string
    fieldControllerParameters: IMetaFieldControllerParameters
}

export declare interface IMetaColumns {
    [fieldName: string]: IMetaFieldController
}

export declare interface IMetaForeign {
    fieldName: string
    TargetClass: Clazz
}

export declare interface IMetaForeigns {
    [fieldName: string]: IMetaForeign
}

export declare interface IEntity<T> {
    new(...args: any): T & {
        Entity: EntityController
    }
}