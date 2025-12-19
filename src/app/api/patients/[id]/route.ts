'use server'

import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const patient = await prisma.hms_patient.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                dob: true,
                gender: true,
                contact: true
            }
        })

        if (!patient) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
        }

        // Calculate age from DOB
        let age = null
        if (patient.dob) {
            const today = new Date()
            const birthDate = new Date(patient.dob)
            age = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--
            }
        }

        return NextResponse.json({
            patient: {
                ...patient,
                age
            }
        })
    } catch (error) {
        console.error('Error fetching patient:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
