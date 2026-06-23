import type { Metadata } from 'next';
import { ContactsPage } from "@/app-pages/contacts/ui/ContactsPage";

export const metadata: Metadata = {
  title: 'Контакты',
  openGraph: {
    title: 'Контакты | Филат Астахов',
    description: 'Связаться с фронтенд разработчиком Филатом Астаховым.',
  },
};

export default function Contacts() {
  return <ContactsPage />;
}
