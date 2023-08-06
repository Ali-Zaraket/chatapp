import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    author: v.string(),
    body: v.union(v.string(), v.null()),
    document: v.optional(v.union(v.string(), v.null())),
  }),
});
