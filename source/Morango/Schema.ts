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
    protected _Dialect!: typeof Dialect
    protected _entityClasses: Map<Clazz, IEntity<any>> = new Map()

    protected getEntityClass<T>(
        BaseClass: new (...args: any) => T
    ): IEntity<T> {
        if (this._entityClasses.has(BaseClass))
            return <IEntity<T>>this._entityClasses.get(BaseClass)
        let schema = this
        let metaEntity = MetaEntity.get(BaseClass)
        let ClassEntity = class extends (<any>BaseClass) {
            Entity = new EntityController(schema, metaEntity, this)
            // @ts-ignore
            static get name() {
                return `Entity_${BaseClass.name}`
            }
        } as IEntity<T>
        this._entityClasses.set(BaseClass, ClassEntity)
        return ClassEntity
    }

    get Dialect(): typeof Dialect {
        if (this._Dialect)
            return this._Dialect
        return this._Dialect = <typeof Dialect>this.dialect.constructor
    }

    get entityClasses() {
        return this._entityClasses
    }

    get ddl(): Promise<boolean> {
        return this.dialect.syncSchema(this)
    }
}