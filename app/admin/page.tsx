'use client';

import { useEffect, useMemo, useState } from 'react';
import { Category, Image, Project, ProjectTag, Tag } from '@prisma/client';

type EntityKey = 'projects' | 'categories' | 'tags' | 'images';

type ProjectWithRelations = Project & {
  categories: Category[];
  tags: (ProjectTag & { tag: Tag })[];
  images: Image[];
};

type ImageWithProject = Image & { project: Project };

const sidebarItems: { key: EntityKey; label: string }[] = [
  { key: 'projects', label: 'Проекты' },
  { key: 'categories', label: 'Рубрики' },
  { key: 'tags', label: 'Теги' },
  { key: 'images', label: 'Изображения' },
];

export default function AdminPage() {
  const [active, setActive] = useState<EntityKey>('projects');
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [images, setImages] = useState<ImageWithProject[]>([]);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const [projectForm, setProjectForm] = useState({
    shortname: '',
    title: '',
    year: new Date().getFullYear(),
    description: '',
    url: '',
    categoryIds: [] as number[],
    tagIds: [] as number[],
  });
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const [tagForm, setTagForm] = useState({ name: '', description: '' });
  const [editingTagId, setEditingTagId] = useState<number | null>(null);

  const [imageForm, setImageForm] = useState({
    projectId: 0,
    url: '',
    alt: '',
    order: 0,
  });
  const [editingImageId, setEditingImageId] = useState<number | null>(null);

  const projectSelectOptions = useMemo(
    () =>
      projects.map((p) => ({
        id: p.id,
        label: `${p.title} (${p.shortname})`,
      })),
    [projects],
  );

  const loadSession = async () => {
    try {
      const res = await fetch('/api/admin/session', { cache: 'no-store' });
      setAuthenticated(res.ok);
    } catch {
      setAuthenticated(false);
    } finally {
      setCheckingSession(false);
    }
  };

  const fetchProjects = async () => {
    const res = await fetch('/api/admin/projects', { cache: 'no-store' });
    if (!res.ok) throw new Error('Не удалось получить проекты');
    setProjects(await res.json());
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories', { cache: 'no-store' });
    if (!res.ok) throw new Error('Не удалось получить рубрики');
    setCategories(await res.json());
  };

  const fetchTags = async () => {
    const res = await fetch('/api/admin/tags', { cache: 'no-store' });
    if (!res.ok) throw new Error('Не удалось получить теги');
    setTags(await res.json());
  };

  const fetchImages = async () => {
    const res = await fetch('/api/admin/images', { cache: 'no-store' });
    if (!res.ok) throw new Error('Не удалось получить изображения');
    setImages(await res.json());
  };

  const reloadAll = async () => {
    await Promise.all([fetchProjects(), fetchCategories(), fetchTags(), fetchImages()]);
  };

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (authenticated) {
      reloadAll().catch((err) => setError(err.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  const handleLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Неверные данные');
      }
      setAuthenticated(true);
      await reloadAll();
    } catch (err) {
      setAuthenticated(false);
      setError(err instanceof Error ? err.message : 'Ошибка авторизации');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
  };

  const resetProjectForm = () => {
    setProjectForm({
      shortname: '',
      title: '',
      year: new Date().getFullYear(),
      description: '',
      url: '',
      categoryIds: [],
      tagIds: [],
    });
    setEditingProjectId(null);
  };

  const submitProject = async () => {
    setBusy(true);
    setError(null);
    try {
      const method = editingProjectId ? 'PUT' : 'POST';
      const url = editingProjectId
        ? `/api/admin/projects/${editingProjectId}`
        : '/api/admin/projects';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Не удалось сохранить проект');
      }
      await fetchProjects();
      resetProjectForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения проекта');
    } finally {
      setBusy(false);
    }
  };

  const startEditProject = (project: ProjectWithRelations) => {
    setEditingProjectId(project.id);
    setProjectForm({
      shortname: project.shortname,
      title: project.title,
      year: project.year,
      description: project.description,
      url: project.url || '',
      categoryIds: project.categories?.map((c) => c.id) || [],
      tagIds: project.tags?.map((t) => t.tagId) || [],
    });
  };

  const deleteProject = async (id: number) => {
    if (!window.confirm('Удалить проект?')) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Не удалось удалить проект');
      }
      await fetchProjects();
      await fetchImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления проекта');
    } finally {
      setBusy(false);
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', description: '' });
    setEditingCategoryId(null);
  };

  const submitCategory = async () => {
    setBusy(true);
    setError(null);
    try {
      const method = editingCategoryId ? 'PUT' : 'POST';
      const url = editingCategoryId
        ? `/api/admin/categories/${editingCategoryId}`
        : '/api/admin/categories';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Не удалось сохранить рубрику');
      }
      await fetchCategories();
      resetCategoryForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения рубрики');
    } finally {
      setBusy(false);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm('Удалить рубрику?')) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Не удалось удалить рубрику');
      }
      await Promise.all([fetchCategories(), fetchProjects()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления рубрики');
    } finally {
      setBusy(false);
    }
  };

  const resetTagForm = () => {
    setTagForm({ name: '', description: '' });
    setEditingTagId(null);
  };

  const submitTag = async () => {
    setBusy(true);
    setError(null);
    try {
      const method = editingTagId ? 'PUT' : 'POST';
      const url = editingTagId ? `/api/admin/tags/${editingTagId}` : '/api/admin/tags';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagForm),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Не удалось сохранить тег');
      }
      await fetchTags();
      resetTagForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения тега');
    } finally {
      setBusy(false);
    }
  };

  const deleteTag = async (id: number) => {
    if (!window.confirm('Удалить тег?')) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/tags/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Не удалось удалить тег');
      }
      await Promise.all([fetchTags(), fetchProjects()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления тега');
    } finally {
      setBusy(false);
    }
  };

  const resetImageForm = () => {
    setImageForm({ projectId: 0, url: '', alt: '', order: 0 });
    setEditingImageId(null);
  };

  const submitImage = async () => {
    setBusy(true);
    setError(null);
    try {
      const method = editingImageId ? 'PUT' : 'POST';
      const url = editingImageId ? `/api/admin/images/${editingImageId}` : '/api/admin/images';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageForm),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Не удалось сохранить изображение');
      }
      await fetchImages();
      resetImageForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения изображения');
    } finally {
      setBusy(false);
    }
  };

  const deleteImage = async (id: number) => {
    if (!window.confirm('Удалить изображение?')) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/images/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Не удалось удалить изображение');
      }
      await fetchImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления изображения');
    } finally {
      setBusy(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-8 text-center">
        <p className="text-sm text-neutral-400">Проверяем сессию...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold">Админ-панель</h1>
        <p className="text-sm text-neutral-400">
          Введите логин и пароль из переменных окружения ADMIN_USERNAME / ADMIN_PASSWORD.
        </p>
        {error && (
          <div className="rounded border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {error}
          </div>
        )}
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-neutral-300">Логин</span>
          <input
            className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
            value={loginForm.username}
            onChange={(e) => setLoginForm((s) => ({ ...s, username: e.target.value }))}
            placeholder="admin"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-neutral-300">Пароль</span>
          <input
            type="password"
            className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
            value={loginForm.password}
            onChange={(e) => setLoginForm((s) => ({ ...s, password: e.target.value }))}
            placeholder="••••••"
          />
        </label>
        <button
          type="button"
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleLogin}
          disabled={busy}
        >
          Войти
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-6 rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 shadow-lg backdrop-blur">
      <aside className="w-64 shrink-0 space-y-4">
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Навигация</p>
          <div className="mt-2 flex flex-col gap-2">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActive(item.key)}
                className={`rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                  active === item.key
                    ? 'bg-orange-600 text-white'
                    : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Сессия</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-200 transition hover:border-orange-500 hover:text-white"
          >
            Выйти
          </button>
        </div>
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}
      </aside>

      <section className="flex min-h-[70vh] w-full flex-col gap-4 rounded-lg border border-neutral-800 bg-neutral-950 p-4">
        {active === 'projects' && (
          <ProjectsView
            projects={projects}
            categories={categories}
            tags={tags}
            form={projectForm}
            setForm={setProjectForm}
            onSubmit={submitProject}
            onEdit={startEditProject}
            onDelete={deleteProject}
            editingId={editingProjectId}
            onReset={resetProjectForm}
            busy={busy}
          />
        )}

        {active === 'categories' && (
          <CategoriesView
            categories={categories}
            form={categoryForm}
            setForm={setCategoryForm}
            onSubmit={submitCategory}
            onDelete={deleteCategory}
            onEdit={(cat) => {
              setEditingCategoryId(cat.id);
              setCategoryForm({ name: cat.name, description: cat.description || '' });
            }}
            editingId={editingCategoryId}
            onReset={resetCategoryForm}
            busy={busy}
          />
        )}

        {active === 'tags' && (
          <TagsView
            tags={tags}
            form={tagForm}
            setForm={setTagForm}
            onSubmit={submitTag}
            onDelete={deleteTag}
            onEdit={(tag) => {
              setEditingTagId(tag.id);
              setTagForm({ name: tag.name, description: tag.description || '' });
            }}
            editingId={editingTagId}
            onReset={resetTagForm}
            busy={busy}
          />
        )}

        {active === 'images' && (
          <ImagesView
            images={images}
            projects={projectSelectOptions}
            form={imageForm}
            setForm={setImageForm}
            onSubmit={submitImage}
            onDelete={deleteImage}
            onEdit={(img) => {
              setEditingImageId(img.id);
              setImageForm({
                projectId: img.projectId,
                url: img.url,
                alt: img.alt || '',
                order: img.order,
              });
            }}
            editingId={editingImageId}
            onReset={resetImageForm}
            busy={busy}
          />
        )}
      </section>
    </div>
  );
}

type ProjectsViewProps = {
  projects: ProjectWithRelations[];
  categories: Category[];
  tags: Tag[];
  form: {
    shortname: string;
    title: string;
    year: number;
    description: string;
    url: string;
    categoryIds: number[];
    tagIds: number[];
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      shortname: string;
      title: string;
      year: number;
      description: string;
      url: string;
      categoryIds: number[];
      tagIds: number[];
    }>
  >;
  onSubmit: () => Promise<void>;
  onEdit: (project: ProjectWithRelations) => void;
  onDelete: (id: number) => void;
  editingId: number | null;
  onReset: () => void;
  busy: boolean;
};

function ProjectsView({
  projects,
  categories,
  tags,
  form,
  setForm,
  onSubmit,
  onEdit,
  onDelete,
  editingId,
  onReset,
  busy,
}: ProjectsViewProps) {
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Проекты</h2>
          <p className="text-sm text-neutral-500">Создание и редактирование проектов</p>
        </div>
        {editingId && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-neutral-400 underline-offset-4 hover:text-white hover:underline"
          >
            Сбросить форму
          </button>
        )}
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <div className="grid gap-3">
            <label className="grid gap-1 text-sm">
              <span className="text-neutral-300">Короткое имя (slug)</span>
              <input
                className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
                value={form.shortname}
                onChange={(e) => setForm((s) => ({ ...s, shortname: e.target.value }))}
                placeholder="my-project"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-neutral-300">Заголовок</span>
              <input
                className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                placeholder="Новый проект"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-neutral-300">Год</span>
              <input
                type="number"
                className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
                value={form.year}
                onChange={(e) =>
                  setForm((s) => ({ ...s, year: Number(e.target.value) || s.year }))
                }
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-neutral-300">Описание</span>
              <textarea
                className="min-h-[120px] rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-neutral-300">URL (опционально)</span>
              <input
                className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
                value={form.url}
                onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))}
                placeholder="https://example.com"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-neutral-300">Рубрики</span>
              <select
                multiple
                className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
                value={form.categoryIds.map(String)}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions).map((o) =>
                    Number(o.value),
                  );
                  setForm((s) => ({ ...s, categoryIds: options }));
                }}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-neutral-300">Теги</span>
              <select
                multiple
                className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
                value={form.tagIds.map(String)}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions).map((o) =>
                    Number(o.value),
                  );
                  setForm((s) => ({ ...s, tagIds: options }));
                }}
              >
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onSubmit}
                disabled={busy}
                className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editingId ? 'Сохранить изменения' : 'Создать проект'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={onReset}
                  className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-200 transition hover:border-orange-500 hover:text-white"
                >
                  Отменить
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          {projects.length === 0 && (
            <p className="text-sm text-neutral-500">Пока нет проектов</p>
          )}
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded border border-neutral-800 bg-neutral-950 p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm uppercase text-neutral-500">{project.shortname}</p>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-sm text-neutral-400">{project.year}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    className="rounded-md border border-neutral-700 px-3 py-1 text-sm text-neutral-200 transition hover:border-orange-500 hover:text-white"
                  >
                    Редактировать
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(project.id)}
                    className="rounded-md border border-red-500/70 px-3 py-1 text-sm text-red-200 transition hover:bg-red-500/10"
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-neutral-300">{project.description}</p>
              {project.categories?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-200"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
              {project.tags?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-orange-600/20 px-2 py-1 text-xs text-orange-200"
                    >
                      {tag.tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

type CategoriesViewProps = {
  categories: Category[];
  form: { name: string; description: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; description: string }>>;
  onSubmit: () => Promise<void>;
  onDelete: (id: number) => void;
  onEdit: (category: Category) => void;
  editingId: number | null;
  onReset: () => void;
  busy: boolean;
};

function CategoriesView({
  categories,
  form,
  setForm,
  onSubmit,
  onDelete,
  onEdit,
  editingId,
  onReset,
  busy,
}: CategoriesViewProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="text-xl font-semibold">Рубрики</h2>
        <div className="mt-3 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-neutral-300">Название</span>
            <input
              className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-neutral-300">Описание</span>
            <textarea
              className="min-h-[80px] rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onSubmit}
              disabled={busy}
              className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingId ? 'Сохранить' : 'Создать'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={onReset}
                className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-200 transition hover:border-orange-500 hover:text-white"
              >
                Отменить
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        {categories.length === 0 && (
          <p className="text-sm text-neutral-500">Рубрик пока нет</p>
        )}
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-start justify-between gap-3 rounded border border-neutral-800 bg-neutral-950 p-3"
          >
            <div>
              <p className="text-base font-semibold">{category.name}</p>
              {category.description && (
                <p className="text-sm text-neutral-400">{category.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(category)}
                className="rounded-md border border-neutral-700 px-3 py-1 text-sm text-neutral-200 transition hover:border-orange-500 hover:text-white"
              >
                Редактировать
              </button>
              <button
                type="button"
                onClick={() => onDelete(category.id)}
                className="rounded-md border border-red-500/70 px-3 py-1 text-sm text-red-200 transition hover:bg-red-500/10"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type TagsViewProps = {
  tags: Tag[];
  form: { name: string; description: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; description: string }>>;
  onSubmit: () => Promise<void>;
  onDelete: (id: number) => void;
  onEdit: (tag: Tag) => void;
  editingId: number | null;
  onReset: () => void;
  busy: boolean;
};

function TagsView({
  tags,
  form,
  setForm,
  onSubmit,
  onDelete,
  onEdit,
  editingId,
  onReset,
  busy,
}: TagsViewProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="text-xl font-semibold">Теги</h2>
        <div className="mt-3 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-neutral-300">Название</span>
            <input
              className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-neutral-300">Описание</span>
            <textarea
              className="min-h-[80px] rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onSubmit}
              disabled={busy}
              className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingId ? 'Сохранить' : 'Создать'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={onReset}
                className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-200 transition hover:border-orange-500 hover:text-white"
              >
                Отменить
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        {tags.length === 0 && <p className="text-sm text-neutral-500">Тегов пока нет</p>}
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-start justify-between gap-3 rounded border border-neutral-800 bg-neutral-950 p-3"
          >
            <div>
              <p className="text-base font-semibold">{tag.name}</p>
              {tag.description && (
                <p className="text-sm text-neutral-400">{tag.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(tag)}
                className="rounded-md border border-neutral-700 px-3 py-1 text-sm text-neutral-200 transition hover:border-orange-500 hover:text-white"
              >
                Редактировать
              </button>
              <button
                type="button"
                onClick={() => onDelete(tag.id)}
                className="rounded-md border border-red-500/70 px-3 py-1 text-sm text-red-200 transition hover:bg-red-500/10"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type ImagesViewProps = {
  images: ImageWithProject[];
  projects: { id: number; label: string }[];
  form: { projectId: number; url: string; alt: string; order: number };
  setForm: React.Dispatch<
    React.SetStateAction<{ projectId: number; url: string; alt: string; order: number }>
  >;
  onSubmit: () => Promise<void>;
  onDelete: (id: number) => void;
  onEdit: (image: ImageWithProject) => void;
  editingId: number | null;
  onReset: () => void;
  busy: boolean;
};

function ImagesView({
  images,
  projects,
  form,
  setForm,
  onSubmit,
  onDelete,
  onEdit,
  editingId,
  onReset,
  busy,
}: ImagesViewProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="text-xl font-semibold">Изображения</h2>
        <div className="mt-3 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-neutral-300">Проект</span>
            <select
              className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
              value={form.projectId}
              onChange={(e) =>
                setForm((s) => ({ ...s, projectId: Number(e.target.value) }))
              }
            >
              <option value={0}>Выберите проект</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-neutral-300">URL</span>
            <input
              className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
              value={form.url}
              onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-neutral-300">Alt (опционально)</span>
            <input
              className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
              value={form.alt}
              onChange={(e) => setForm((s) => ({ ...s, alt: e.target.value }))}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-neutral-300">Порядок</span>
            <input
              type="number"
              className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-orange-500"
              value={form.order}
              onChange={(e) =>
                setForm((s) => ({ ...s, order: Number(e.target.value) || 0 }))
              }
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onSubmit}
              disabled={busy || !form.projectId}
              className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingId ? 'Сохранить' : 'Добавить'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={onReset}
                className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-200 transition hover:border-orange-500 hover:text-white"
              >
                Отменить
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        {images.length === 0 && (
          <p className="text-sm text-neutral-500">Изображений пока нет</p>
        )}
        {images.map((img) => (
          <div
            key={img.id}
            className="flex flex-col gap-2 rounded border border-neutral-800 bg-neutral-950 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm uppercase text-neutral-500">#{img.id}</p>
                <p className="text-base font-semibold">{img.project.title}</p>
                <p className="text-sm text-neutral-400">Порядок: {img.order}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(img)}
                  className="rounded-md border border-neutral-700 px-3 py-1 text-sm text-neutral-200 transition hover:border-orange-500 hover:text-white"
                >
                  Редактировать
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(img.id)}
                  className="rounded-md border border-red-500/70 px-3 py-1 text-sm text-red-200 transition hover:bg-red-500/10"
                >
                  Удалить
                </button>
              </div>
            </div>
            <p className="break-all text-sm text-neutral-200">{img.url}</p>
            {img.alt && <p className="text-sm text-neutral-400">alt: {img.alt}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

