import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const players = [
  {
    name: "Deni Avdija",
    position: "Small Forward",
    jerseyNumber: "8",
    imageUrl: "/images/players/avdija.png",
    officialNickname: "The Deni"
  },
  {
    name: "Scoot Henderson",
    position: "Point Guard",
    jerseyNumber: "00",
    imageUrl: "/images/players/henderson.png",
    officialNickname: "Scoot"
  },
  {
    name: "Shaedon Sharpe",
    position: "Shooting Guard",
    jerseyNumber: "17",
    imageUrl: "/images/players/sharpe.png",
    officialNickname: null
  },
  {
    name: "Toumani Camara",
    position: "Small Forward",
    jerseyNumber: "33",
    imageUrl: "/images/players/camara.png",
    officialNickname: null
  },
  {
    name: "Jerami Grant",
    position: "Power Forward",
    jerseyNumber: "9",
    imageUrl: "/images/players/grant.png",
    officialNickname: null
  },
  {
    name: "Donovan Clingan",
    position: "Center",
    jerseyNumber: "23",
    imageUrl: "/images/players/clingan.png",
    officialNickname: null
  },
  {
    name: "Jrue Holiday",
    position: "Point Guard",
    jerseyNumber: "4",
    imageUrl: "/images/players/holiday.png",
    officialNickname: null
  },
  {
    name: "Matisse Thybulle",
    position: "Shooting Guard",
    jerseyNumber: "10",
    imageUrl: "/images/players/thybulle.png",
    officialNickname: null
  },
  {
    name: "Robert Williams III",
    position: "Center",
    jerseyNumber: "35",
    imageUrl: "/images/players/williams.png",
    officialNickname: "Timelord"
  },
  {
    name: "Hansen Yang",
    position: "Guard",
    jerseyNumber: "16",
    imageUrl: "/images/players/yang.png",
    officialNickname: null
  },
  {
    name: "Duop Reath",
    position: "Center",
    jerseyNumber: "26",
    imageUrl: "/images/players/reath.png",
    officialNickname: null
  },
  {
    name: "Kris Murray",
    position: "Small Forward",
    jerseyNumber: "25",
    imageUrl: "/images/players/murray.png",
    officialNickname: null
  },
  {
    name: "Ryan Rupert",
    position: "Shooting Guard",
    jerseyNumber: "50",
    imageUrl: "/images/players/rupert.png",
    officialNickname: null
  },
  {
    name: "Caleb Love",
    position: "Shooting Guard",
    jerseyNumber: "20",
    imageUrl: "/images/players/love.png",
    officialNickname: null
  },
  {
    name: "Sidy Cissoko",
    position: "Guard",
    jerseyNumber: "12",
    imageUrl: "/images/players/cissoko.png",
    officialNickname: null
  }
]

async function main() {
  console.log('Seeding database...')
  
  // Only create demo accounts in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Creating demo accounts for development...')
    
    // Hash passwords for demo users
    const adminPassword = await bcrypt.hash('admin123', 12)
    const userPassword = await bcrypt.hash('password', 12)
    
    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@blazers.com' },
      update: {},
      create: {
        email: 'admin@blazers.com',
        name: 'Admin',
        password: adminPassword,
        role: 'ADMIN'
      }
    })

    // Create test user
    const user = await prisma.user.upsert({
      where: { email: 'fan@blazers.com' },
      update: {},
      create: {
        email: 'fan@blazers.com',
        name: 'Trail Blazers Fan',
        password: userPassword,
        role: 'USER'
      }
    })
    
    console.log('Demo accounts created:', { admin: admin.email, user: user.email })
    
    // Create some sample nicknames in development
    const scoot = await prisma.player.findFirst({ where: { name: "Scoot Henderson" } })
    const shaedon = await prisma.player.findFirst({ where: { name: "Shaedon Sharpe" } })

    if (scoot) {
      await prisma.nickname.upsert({
        where: { 
          nickname_playerId: {
            nickname: "Scooter",
            playerId: scoot.id
          }
        },
        update: {},
        create: {
          nickname: "Scooter",
          playerId: scoot.id,
          suggestedBy: user.id,
          status: "APPROVED"
        }
      })
    }

    if (shaedon) {
      await prisma.nickname.upsert({
        where: { 
          nickname_playerId: {
            nickname: "The Cobra",
            playerId: shaedon.id
          }
        },
        update: {},
        create: {
          nickname: "The Cobra",
          playerId: shaedon.id,
          suggestedBy: user.id,
          status: "PENDING"
        }
      })
    }
  } else {
    console.log('Production mode: Skipping demo account creation')
  }

  // Create players
  for (const playerData of players) {
    await prisma.player.upsert({
      where: { 
        name: playerData.name
      },
      update: playerData,
      create: playerData
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
