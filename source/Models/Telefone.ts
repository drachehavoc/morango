import { Schema } from "../Morango/Schema";
import { Pessoa } from "./Pessoa";

export class Telefone {
    @Schema.key()
    @Schema.field("FieldController", { type: 'int', size: undefined })
    id: number = 1

    @Schema.key()
    @Schema.field("FieldController", { type: 'int', size: undefined })
    id2: number = 1

    @Schema.link(Pessoa)
    pessoa?: Pessoa
}