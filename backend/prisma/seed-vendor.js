
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const phone = '5511999998888'; // Vendor Phone

    console.log(`Creating/Updating Vendor ${phone}...`);

    // Upsert User
    const user = await prisma.user.upsert({
        where: { phone },
        update: { role: 'VENDOR' },
        create: {
            phone: phone,
            role: 'VENDOR',
        },
    });

    console.log(`User ${user.id} is VENDOR.`);

    // Upsert Preferences
    await prisma.recipientPreference.upsert({
        where: { userId: user.id },
        update: { makes: ['Volkswagen', 'Fiat'] },
        create: {
            userId: user.id,
            makes: ['Volkswagen', 'Fiat'],
            states: ['SP'],
        },
    });

    console.log('Vendor preferences set to [Volkswagen, Fiat].');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
