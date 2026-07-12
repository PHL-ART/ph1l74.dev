export interface CareerEvent {
  year: string;
  title: string;
  subtitle: string;
  current?: boolean;
}

export const CAREER: CareerEvent[] = [
  { year: "2014", title: "Бакалавриат",           subtitle: "УрФУ · ИРИТ-РТФ · Телекоммуникации" },
  { year: "2014", title: "Инженер-программист",   subtitle: "ООО «ТЕЛЕСЕН» · Автоматизированные системы" },
  { year: "2016", title: "Магистратура",           subtitle: "УрФУ · ИРИТ-РТФ · Инфокоммуникационные технологии" },
  { year: "2017", title: "Разработчик ПО",         subtitle: "Банк России · Уральское отделение" },
  { year: "2020", title: "Разработчик ПО",         subtitle: "Deloitte" },
  { year: "2022 — сейчас", title: "Разработчик ПО", subtitle: "ДРТ Тех", current: true },
];
