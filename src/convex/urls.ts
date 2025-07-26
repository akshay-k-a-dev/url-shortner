import { v } from "convex/values";
import { mutation, query, internalQuery, internalMutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createUrl = mutation({
    args: {
        url: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUser(ctx);

        // Generate a short slug
        let slug = "";
        let isUnique = false;
        while (!isUnique) {
            slug = Math.random().toString(36).substring(2, 8);
            const existing = await ctx.db
                .query("shortenedUrls")
                .withIndex("by_slug", (q) => q.eq("slug", slug))
                .unique();
            if (!existing) {
                isUnique = true;
            }
        }


        await ctx.db.insert("shortenedUrls", {
            userId: user?._id,
            original: args.url,
            slug: slug,
            clicks: 0,
        });

        return slug;
    },
});

export const getUrl = internalQuery({
    args: {
        slug: v.string(),
    },
    handler: async (ctx, args) => {
        const url = await ctx.db
            .query("shortenedUrls")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();

        return url;
    },
});

export const incrementClicks = internalMutation({
    args: {
        urlId: v.id("shortenedUrls"),
    },
    handler: async (ctx, args) => {
        const url = await ctx.db.get(args.urlId);
        if (url) {
            await ctx.db.patch(url._id, { clicks: url.clicks + 1 });
        }
    },
});


export const getUrlsForUser = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUser(ctx);

        if (!user) {
            return [];
        }

        return await ctx.db
            .query("shortenedUrls")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();
    },
});