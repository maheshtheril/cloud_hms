export async function seedGeography() {
    const india = await prisma.countries.upsert({
        where: { iso2: 'IN' },
        update: {},
        create: {
            iso2: 'IN',
            iso3: 'IND',
            name: 'India',
            flag: '🇮🇳',
            region: 'Asia',
        }
    });

    const karnataka = await prisma.country_subdivision.create({
        data: {
            country_id: india.id,
            name: 'Karnataka',
            type: 'state',
        }
    });

    await prisma.country_subdivision.create({
        data: {
            country_id: india.id,
            parent_id: karnataka.id,
            name: 'Kalaburgi',
            type: 'district',
        }
    });
}
