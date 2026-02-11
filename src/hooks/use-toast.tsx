import { toast } from "sonner";
import { CheckCircle2, XCircle, Info, Loader2 } from "lucide-react";

type ToastVariant = "default" | "destructive" | "success" | "info";

interface AppToastOptions {
  variant?: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export function useToast() {
  const showToast = ({
    variant = "default",
    title,
    description,
    duration = 4000,
    actionLabel,
    onAction,
  }: AppToastOptions) => {
    const baseOptions = {
      description,
      duration,
      action:
        actionLabel && onAction
          ? {
              label: actionLabel,
              onClick: onAction,
            }
          : undefined,
    };

    switch (variant) {
      case "destructive":
        toast.error(title, {
          ...baseOptions,
          icon: <XCircle className="text-red-500 w-5 h-5" />,
        });
        break;

      case "success":
        toast.success(title, {
          ...baseOptions,
          icon: <CheckCircle2 className="text-green-500 w-5 h-5" />,
        });
        break;

      case "info":
        toast(title, {
          ...baseOptions,
          icon: <Info className="text-blue-500 w-5 h-5" />,
        });
        break;

      default:
        toast(title, baseOptions);
    }
  };

  const loading = (title: string, description?: string) =>
    toast.loading(title, {
      description,
      icon: <Loader2 className="animate-spin w-5 h-5" />,
    });

  const dismiss = (id?: string | number) => toast.dismiss(id);

  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  };

  const apiError = (err: any) => {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong";

    showToast({
      variant: "destructive",
      title: "Request Failed",
      description: message,
    });
  };

  return {
    toast: showToast,
    loading,
    promise,
    dismiss,
    apiError,
  };
}
