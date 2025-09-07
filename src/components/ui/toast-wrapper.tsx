
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export const showSuccessToast = (title: string, description?: string) => {
  const { toast } = useToast();
  toast({
    title,
    description,
    duration: 3000,
    className: "bg-green-900 border-green-700 text-green-100",
  });
};

export const showErrorToast = (title: string, description?: string) => {
  const { toast } = useToast();
  toast({
    title,
    description,
    duration: 5000,
    variant: "destructive",
    className: "bg-red-900 border-red-700 text-red-100",
  });
};

export const showInfoToast = (title: string, description?: string) => {
  const { toast } = useToast();
  toast({
    title,
    description,
    duration: 4000,
    className: "bg-blue-900 border-blue-700 text-blue-100",
  });
};
