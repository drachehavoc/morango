import { IFieldControllerConfig } from "./d";

/**
 * Responsavel por gerenciar cada campo setada com Schema.field, dentre suas
 * atribuições está formatação correta de conteúdo para o banco de dados,
 * formatação correta de informações do banco de dados para o javascript,
 * definição do campo no banco de dados etc
 * 
 */
export class FieldController {
    protected rawValue: any = null

    constructor(
        readonly config: IFieldControllerConfig
    ) { }

    get() {
        return this.rawValue
    }

    set(v: any) {
        this.rawValue = v
    }
}