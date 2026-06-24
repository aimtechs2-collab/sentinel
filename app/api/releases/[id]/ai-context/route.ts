import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/api";
import { buildDbRiskAgentContext } from "@/lib/db-ai-context";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireRole("readonly");
  if (error) return error;

  const context = await buildDbRiskAgentContext(prisma, params.id);
  if (!context) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(context);
}
