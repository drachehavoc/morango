import { IMetaFieldController, IFieldControllersConstructors } from "./d";
import { FieldController } from "./FieldController";

export class Dialect {
    protected static fieldControllerConstructors: IFieldControllersConstructors = {
        FieldController
    }

    static getFieldController(
        metaFC: IMetaFieldController
    ): FieldController {
        let FC = <typeof FieldController>this
            .fieldControllerConstructors[metaFC.fieldControllerConstructorName]
        if (FC) return new FC(metaFC)
        throw `Não é possível definir campo '${metaFC.BaseClass.name}.${metaFC.fieldName}' como '${metaFC.fieldControllerConstructorName}', pois o dialect '${this.name}' não possui este classe em sua lista de FieldControllers`
    }
}