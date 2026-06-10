import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getPublishedArticles, getArticleBySlug, getArticlesByCategory, getAllCategories, getCategoryBySlug, getAuthorById, getAllAuthors } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  articles: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(10), offset: z.number().default(0) }))
      .query(({ input }) => getPublishedArticles(input.limit, input.offset)),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => getArticleBySlug(input.slug)),
    byCategory: publicProcedure
      .input(z.object({ categoryId: z.number(), limit: z.number().default(10) }))
      .query(({ input }) => getArticlesByCategory(input.categoryId, input.limit)),
  }),
  categories: router({
    list: publicProcedure.query(() => getAllCategories()),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => getCategoryBySlug(input.slug)),
  }),
  authors: router({
    list: publicProcedure.query(() => getAllAuthors()),
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getAuthorById(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
