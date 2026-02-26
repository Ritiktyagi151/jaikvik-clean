// src/interfaces/blogInterface.ts

export interface blogInterface {
  _id?: string;          // Backend MongoDB ID
  id: string;            // Slug/Frontend ID
  slug?: string;
  category: string;
  author: string;
  date?: string;         
  
  // ✅ Isse optional (?) kar dein taaki static data fail na ho
  createdAt?: string;    

  title: string;
  description: string;
  summary?: string;
  image: string;
  content?: string;
  locked?: boolean;      // Admin lock status
  status?: string;       // published/draft
}