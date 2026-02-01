export type FormData = {
  date: string;
  product: string;
  qty: number | '';
  price: number;
};

export type ProductOption = {
  value: string;
  label: string;
  price: number;
  icon: string;
  stock: number;
};

export type TransactionFormProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  editingId: string | null;
  resetForm: () => void;
  productOptions: ProductOption[];
  handleProductChange: (val: string) => void;
  total: number;
};
