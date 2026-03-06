export interface AdminEnquiryInterface {
  id: string;
  fname: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  city?: string; // Optional field
  preferredDate?: string;
  preferredTime?: string;
  location?: string;
  sourcePage?: string;
  meeting?: {
    meetLink?: string;
  };
  createdAt: Date;
  status: "pending" | "reviewed" | "resolved";
  notes?: string; // Optional field
}

export interface EnquireFormInterface {
  fname: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  city: string; // Added city
  preferredDate: string;
  preferredTime: string;
  location: string;
}
