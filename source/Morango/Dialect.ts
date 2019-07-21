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

    private static getDdlField(
        meta: IMetaFieldController,
        prefix: string = ''
    ) {
        let FC = this.getFieldControllerConstructor(meta.fieldControllerConstructorName)
        let cnf = FC.composeParameters(meta.fieldControllerParameters)
        let col = prefix || decamelize(`${meta.fieldName}`)
        let nil = cnf.nil === true ? '' : ' NOT NULL'
        let type = cnf.type ? cnf.type.toUpperCase() : 'VARCHAR'
        let size = cnf.size ? `(${cnf.size})` : ''
        let serial = cnf.serial ? ' AUTOINCREMENT' : ''
        return `${col} ${type}${size}${nil}${serial}`
    }

    private static getDdlTable(
        BaseClass: Clazz
    ) {
        let metaEntity = MetaEntity.get(BaseClass)
        let tableName: string = decamelize(BaseClass.name)
        let definitions: string[] = []
        let constraints: string[] = []
        let composition: string[] = []

        Object.values(metaEntity.columns).forEach(meta => {
            definitions.push(this.getDdlField(meta))
        })

        Object.values(metaEntity.foreigns).forEach(meta => {
            let targetMeta = MetaEntity.get(meta.TargetClass)
            let targetTableKeys = targetMeta.keys.map(k => decamelize(k)).join(', ')
            let targetTableName = decamelize(meta.TargetClass.name)
            let fks: string[] = []
            targetMeta.keys.forEach(key => {
                let fieldMetaTarget = targetMeta.columns[key]
                let fieldName = decamelize(`${meta.fieldName}__${fieldMetaTarget.BaseClass.name}_${key}`)
                fks.push(fieldName)
                definitions.push(this.getDdlField(fieldMetaTarget, fieldName))
            })
            constraints.push(`FOREIGN KEY (${fks.join(', ')}) REFERENCES ${targetTableName}(${targetTableKeys})`)
        })

        if (metaEntity.keys.length) {
            constraints.push(`PRIMARY KEY (${metaEntity.keys.map(k => decamelize(k)).join(', ')})`)
        }

        composition.push(
            ...definitions,
            ...constraints
        )

        return `CREATE TABLE IF NOT EXISTS ${tableName}(\n  ${composition.join(',\n  ')}\n);`
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