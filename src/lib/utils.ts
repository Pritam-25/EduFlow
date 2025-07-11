import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractErrorMessage(error: unknown, fallback = "Something went wrong."){
  if(axios.isAxiosError(error) && error.response?.data?.error){
    return error.response.data.error;
  }
  return fallback;
}