import { IFieldControllerConfig } from "./d";

/**
 * Responsavel por gerenciar cada campo setada com Schema.field, dentre suas
 * atribuições está formatação correta de conteúdo para o banco de dados,
 * formatação correta de informações do banco de dados para o javascript,
 * definição do campo no banco de dados etc
 * 
 */
export class FieldController {
    //
    // STATIC
    //

    protected static configDefaults: Partial<IFieldControllerConfig> = {
        key: false,
        nil: true,
        size: 255,
    }

    protected static configConstants: Partial<IFieldControllerConfig> = {
        type: 'VARCHAR',
        serial: false,
    }

    protected static _config: IFieldControllerConfig

    static get config(): IFieldControllerConfig {
        return this._config || (this._config = Object.freeze({
            ... this.configDefaults,
            ... this.configConstants
        }))
    }

    static custom(config: IFieldControllerConfig) {
        return class extends this {
            protected static configDefaults = config
        }
    }

    //
    // INSTANCE
    //

    protected rawValue: any = null

    readonly config: IFieldControllerConfig = (<typeof FieldController>this.constructor).config

    get() {
        return this.rawValue
    }

    set(v: any) {
        this.rawValue = v
    }
}