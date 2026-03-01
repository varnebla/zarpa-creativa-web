import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/servicios' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string(),
    icon: z.string().optional(),
    order: z.number().default(0),
    intro: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    items: z
      .array(
        z.object({
          titulo: z.string(),
          descripcion: z.string(),
        })
      )
      .optional(),
    proceso: z
      .array(
        z.object({
          titulo: z.string(),
          descripcion: z.string(),
        })
      )
      .optional(),
    faqs: z
      .array(
        z.object({
          pregunta: z.string(),
          respuesta: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { blog, servicios };
