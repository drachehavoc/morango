import { Schema } from "../Morango/Schema";
import { Telefone } from "./Telefone";

export class Pessoa {
    @Schema.key()
    @Schema.field("FieldController", {})
    id: number = 1

    @Schema.field("FieldController")
    nome: string = "Dunha"

    @Schema.foreign(Telefone)
    telefone?: Telefone

    // @Schema.foreign(Pessoa)
    // pessoa?: Pessoa

    // @Schema.foreign(Pessoa)
    // pessoaZika?: Pessoa
}