export type ContactFormField = {
  id?: number;
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
};

export const defaultContactFields: ContactFormField[] = [
  { name: "name", label: "Your name", type: "text", required: true, maxLength: 100 },
  { name: "email", label: "Email address", type: "email", required: true, maxLength: 254 },
  { name: "message", label: "Your message", type: "textarea", required: true, maxLength: 5000 },
];
