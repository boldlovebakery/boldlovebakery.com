import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) => z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean(),
    showShopLink: z.boolean().default(true),
    featureImage: image().optional(),
    featureImageAlt: z.string().trim().min(1).optional(),
  }).refine((post) => !post.featureImage || Boolean(post.featureImageAlt), {
    message: "A feature image requires meaningful alternative text.",
    path: ["featureImageAlt"],
  }),
});

export const collections = { blog };
