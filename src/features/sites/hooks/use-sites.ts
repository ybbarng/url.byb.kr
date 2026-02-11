"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSite,
  deleteSite,
  getAllSites,
  getSiteById,
  updateSite,
} from "@/lib/db/repositories/site-repository";
import type { Site } from "@/types/site";

const SITES_KEY = ["sites"] as const;
const siteKey = (id: string) => [...SITES_KEY, id] as const;

/** 모든 사이트 목록 조회 */
export function useSites() {
  return useQuery({
    queryKey: SITES_KEY,
    queryFn: getAllSites,
  });
}

/** 단일 사이트 조회 */
export function useSite(id: string) {
  return useQuery({
    queryKey: siteKey(id),
    queryFn: () => getSiteById(id),
    enabled: !!id,
  });
}

/** 사이트 생성 */
export function useCreateSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITES_KEY });
    },
  });
}

/** 사이트 수정 */
export function useUpdateSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSite,
    onSuccess: (site: Site) => {
      queryClient.invalidateQueries({ queryKey: SITES_KEY });
      queryClient.invalidateQueries({ queryKey: siteKey(site.id) });
    },
  });
}

/** 사이트 삭제 (연관 프리셋도 함께 삭제) */
export function useDeleteSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITES_KEY });
      queryClient.invalidateQueries({ queryKey: ["presets"] });
    },
  });
}
