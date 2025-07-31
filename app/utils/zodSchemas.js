import { z } from "zod";

export const logInSchemaZod = z.object({
  username: z
    .string()
    .min(6, { message: "Ime mora imati bar 6 karaktera" })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Lozinka mora imati bar 8 karaktera" })
    .trim(),
});
export const infoSchemaZod = z.object({
  name: z
    .string()
    .min(2, "Naziv mora imati bar 2 karaktkera")
    .max(50, "Naziv ima maksimalno 50 karatktera")
    .regex(/^[\p{L}\p{N}\s.,\/-]+$/u, "Naziv sadrži nedozvoljene karaktere"),
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

export const categorySchemaZod = z.object({
  name: z
    .string()
    .min(2, "Naziv mora imati bar 2 karaktkera")
    .max(50, "Naziv ima maksimalno 50 karatktera")
    .regex(/^[\p{L}\p{N}\s.,\/-]+$/u, "Naziv sadrži nedozvoljene karaktere"),
});

export const itemsSchemaZod = z.object({
  name: z
    .string()
    .min(2, "Naziv mora imati bar 2 karaktkera")
    .max(50, "Naziv ima maksimalno 50 karatktera")
    .regex(/^[\p{L}\p{N}\s.,\/-]+$/u, "Naziv sadrži nedozvoljene karaktere"),
  description: z
    .string()
    .min(10, "Opis mora imati najmanje 10 karaktera")
    .max(300, "Opis može imati najviše 300 karaktera")
    .regex(/^[\p{L}\p{N}\s.,\/-]+$/u, "Opis sadrži nedozvoljene karaktere")
    .optional()
    .or(z.literal("")),

  basePrice: z
    .string()
    .regex(/^(\d+([.,]\d{1,2})?)$/, "Cena mora biti validan broj")
    .refine(
      (val) => {
        const parsed = parseFloat(val.replace(",", "."));
        return parsed >= 0.5 && parsed <= 9999.99;
      },
      { message: "Cena mora biti između 0.5 i 9999.99 RSD" }
    ),

  categoryId: z.string().min(1, "Morate izabrati kategoriju"),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1, "Veličina ne sme biti prazna"),
        price: z
          .string()
          .regex(/^\d+$/, "Cena mora biti ceo broj")
          .refine((val) => parseInt(val, 10) >= 0, {
            message: "Cena ne sme biti negativna",
          }),
      })
    )
    .optional(),
  addons: z
    .array(
      z.object({
        name: z.string().min(1, "Naziv mora biti popunjen"),
        price: z
          .string()
          .regex(/^\d+$/, "Cena mora biti ceo broj")
          .refine((val) => parseInt(val, 10) >= 0, {
            message: "Cena ne sme biti negativna",
          }),
        active: z.boolean(),
      })
    )
    .optional(),
});
