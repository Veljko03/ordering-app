"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";
export function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <form
      action={loginAction}
      className="flex max-w-[300px] flex-col gap-2 bg-black"
    >
      <div className="flex flex-col gap-2">
        <input id="username" name="username" placeholder="username" />
      </div>
      {state?.errors?.username && (
        <p className="text-red-500">{state.errors.username}</p>
      )}

      <div className="flex flex-col gap-2">
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
        />
      </div>
      {state?.errors?.password && (
        <p className="text-red-500">{state.errors.password}</p>
      )}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      Login
    </button>
  );
}
