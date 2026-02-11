import { z } from "zod/v4";

const optionSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "이름을 입력해주세요"),
  value: z.string().min(1, "값을 입력해주세요"),
});

const pathSegmentSchema = z.object({
  id: z.string(),
  type: z.enum(["static", "dynamic"]),
  label: z.string().min(1, "이름을 입력해주세요"),
  value: z.string().optional(),
  options: z.array(optionSchema).optional(),
});

const queryParamSchema = z.object({
  id: z.string(),
  key: z.string().min(1, "키를 입력해주세요"),
  label: z.string().min(1, "이름을 입력해주세요"),
  options: z.array(optionSchema).optional(),
});

export const siteFormSchema = z.object({
  name: z.string().min(1, "사이트 이름을 입력해주세요"),
  protocol: z.enum(["http", "https"]),
  domain: z.string().min(1, "도메인을 입력해주세요"),
  subdomains: z.array(optionSchema),
  pathSegments: z.array(pathSegmentSchema),
  queryParams: z.array(queryParamSchema),
});

export type SiteFormValues = z.infer<typeof siteFormSchema>;
