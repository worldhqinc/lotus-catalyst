'use server';

import { addToCartBySku } from './add-to-cart-by-sku';

export async function addToCartBySkuForm(formData: FormData) {
  await addToCartBySku({ lastResult: null }, formData);
}
