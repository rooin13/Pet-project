import { userSchema } from "@/entities/user/model/schema"
import { prisma } from "@/shared/lib/prisma/prisma"
import { use } from "i18next"
import { NextRequest, NextResponse } from "next/server"



export async function GET() {
    const users = await prisma.user.findMany()

    return NextResponse.json(users)
}



export async function POST(request: Request) {
    const json = await request.json()

    const data = userSchema.safeParse(json)
    if (!data.success) {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const user = await prisma.user.create({
        data: data.data,
    })

    return NextResponse.json(user)
}


