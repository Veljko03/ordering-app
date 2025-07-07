import { z } from "zod";

export const infoSchemaZod = z.object({
  name: z
    .string()
    .min(2, "Naziv mora imati bar 2 karatkera")
    .max(50, "Naziv ima maksimalno 50 karatktera")
    .regex(
      /^[a-zA-Z0-9\s\-'&čćžšđČĆŽŠĐ]+$/,
      "Naziv sadrži nedozvoljene karaktere"
    ),
  logoUrl: z.string().url("Logo mora biti validan URL").optional(),

  contactPhone: z
    .string()
    .min(6, "Telefon mora imati bar 6 karaktera")
    .max(20, "Telefon može imati najviše 20 karaktera")
    .regex(
      /^[0-9+\s()\/-]+$/,
      "Telefon može sadržati samo brojeve, +, razmake, ( ), / i -"
    ),

  adress: z
    .string()
    .min(5, "Adresa mora imati bar 5 karaktera")
    .max(100, "Adresa može imati najviše 100 karaktera")
    .regex(/^[\p{L}\p{N}\s.,\/-]+$/u, "Adresa sadrži nedozvoljene karaktere"),

  email: z.string().email("Unesite validnu email adresu"),

  social: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
  }),

  theme: z.object({
    navbarColor: z.string().optional(),
    textColor: z.string().optional(),
    font: z.string().optional(),
  }),
});
