import { NextResponse } from "next/server";
import { db } from "@/db";
import { clients, orders, tasks, inquiries } from "@/db/schema";

export async function GET() {
  return NextResponse.json({
    message: "Seed endpoint is available. Use POST /api/seed to fill demo data.",
    example: "curl -X POST /api/seed",
  });
}

export async function POST() {
  try {
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

    await db.insert(inquiries).values([
      {
        name: "Алексей Морозов",
        company: "ООО СеверТорг",
        phone: "+7 (916) 555-11-22",
        email: "morozov@severtorg.ru",
        packageType: "Гофрокороба",
        squareMeters: "1400.00",
        budget: "520000.00",
        message: "Нужны короба под бытовую химию, желательно с двухцветной печатью.",
        source: "website",
        status: "new",
      },
      {
        name: "Елена Крылова",
        company: "ИП Крылова Е.В.",
        phone: "+7 (903) 777-88-99",
        email: "krylova@mail.ru",
        packageType: "Упаковка под заказ",
        squareMeters: "1000.00",
        budget: "450000.00",
        message: "Требуется нестандартная упаковка для набора подарочной продукции.",
        source: "website",
        status: "contacted",
        managerComment: "Связались, клиент отправит размеры продукции до конца недели.",
      },
      {
        name: "Дмитрий Волков",
        company: "АО ТехноСклад",
        phone: "+7 (495) 222-33-44",
        email: "zakupki@technosklad.ru",
        packageType: "Паллетные контейнеры",
        squareMeters: "3500.00",
        budget: "1800000.00",
        message: "Интересует регулярная поставка паллетных контейнеров на склад.",
        source: "website",
        status: "quoted",
        managerComment: "КП отправлено, ждём согласование закупочного отдела.",
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
