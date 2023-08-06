import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").order("asc").take(100);
    return Promise.all(
      messages.map(async (m) => {
        return {
          ...m,
          ...(m.document
            ? { document: await ctx.storage.getUrl(m.document) }
            : {}),
        };
      })
    );
  },
});

export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, { body, author }) => {
    await ctx.db.insert("messages", { body, author, document: null });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendImage = mutation({
  args: { body: v.string(), author: v.string(), document: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      body: args.body,
      author: args.author,
      document: args.document,
    });
  },
});
