import { EntityMetadata } from "./EntityMetadata";
import { decamelize } from "./util";

export class Dialect {
    ddl(schemaMetadata: Set<EntityMetadata>) {
        schemaMetadata.forEach(Entity => {
            let tableName = decamelize(Entity.BaseClass.name)
            let tableEntries: string[] = []

            Object.entries(Entity.columns).forEach(([columnName, FieldControllerConstructor]) => {
                columnName = decamelize(columnName)
                let cnf = FieldControllerConstructor.config
                let nil = cnf.nil === true ? '' : ' NOT NULL'
                let type = cnf.type ? cnf.type.toUpperCase() : ' VARCHAR'
                let size = cnf.size ? `(${cnf.size})` : ''
                let serial = cnf.serial ? ' AUTOINCREMENT' : ''
                tableEntries.push(`${columnName} ${type}${size}${nil}${serial}`)
            })

            tableEntries.push(`PRIMARY KEY (${Entity.keys.map(v => decamelize(v)).join(', ')})`)

            console.log(`CREATE TABLE IF NOT EXISTS ${tableName}(\n  ${tableEntries.join(',\n  ')}\n)`)
        })
    }
}