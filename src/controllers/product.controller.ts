import type { Request, Response } from 'express';

export interface Product {
  id: number;
  name: string;
  price: number;
}

export const initialProducts: Product[] = [
  { id: 1, name: 'Buku', price: 15000 },
  { id: 2, name: 'Pulpen', price: 5000 },
];

export let products: Product[] = [...initialProducts];

export function resetProducts(): void {
  products = [...initialProducts];
}

export function getProducts(_req: Request, res: Response): void {
  res.status(200).json(products);
}

export function getProductById(req: Request, res: Response): void {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ message: 'ID produk harus berupa angka' });
    return;
  }

  const product = products.find((item) => item.id === id);

  if (!product) {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
    return;
  }

  res.status(200).json(product);
}

export function createProduct(req: Request, res: Response): void {
  const { name, price } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ message: 'Nama produk wajib diisi' });
    return;
  }

  if (price === undefined || price === null || isNaN(Number(price))) {
    res.status(400).json({ message: 'Harga produk harus berupa angka' });
    return;
  }

  const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

  const newProduct: Product = {
    id: newId,
    name: name.trim(),
    price: Number(price),
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
}
