"use server"

import { Role } from "@/generated/prisma"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ApiResponse } from "@/lib/types"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function becameInstructor(planId: string): Promise<ApiResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    // ✅ Better session validation
    if (!session?.user?.id) {
      redirect(`/login?redirect=pricing&plan=${planId}`)
    }

    // ✅ Check if user is already an instructor
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (existingUser?.role === Role.CREATOR) {
      return {
        status: "success",
        message: "You're already an instructor! Welcome back."
      }
    }

    // ✅ Update user role to CREATOR
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role: Role.CREATOR,
        // ✅ You can add plan metadata here later
        // planId: planId,
        // planStartDate: new Date(),
      },
    })

    return {
      status: "success",
      message: "Welcome to EduFlow! You're now an instructor with the free plan."
    }
  } catch (error) {
    console.error("Error becoming instructor:", error)
    return {
      status: "error",
      message: "Something went wrong. Please try again."
    }
  }
}