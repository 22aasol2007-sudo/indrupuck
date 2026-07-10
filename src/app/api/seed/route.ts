import { NextResponse } from "next/server";
import { db } from "@/db";
import { clients, orders, tasks, users, requests } from "@/db/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

async function runSeed() {
  try {
    // Администратор: создаётся/обновляется под заданные данные (по умолчанию
    // 22aasol2007@gmail.com / 220310MartSol; можно переопределить через
    // env CRM_ADMIN_EMAIL / CRM_ADMIN_PASSWORD).
    const adminEmail =
      process.env.CRM_ADMIN_EMAIL?.toLowerCase() || "22aasol2007@gmail.com";
    const adminPassword = process.env.CRM_ADMIN_PASSWORD || "220310MartSol";
    const adminHash = await hash(adminPassword, 10);

    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail));

    if (existingAdmin) {
      await db
        .update(users)
        .set({ name: "Администратор", password: adminHash, role: "admin" })
        .where(eq(users.id, existingAdmin.id));
    } else {
      await db.insert(users).values({
        name: "Администратор",
        email: adminEmail,
        password: adminHash,
        role: "admin",
      });
    }

    // Демо-клиент для проверки личного кабинета (только на свежей БД)
    const demoClientEmail = "client@iru-pack.ru";
    const [demoClient] = await db
      .select()
      .from(clients)
      .where(eq(clients.email, demoClientEmail));
    if (!demoClient) {
      const dch = await hash("client12345", 10);
      const [dc] = await db
        .insert(clients)
        .values({
          name: "ООО Демо-клиент",
          email: demoClientEmail,
          phone: "+7 (495) 000-00-00",
          type: "company",
          password: dch,
        })
        .returning({ id: clients.id });
      await db.insert(requests).values([
        {
          clientId: dc.id,
          name: "ООО Демо-клиент",
          phone: "+7 (495) 000-00-00",
          email: demoClientEmail,
          packagingType: "boxes",
          volume: "1200",
          message: "Нужен расчёт на гофрокороба",
          status: "new",
        },
        {
          clientId: dc.id,
          name: "ООО Демо-клиент",
          phone: "+7 (495) 000-00-00",
          email: demoClientEmail,
          packagingType: "pallets",
          volume: "3000",
          message: "Паллетные контейнеры под заказ",
          status: "in_progress",
        },
      ]);
    }

    const existingClients = await db.select().from(clients);
    if (existingClients.length > 0) {
      return NextResponse.json(
        { message: "Database already seeded" },
        { status: 200 }
      );
    }

    const seededClients = await db
      .insert(clients)
      .values([
        {
          name: "ООО ПромТех",
          type: "company",
          email: "info@promtech.ru",
          phone: "+7 (495) 123-45-67",
          address: "г. Москва, ул. Промышленная, 15",
          contactPerson: "Иванов Иван Иванович",
          notes: "Крупный производитель электроники",
        },
        {
          name: "АО ФудПак",
          type: "company",
          email: "zakaz@foodpack.ru",
          phone: "+7 (812) 987-65-43",
          address: "г. Санкт-Петербург, пр. Невский, 100",
          contactPerson: "Петрова Анна Сергеевна",
          notes: "Сеть продуктовых магазинов",
        },
        {
          name: "ИП Смирнов Д.А.",
          type: "individual",
          email: "smirnov@mail.ru",
          phone: "+7 (903) 111-22-33",
          address: "г. Екатеринбург, ул. Ленина, 25",
          contactPerson: "Смирнов Дмитрий Александрович",
          notes: "Индивидуальный предприниматель",
        },
        {
          name: "ООО ЛогистикПро",
          type: "company",
          email: "manager@logisticpro.ru",
          phone: "+7 (495) 555-77-88",
          address: "г. Москва, ш. Энтузиастов, 50",
          contactPerson: "Козлов Сергей Петрович",
          notes: "Логистическая компания",
        },
        {
          name: "АО МедФарм",
          type: "company",
          email: "procurement@medfarm.ru",
          phone: "+7 (843) 444-33-22",
          address: "г. Казань, ул. Кремлевская, 10",
          contactPerson: "Галеева Мария Ивановна",
          notes: "Фармацевтическая компания",
        },
      ])
      .returning();

    const clientIds = seededClients.map((c) => c.id);

    await db.insert(orders).values([
      {
        clientId: clientIds[0],
        title: "Гофрокороба для электроники",
        description: "Трехслойные гофрокороба для упаковки электронных компонентов",
        status: "production",
        squareMeters: "1500.00",
        pricePerMeter: "450.00",
        totalAmount: "675000.00",
        deadline: "2025-02-15",
      },
      {
        clientId: clientIds[1],
        title: "Упаковка для продуктов",
        description: "Пятислойные гофрокороба для продуктов питания",
        status: "processing",
        squareMeters: "2500.00",
        pricePerMeter: "380.00",
        totalAmount: "950000.00",
        deadline: "2025-03-01",
      },
      {
        clientId: clientIds[2],
        title: "Коробки для переезда",
        description: "Стандартные гофрокороба для переезда офиса",
        status: "new",
        squareMeters: "1200.00",
        pricePerMeter: "320.00",
        totalAmount: "384000.00",
        deadline: "2025-02-28",
      },
      {
        clientId: clientIds[3],
        title: "Паллетные контейнеры",
        description: "Паллетные гофроконтейнеры для складского хранения",
        status: "ready",
        squareMeters: "3000.00",
        pricePerMeter: "520.00",
        totalAmount: "1560000.00",
        deadline: "2025-02-10",
      },
      {
        clientId: clientIds[4],
        title: "Стерильная упаковка",
        description: "Гофроупаковка с антибактериальным покрытием",
        status: "completed",
        squareMeters: "1800.00",
        pricePerMeter: "680.00",
        totalAmount: "1224000.00",
        deadline: "2025-01-20",
      },
      {
        clientId: clientIds[0],
        title: "Дополнительная партия коробов",
        description: "Вторая партия гофрокоробов для электроники",
        status: "new",
        squareMeters: "2000.00",
        pricePerMeter: "450.00",
        totalAmount: "900000.00",
        deadline: "2025-03-15",
      },
    ]);

    await db.insert(tasks).values([
      {
        title: "Согласовать макет упаковки",
        description: "Отправить макеты на согласование клиенту ООО ПромТех",
        status: "in_progress",
        priority: "high",
        clientId: clientIds[0],
        dueDate: "2025-02-05",
      },
      {
        title: "Подготовить коммерческое предложение",
        description: "Подготовить КП для АО ФудПак на новую партию",
        status: "pending",
        priority: "medium",
        clientId: clientIds[1],
        dueDate: "2025-02-10",
      },
      {
        title: "Доставка заказа",
        description: "Организовать доставку готового заказа ООО ЛогистикПро",
        status: "pending",
        priority: "urgent",
        clientId: clientIds[3],
        dueDate: "2025-02-08",
      },
      {
        title: "Обновить прайс-лист",
        description: "Обновить цены на гофроупаковку с учетом новых расходов",
        status: "completed",
        priority: "low",
        dueDate: "2025-01-30",
      },
      {
        title: "Встреча с клиентом",
        description: "Встреча с представителем АО МедФарм для обсуждения нового заказа",
        status: "pending",
        priority: "high",
        clientId: clientIds[4],
        dueDate: "2025-02-12",
      },
    ]);

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
