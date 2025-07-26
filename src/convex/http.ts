import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/s/:slug",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const slug = url.pathname.split("/")[2];

    if (!slug) {
        return new Response("Missing slug", { status: 400 });
    }

    const record = await ctx.runQuery(internal.urls.getUrl, { slug });

    if (record) {
      await ctx.runMutation(internal.urls.incrementClicks, { urlId: record._id });
      return new Response(null, {
        status: 302,
        headers: {
          Location: record.original,
        },
      });
    }

    return new Response("Not found", {
      status: 404,
    });
  }),
});

// This is required for Convex to pick up the routes.
export default http;