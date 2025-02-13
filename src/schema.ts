import {
  createSchema,
  definePermissions,
  Row,
  table,
  string,
  boolean,
} from "@rocicorp/zero";


const task = table("task")
  .columns({
    id: string(),
    orderId: string(),
    text: string(),
    completed: boolean(),
  })
  .primaryKey("id");

export const schema = createSchema(1, {
  tables: [task],
  relationships: [],
});

export type Schema = typeof schema;
export type Task = Row<typeof schema.tables.task>;

export const permissions = definePermissions(schema, () => ({}));

