"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPreset,
  deletePreset,
  getAllPresets,
  getFavoritePresets,
  getPresetById,
  getPresetsBySiteId,
  updatePreset,
} from "@/lib/db/repositories/preset-repository";
import type { Preset } from "@/types/preset";

const PRESETS_KEY = ["presets"] as const;
const FAVORITES_KEY = ["presets", "favorites"] as const;

/** 모든 프리셋 조회 */
export function usePresets() {
  return useQuery({
    queryKey: PRESETS_KEY,
    queryFn: getAllPresets,
  });
}

/** 사이트별 프리셋 조회 */
export function usePresetsBySiteId(siteId: string) {
  return useQuery({
    queryKey: ["presets", "site", siteId],
    queryFn: () => getPresetsBySiteId(siteId),
    enabled: !!siteId,
  });
}

/** 단일 프리셋 조회 */
export function usePreset(id: string | null) {
  return useQuery({
    queryKey: ["presets", id],
    queryFn: () => getPresetById(id as string),
    enabled: !!id,
  });
}

/** 즐겨찾기 프리셋만 조회 */
export function useFavorites() {
  return useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: getFavoritePresets,
  });
}

/** 프리셋 생성 */
export function useCreatePreset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPreset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRESETS_KEY });
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
  });
}

/** 프리셋의 즐겨찾기 상태를 토글합니다 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (preset: Preset) =>
      updatePreset({
        ...preset,
        isFavorite: !preset.isFavorite,
        updatedAt: new Date().toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRESETS_KEY });
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
  });
}

/** 프리셋 업데이트 */
export function useUpdatePreset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePreset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRESETS_KEY });
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
  });
}

/** 프리셋 삭제 */
export function useDeletePreset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePreset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRESETS_KEY });
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
  });
}
