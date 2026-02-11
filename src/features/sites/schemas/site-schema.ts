import { z } from "zod/v4";

export const siteFormSchema = z.object({
  name: z.string().min(1, "사이트 이름을 입력해주세요"),
  description: z.string(),
});

export type SiteFormValues = z.infer<typeof siteFormSchema>;
