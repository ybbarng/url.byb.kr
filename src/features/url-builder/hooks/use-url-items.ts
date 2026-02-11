"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUrlItem,
  deleteUrlItem,
  getUrlItemsBySite,
  getUrlItemsBySiteAndCategory,
  updateUrlItem,
} from "@/lib/db/repositories/url-item-repository";
import type { UrlItem, UrlItemCategory } from "@/types/url-item";

const URL_ITEMS_KEY = ["url-items"] as const;
const urlItemsKey = (siteId: string) => [...URL_ITEMS_KEY, siteId] as const;
const urlItemsCategoryKey = (siteId: string, category: UrlItemCategory) =>
  [...URL_ITEMS_KEY, siteId, category] as const;

/** 특정 사이트의 모든 아이템 조회 */
export function useUrlItems(siteId: string) {
  return useQuery({
    queryKey: urlItemsKey(siteId),
    queryFn: () => getUrlItemsBySite(siteId),
    enabled: !!siteId,
  });
}

/** 특정 사이트의 특정 카테고리 아이템 조회 */
export function useUrlItemsByCategory(siteId: string, category: UrlItemCategory) {
  return useQuery({
    queryKey: urlItemsCategoryKey(siteId, category),
    queryFn: () => getUrlItemsBySiteAndCategory(siteId, category),
    enabled: !!siteId,
  });
}

/** UrlItem 생성 */
export function useCreateUrlItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUrlItem,
    onSuccess: (item: UrlItem) => {
      queryClient.invalidateQueries({ queryKey: urlItemsKey(item.siteId) });
      queryClient.invalidateQueries({
        queryKey: urlItemsCategoryKey(item.siteId, item.category),
      });
    },
  });
}

/** UrlItem 수정 */
export function useUpdateUrlItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUrlItem,
    onSuccess: (item: UrlItem) => {
      queryClient.invalidateQueries({ queryKey: urlItemsKey(item.siteId) });
      queryClient.invalidateQueries({
        queryKey: urlItemsCategoryKey(item.siteId, item.category),
      });
    },
  });
}

/** UrlItem 삭제 */
export function useDeleteUrlItem(siteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUrlItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: urlItemsKey(siteId) });
    },
  });
}
