import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    const product = await prisma.product.findUnique({ where: { id: String(id) } });
    if (!product) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(product);
  }

  // Mutations require merchant
  if (!session?.user?.email) return res.status(401).json({ error: "Unauthorized" });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "merchant") return res.status(403).json({ error: "Forbidden" });

  if (req.method === "PUT") {
    const { name, slug, description, price, image } = req.body;
    const updated = await prisma.product.update({
      where: { id: String(id) },
      data: { name, slug, description, price: price ? Number(price) : undefined, image }
    });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.product.delete({ where: { id: String(id) } });
    return res.status(204).end();
  }

  return res.status(405).end();
}
