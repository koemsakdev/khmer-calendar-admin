"use client";

import { useEffect } from "react";
import { useBreadcrumbStore, type BreadcrumbItem } from "@/stores/breadcrumb-store";

export const useBreadcrumb = () => {
  return useBreadcrumbStore((state) => state.items);
};

export const useSetBreadcrumb = (items: BreadcrumbItem[]) => {
  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);

  useEffect(() => {
    setBreadcrumb(items);
    return () => {
      useBreadcrumbStore.getState().resetBreadcrumb();
    };
  }, [items, setBreadcrumb]);
};
