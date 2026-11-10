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

// PUT /products atau PUT /products/:id - Mengupdate data produk yang sudah ada
export async function updateProduct(req: Request, res: Response): Promise<void> {
  const rawId = req.body.id ?? req.params.id;
  const id = Number(rawId);
  const { name, price } = req.body;

  if (!rawId || isNaN(id) || id <= 0) {
    res.status(400).json({ message: 'ID produk wajib diisi dan berupa angka valid' });
    return;
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ message: 'Nama produk wajib diisi' });
    return;
  }

  if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
    res.status(400).json({ message: 'Harga produk wajib berupa angka positif' });
    return;
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ message: 'produk tidak ditemukan' });
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        price: parseInt(price, 10),
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// DELETE /products/:id atau DELETE /products - Menghapus data produk berdasarkan ID
export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const rawId = req.params.id ?? req.body?.id;
  const id = Number(rawId);

  if (!rawId || isNaN(id) || id <= 0) {
    res.status(400).json({ message: 'ID produk wajib diisi dan berupa angka valid' });
    return;
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ message: 'produk tidak ditemukan' });
      return;
    }

    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      message: 'Produk berhasil dihapus',
      product: deletedProduct,
    });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
