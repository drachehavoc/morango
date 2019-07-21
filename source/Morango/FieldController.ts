import { IMetaFieldController, IMetaFieldControllerParameters } from "./d";

export class FieldController implements PropertyDescriptor {
    //
    // STATIC
    //

    static readonly defaultParameters: Partial<IMetaFieldControllerParameters> = Object.freeze({
        nil: true,
        type: 'varchar',
        size: '255',
        serial: false,
    })

    static readonly constantParameters: Partial<IMetaFieldControllerParameters> = Object.freeze({
    })

    static composeParameters(
        custom: IMetaFieldControllerParameters
    ): IMetaFieldControllerParameters {
        return {
            ... this.defaultParameters,
            ...custom,
            ... this.constantParameters
        }
    }

    //
    // INSTANCE
    //

    protected rawValue: any = null
    protected parameters: IMetaFieldControllerParameters
    // protected name = this.meta.fieldName

    constructor(
        protected meta: IMetaFieldController
    ) {
        let Self = this.constructor as typeof FieldController
        this.parameters = Self.composeParameters(meta.fieldControllerParameters)
    }

    get(
    ): any {
        console.log('pegou ' + this.rawValue)
        return this.rawValue
    }

    set(
        v: any
    ): void {
        console.log('setou ' + v)
        this.rawValue = v
    }
}