"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { LogOutIcon, UserCircle, CreditCard, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast" // Use your custom toast hook

interface NavUserProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function NavUser({ user }: NavUserProps) {
  const { toast, loading: showLoadingToast, dismiss } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    
    // 1. Show an immediate loading toast
    const toastId = showLoadingToast("កំពុងចាកចេញ...", "សូមរង់ចាំមួយភ្លែត")

    try {
      // 2. Perform the sign out
      // redirect: true is default, but we can set callbackUrl
      await signOut({ callbackUrl: "/login" })
      
      // 3. Optional success toast (might only show briefly before redirect)
      toast({
        title: "ចាកចេញជោគជ័យ",
        description: "សូមអរគុណ និងជួបគ្នាពេលក្រោយ!",
        variant: "success"
      })
    } catch (error) {
      dismiss(toastId)
      setIsLoggingOut(false)
      toast({
        title: "មានបញ្ហា",
        description: "មិនអាចចាកចេញបានទេ សូមព្យាយាមម្ដងទៀត",
        variant: "destructive"
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full focus-visible:ring-blue-500"
          disabled={isLoggingOut}
        >
          <Avatar className="h-9 w-9 border-2 border-transparent hover:border-blue-200 transition-all">
            <AvatarImage src={user.image || '/image.png'} alt={user.name || "Profile"} />
            <AvatarFallback className="bg-blue-500 text-white">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="min-w-64 rounded-xl p-2 shadow-xl" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex items-center gap-3 px-1 py-1.5 text-left">
            <Avatar className="h-10 w-10 rounded-lg">
              <AvatarImage src={user.image || '/image.png'} alt={user.name || "Profile"} />
              <AvatarFallback className="rounded-lg bg-slate-100">
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-sm leading-tight">
              <span className="truncate font-semibold text-slate-900">{user.name}</span>
              <span className="truncate text-xs text-slate-500">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="my-1" />
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer rounded-md py-2 px-3 focus:bg-blue-50 focus:text-blue-600">
            <UserCircle className="mr-2 size-4" /> 
            <span>គណនី</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-md py-2 px-3 focus:bg-blue-50 focus:text-blue-600">
            <CreditCard className="mr-2 size-4" /> 
            <span>ការទូទាត់</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="my-1" />
        
        <DropdownMenuItem 
          className="cursor-pointer rounded-md py-2 px-3 text-red-600 focus:bg-red-50 focus:text-red-700 font-medium" 
          onSelect={(e) => {
            e.preventDefault() // Prevent menu from closing immediately
            handleSignOut()
          }}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <LogOutIcon className="mr-2 size-4" />
          )}
          <span>ចាកចេញ</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}