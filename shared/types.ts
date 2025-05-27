// shared/types.ts
export interface Shop {
    id: string
    name: string
    shopType: string
    categories: Category[]
  }
  
  export interface Category {
    id: string
    name: string
    shopId: string
  }
  
  export interface Product {
    id: string
    name: string
    description?: string
    price: number
    image?: string
    attributes?: string
    categoryId: string
    shopId: string
    category?: Category
    shop?: Shop
  }
  