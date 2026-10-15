import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  // list public if GET, require merchant for POST
  if (req.method === "GET") {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    if (!session?.user?.email) return res.status(401).json({ error: "Unauthorized" });

    // check user role
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.role !== "merchant") return res.status(403).json({ error: "Forbidden" });

    const { name, slug, description, price, image } = req.body;
    if (!name || !slug || !price) return res.status(400).json({ error: "Missing fields" });

    const created = await prisma.product.create({
      data: { name, slug, description, price: Number(price), image }
    });

    return res.status(201).json(created);
  }

  return res.status(405).end();
}
