import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { contactInputSchema, contactStatuses } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  const status = request.nextUrl.searchParams.get("status");

  if (status && !contactStatuses.includes(status as (typeof contactStatuses)[number])) {
    return NextResponse.json({ error: "Unsupported status" }, { status: 400 });
  }

  const contacts = await prisma.contact.findMany({
    where: {
      ...(status ? { status: status as (typeof contactStatuses)[number] } : {}),
      ...(query ? {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { company: { contains: query, mode: "insensitive" } },
        ],
      } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
  const parsed = contactInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid contact", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const contact = await prisma.contact.create({ data: parsed.data });
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "A contact with this email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to create contact" }, { status: 500 });
  }
}
