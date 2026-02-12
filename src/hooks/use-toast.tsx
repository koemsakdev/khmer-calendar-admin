"use client";

import { toast } from "sonner";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

type ToastVariant = "default" | "destructive" | "success" | "info" | "warning";

interface AppToastOptions {
  variant?: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

export function useToast() {
  const showToast = ({
    variant = "default",
    title,
    description,
    duration = 4000,
  }: AppToastOptions) => {
    
    switch (variant) {
      case "destructive":
        return toast.custom((t) => (
          <div className="flex items-center gap-4 bg-[#FFD5D5] p-5 rounded-[22px] shadow-lg min-w-87.5 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="shrink-0 bg-white rounded-full shadow-sm">
              <XCircle className="w-12 h-12 text-[#E54D4D] fill-[#E54D4D] stroke-white stroke-[2px]" />
            </div>
            
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[17px] font-semibold text-slate-900 leading-tight">
                {title}
              </h3>
              {description && (
                <p className="text-[15px] text-slate-600 font-medium">
                  {description}
                </p>
              )}
            </div>
          </div>
        ), { duration });

      case "success":
        return toast.custom((t) => (
          <div className="flex items-center gap-4 bg-[#DCFCE7] p-5 rounded-[22px] shadow-lg min-w-87.5">
            <div className="shrink-0 bg-white rounded-full shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-[#10B981] fill-[#10B981] stroke-white stroke-[2px]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[17px] font-semibold text-slate-900 leading-tight">{title}</h3>
              {description && <p className="text-[15px] text-slate-600 font-medium">{description}</p>}
            </div>
          </div>
        ), { duration });

      default:
        return toast(title, { description, duration });
    }
  };

  const loading = (title: string, description?: string) =>
    toast.loading(title, {
      description,
      className: "rounded-[22px] p-5 shadow-lg min-w-[350px] bg-white border-none",
      icon: <Loader2 className="animate-spin w-6 h-6 text-blue-500" />,
    });

  const apiError = (err: any) => {
    const message = err?.response?.data?.message || err?.message || "Something went wrong";
    showToast({
      variant: "destructive",
      title: "Error",
      description: message,
    });
  };

  return {
    toast: showToast,
    loading,
    apiError,
    dismiss: (id?: string | number) => toast.dismiss(id),
  };
}