import { Pessoa } from "./Models/Pessoa";
import { Schema } from "./Morango/Schema";
import { Dialect } from "./Morango/Dialect";
import { Telefone } from "./Models/Telefone";


let schema = new class extends Schema {
    dialect = new Dialect({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'delme'
    })
    Pessoa = this.getEntityClass(Pessoa)
    // Pessoa2 = this.getEntityClass(Pessoa)
    Telefone = this.getEntityClass(Telefone)
}


schema.ddl.then(() => {
    let x = new schema.Pessoa()
    x.nome = 'Daniel'
    x.telefone = new schema.Telefone()
    console.log(x.nome)
    x.Entity.save()
})

