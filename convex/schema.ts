import { authTables } from '@convex-dev/auth/server'
import { defineSchema } from 'convex/server'

const schema = defineSchema(
  {
    ...authTables,
    // your other tables...
  },
  {
    strictTableNameTypes: false,
  }
)

export default schema
