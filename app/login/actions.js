"use server";

import { logInSchemaZod } from "../utils/zodSchemas";
import { errors } from "jose";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

const testUser = {
  id: "1",
  username: "marko123",
  password: "marko123",
};
export async function login(prevState, formData) {
  const result = logInSchemaZod.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { username, password } = result.data;
  if (username != testUser.username || password != testUser.password) {
    return {
      errors: {
        username: ["Neispravano ime ili lozinka"],
      },
    };
  }

  await createSession(testUser.id);

  redirect("/admin/buisnessInfo");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
