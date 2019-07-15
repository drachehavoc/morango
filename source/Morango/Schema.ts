import { Dialect } from "./Dialect";
import { EntityController } from "./EntityController";
import { FieldController } from "./FieldController";
import { EntityMetadata } from "./EntityMetadata";
import { IFieldControllerConfig } from "./d";

export abstract class Schema {
    //
    // STATIC
    //

    static entity(): ClassDecorator {
        return Clazz => {

        }
    }

    static field(
        fcConstructor: typeof FieldController
    ): PropertyDecorator {
        return (c, k) => {
            let Clazz = c.constructor
            let fieldName = k as string
            let metadata = EntityMetadata.get(Clazz)
            metadata.addColumnMeta(fieldName, fcConstructor)
        }
    }

    //
    // INSTANCE
    //

    readonly abstract dialect: Dialect
    protected entitiesMetadata: Set<EntityMetadata> = new Set()

    get ddl() {
        return this.dialect.ddl(this.entitiesMetadata)
    }

    getEntityClass<T extends Object>(Clazz: { new(...args: any): T }) {
        let schema = this
        let BaseClass = Clazz as any

        class FormedEntityClass extends BaseClass {
            entity = new EntityController(
                schema,
                BaseClass,
                this
            )
        }

        this.entitiesMetadata.add(EntityMetadata.get(Clazz))

        // TODO: descobrir uma maneira de fazer com que o construtor da classe 
        //       retornada receba os mesmos parametros da classe base
        return <unknown>FormedEntityClass as {
            new(...args: any): T & {
                entity: EntityController
            }
        }
    }
}