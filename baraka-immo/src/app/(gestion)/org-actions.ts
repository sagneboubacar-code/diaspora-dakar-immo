"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ORG_COOKIE } from "@/lib/session";

export async function switchOrg(fd: FormData) {
  const id = fd.get("org");
  if (typeof id === "string" && id) {
    cookies().set(ORG_COOKIE, id, { path: "/", httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
  }
  redirect("/tableau-de-bord");
}
