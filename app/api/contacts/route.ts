import { NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';

/**
 * GET /api/contacts
 * Список контактов сайта
 */
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Ошибка при получении контактов:', error);
    return NextResponse.json(
      { error: 'Не удалось получить контакты' },
      { status: 500 }
    );
  }
}
