export interface Project {
  id: number;
  shortname: string;
  title: string;
  year: number;
  description: string;
  url?: string;
  images?: Image[];
  categories?: Category[];
  tags?: ProjectTag[];
  links?: ProjectLink[];
}

export interface Image {
  id: number;
  url: string;
  alt?: string;
  order: number;
  projectId: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
}

export interface ProjectTag {
  id: number;
  projectId: number;
  tagId: number;
  tag: Tag;
}

export interface ProjectLink {
  id: number;
  name: string;
  href: string;
  projectId: number;
}
