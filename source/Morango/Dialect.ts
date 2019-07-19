import { IMetaFieldController, IFieldControllersConstructors, Clazz } from "./d";
import { FieldController } from "./FieldController";
import { Schema } from "./Schema";
import { MetaEntity } from "./MetaEntity";
import { decamelize } from "./util";

export class Dialect {
    //
    // STATIC
    //

    protected static fieldControllerConstructors: IFieldControllersConstructors = {
        FieldController
    }

    static getFieldControllerConstructor(
        constructorName: string
    ): typeof FieldController {
        let FC = this.fieldControllerConstructors[constructorName]
        if (FC) return FC as typeof FieldController
        throw `O Dialect '${this.name}' não possui FieldController do tipo '${constructorName}'`
    }

    static getFieldController(
        metaFC: IMetaFieldController
    ): FieldController {
        try {
            let constructorName = metaFC.fieldControllerConstructorName
            let FC = new (this.getFieldControllerConstructor(constructorName))(metaFC)
            return FC
        } catch (e) {
            throw `Não é possível definir campo '${metaFC.BaseClass.name}.${metaFC.fieldName}' como '${metaFC.fieldControllerConstructorName}', pois o dialect '${this.name}' não possui este classe em sua lista de FieldControllers`
        }
    }

    private static getDdlTable(BaseClass: Clazz) {
        let metaEntity = MetaEntity.get(BaseClass)
        let tableName: string = decamelize(BaseClass.name)
        let definitions: string[] = []
        let constraints: string[] = []
        let composition: string[]

        Object
            .values(metaEntity.columns)
            .forEach(meta => {
                let FC = this.getFieldControllerConstructor(meta.fieldControllerConstructorName)
                let cnf = FC.composeParameters(meta.fieldControllerParameters)
                let col = decamelize(meta.fieldName)
                let nil = cnf.nil === true ? '' : ' NOT NULL'
                let type = cnf.type ? cnf.type.toUpperCase() : 'VARCHAR'
                let size = cnf.size ? `(${cnf.size})` : ''
                let serial = cnf.serial ? ' AUTOINCREMENT' : ''
                definitions.push(`${col} ${type}${size}${nil}${serial}`)
            })

        composition = [
            ...definitions,
            ...constraints
        ]

        return `CREATE TABLE IF NOT EXISTS ${tableName}(\n  ${composition.join(';\n  ')}\n);`
    }

    static getDDL(
        schema: Schema
    ): string {
        let databaseEntries: string[] = []
        schema
            .entityClasses
            .forEach((EntityClass, BaseClass) =>
                databaseEntries.push(this.getDdlTable(BaseClass)))
        return databaseEntries.join(`\n\n`)
    }
}