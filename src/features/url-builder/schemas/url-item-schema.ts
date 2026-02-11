import { z } from "zod/v4";

export const urlItemFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  description: z.string(),
  value: z.string().min(1, "값을 입력해주세요"),
});

export type UrlItemFormValues = z.infer<typeof urlItemFormSchema>;
