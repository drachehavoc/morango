import { IMetaFieldController, IFieldControllersConstructors, Clazz, IEntity } from "./d";
import { FieldController } from "./FieldController";
import { Schema } from "./Schema";
import { MetaEntity } from "./MetaEntity";
import { decamelize } from "./util";
import { EntityController } from "./EntityController";
import maria, { ConnectionConfig } from "mariadb"

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
        let nil = cnf.nullable === true ? '' : ' NOT NULL'
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

    static getDdl(
        schema: Schema
    ): string[] {
        let databaseEntries: string[] = []
        schema.entityClasses.forEach((EntityClass, BaseClass) => databaseEntries.push(this.getDdlTable(BaseClass)))
        return databaseEntries
    }

    static async saveEntity(
        entityController: EntityController
    ): Promise<{
        query: string,
        values: string[]
    }> {
        let fieldsAndValues: { [fildName: string]: string } = {}
        let entity = entityController.entity
        let fieldsErrors: string[] = []

        Object.entries(entityController.fieldControllers).forEach(([k, fc]) => {
            try {
                fieldsAndValues[decamelize(k)] = fc.getToDb()
            } catch (e) {
                fieldsErrors.push(e)
            }
        })

        try {
            await Promise.all(
                Object.entries(entityController.metaEntity.foreigns).map(async ([k, meta]) => {
                    let targetMeta = MetaEntity.get(meta.TargetClass)
                    let targetEntity = entity[k]
                    let targetFieldControllers = targetEntity.Entity.fieldControllers

                    if (targetEntity.Entity.isModified)
                        await targetEntity.Entity.save()

                    targetMeta.keys.forEach(key => {
                        let fieldMetaTarget = targetMeta.columns[key]
                        let fieldName = decamelize(`${meta.fieldName}__${fieldMetaTarget.BaseClass.name}_${key}`)
                        fieldsAndValues[fieldName] = targetFieldControllers[key].getToDb()
                    })
                })
            )
        } catch (e) {
            fieldsErrors.push(e)
        }

        if (fieldsErrors.length)
            throw fieldsErrors.join('; ')

        let rFields = Object.keys(fieldsAndValues)
        let fields = rFields.join(', ')
        let values = Object.values(fieldsAndValues)
        let placeholders = Array(rFields.length).fill('?').join(', ')
        let query = `INSERT INTO ${decamelize(entityController.BaseClass.name)}(${fields}) VALUES(${placeholders})`

        return { query, values }
    }

    //
    // INSTANCE
    //

    protected Self = this.constructor as typeof Dialect
    protected connection = maria.createConnection(this.connectionOptions)

    constructor(
        protected connectionOptions: ConnectionConfig
    ) {
        // this.connection.connect(err => {
        //     if (err) throw `error connecting: ${err.stack}`
        //     console.log('connected as id ' + this.connection.threadId);
        // })
    }

    async syncSchema(
        schema: Schema
    ): Promise<boolean> {
        let connection = await this.connection;
        await connection.query(`SET FOREIGN_KEY_CHECKS=0;`)
        await Promise.all(
            this.Self.getDdl(schema).map(sql => {
                let action = connection.query(sql)
                // action.then(x => console.log(x, sql))
                return action
            })
        )
        await connection.query(`SET FOREIGN_KEY_CHECKS=1;`)
        return true;
    }

    async saveEntity(
        entityController: EntityController
    ): Promise<boolean> {
        let connection = await this.connection
        let { query, values } = await this.Self.saveEntity(entityController)
        let res = await connection.query(query, values)
        console.log(res)
        return true;
    }
}