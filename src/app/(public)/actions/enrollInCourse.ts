import { ApiResponse } from "@/lib/types";

export async function enrollInCourse(): Promise<ApiResponse>{
  try {

    
    return {
      status: "success",
      message: "Successfully enrolled in the course.",
    }
    
  } catch (error) {
    return {
      status: "error",
      message: "Failed to enroll in the course.",
    }
  }
}