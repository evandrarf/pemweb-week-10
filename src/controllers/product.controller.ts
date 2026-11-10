import type { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GET /products - Menampilkan seluruh data produk dari PostgreSQL
export async function getProducts(_req: Request, res: Response): Promise<void> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// GET /products/:id - Menampilkan detail produk berdasarkan ID
export async function getProductById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: 'ID produk tidak valid' });
    return;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({ message: 'produk tidak ditemukan' });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// POST /products - Membuat data produk baru ke PostgreSQL
export async function createProduct(req: Request, res: Response): Promise<void> {
  const { name, price } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ message: 'Nama produk wajib diisi' });
    return;
  }

  if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
    res.status(400).json({ message: 'Harga produk wajib berupa angka positif' });
    return;
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price: parseInt(price, 10),
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
