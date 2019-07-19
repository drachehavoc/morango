import { IMetaFieldController, IMetaFieldControllerParameters } from "./d";

export class FieldController {
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
            ... custom,
            ... this.constantParameters
        }
    }

    //
    // INSTANCE
    //
    
    protected parameters: IMetaFieldControllerParameters

    constructor(
        protected meta: IMetaFieldController
    ) { 
        let Self = this.constructor as typeof FieldController
        this.parameters = Self.composeParameters(meta.fieldControllerParameters)
        console.log(this.parameters)
    }

    protected name = this.meta.fieldName
}