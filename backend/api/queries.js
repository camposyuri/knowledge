module.exports = {
  categoryWithChildren: `
    WITH RECURSIVE subcategories (id) AS (
      SELECT id FROM categories WHERE id = ?
      UNION ALL
      SELECT c.id FROM subcategories, categories c
      WHERE "parentId" = subcategories.id
    )
    SELECT id FROM subcategories
  `,
};

/**GERANDO UM TABELA TEMPORARIA DE FORMA RECURSIVA
 * A PARTIR DO PAI ELE PEGA O FILHO
 * A PARTIR DO FILHO ELE PEGA O FILHO DO FILHO
 */
// Vai me retornar o ID da propria categoria que passei por parametro
// União com o ID da subcategoria fazendo um JOIN com a tabela de categoria
// No qual o "parentId" vai ser igual ao da subcategoria.id
