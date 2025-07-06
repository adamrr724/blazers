// Promote User to Admin Script
// Run with: npx tsx promote-admin.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function promoteToAdmin() {
  const email = process.argv[2]

  if (!email) {
    console.log('Usage: npx tsx promote-admin.ts <email>')
    console.log('Example: npx tsx promote-admin.ts user@example.com')
    process.exit(1)
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })

    console.log(`✅ User promoted to admin:`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Role: ${user.role}`)
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.log('❌ Error: User with this email not found')
    } else {
      console.log('❌ Error promoting user:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

promoteToAdmin()
