## Fase I (statica) - Decorators para campos de entidade
- [x] Ao aplicar um decorator de campo
  - [x] busca o objeto EntityMetadata da classe base
    - [x] caso não exista cria um novo, passando como parâmetro a própria classe base 
    - [x] cria uma lista de nomes das possiveis chaves primárias
    - [x] cria uma lista de metadados para futura criação dos FieldControllers, esta lista é ordenanda por nome dos campos da classe base e contém os parâmentros para a construção do FieldController e a classe construtora do FieldController.
  - [x] adiciona ao objeto EntityMetadata da classe um novo item na lista de metadados para futura contrução de dos FieldControllers da classe, os metadados armazenados na lista que é ordenada pelo proprio nome do campo são: parâmetros para construção e a classe para contrução de um novo FieldController, estes metadados são armazenados para a criação dos FieldControllers na *Fase II*

## Fase II - Cria FieldControllers e adiciona getters e setter para os mesmos
- [x] É preciso estender a classe Abstrata Schema e definir um objeto do tipo Dialect para o attributo abstrato dialect
- [x] É preciso instanciar um objeto desta classe
- [ ] Ao executar o método Schema.getEntityClass, informando uma classe base como entidade, é retornada uma nova classe viculada ao objeto Schema criado que estende a classe base, porém com os FieldControllers já instanciados e já viculados aos campos da classe através de getters e setters