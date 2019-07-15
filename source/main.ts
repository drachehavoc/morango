import { PessoaDoida } from "./Models/PessoaDoida";
import { Dialect } from "./Morango/Dialect";
import { Schema } from "./Morango/Schema";

export const schema = new class extends Schema {
    readonly dialect = new Dialect()
    Pessoa = this.getEntityClass(PessoaDoida)
}

let pessoa = new schema.Pessoa();

schema.ddl