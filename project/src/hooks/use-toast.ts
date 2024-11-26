import { useToast as useToastOriginal } from "@/components/ui/use-toast"

export const useToast = () => {
  const { toast } = useToastOriginal()
  return { toast }
}