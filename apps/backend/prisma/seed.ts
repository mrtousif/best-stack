import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    [...Array(5).keys()].map(async (_item) => {
        const newUser = await prisma.users.create({
            data: {
                email: faker.internet.email(),
                name: faker.name.findName(),
                phone: faker.phone.number(),
                channel_name: faker.random.word(),
                description: faker.random.words(5),
            },
        });

        await prisma.videos.create({
            data: {
                stream_url: faker.internet.url(),
                channel_id: newUser.id,
                thumbnail: faker.image.nature(),
                title: faker.random.words(5),
            },
        });
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
