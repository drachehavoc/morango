import { Clazz, IMetaFieldControllerParameters, IEntity } from "./d";
import { MetaEntity } from "./MetaEntity";
import { EntityController } from "./EntityController";
import { Dialect } from "./Dialect";

export abstract class Schema {
    //
    // STATIC
    //

    static key(
    ): PropertyDecorator {
        return (c, k) => {
            let BaseClass = c.constructor as Clazz
            let fieldName = k as string
            let metaEntity = MetaEntity.get(BaseClass)
            metaEntity.addKey(fieldName)
        }
    }

    static field(
        fieldControllerConstructorName: string,
        fieldControllerParameters: IMetaFieldControllerParameters = {}
    ): PropertyDecorator {
        return (c, k) => {
            let BaseClass = c.constructor as Clazz
            let fieldName = k as string
            let metaEntity = MetaEntity.get(BaseClass)
            metaEntity.addColumn(
                BaseClass,
                fieldName,
                fieldControllerConstructorName,
                fieldControllerParameters
            )
        }
    }

    static foreign(
        TargetClass: Clazz
    ): PropertyDecorator {
        return (c, k) => {
            let BaseClass = c.constructor as Clazz
            let fieldName = k as string
            let metaEntity = MetaEntity.get(BaseClass)
            metaEntity.addForeign(fieldName, TargetClass)
        }
    }

    static link(
        TargetClass: Clazz
    ): PropertyDecorator {
        return (c, k) => {
            let BaseClass = c.constructor as Clazz
            let fieldName = k as string
            let metaEntity = MetaEntity.get(BaseClass)
            metaEntity.addLink(fieldName, TargetClass)
        }
    }

    //
    // INSTANCE
    //

    abstract dialect: Dialect

    protected getEntityFrom<T>(
        BaseClass: new (...args: any) => T
    ): IEntity<T> {
        let schema = this
        let metaEntity = MetaEntity.get(BaseClass)
        return class extends (<any>BaseClass) {
            Entity = new EntityController(schema, metaEntity, this)
        } as IEntity<T>
    }
}