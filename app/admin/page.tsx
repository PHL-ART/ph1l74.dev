'use client';

import { useEffect, useMemo, useState } from 'react';
import { Category, Image, Project, ProjectTag, Tag } from '@prisma/client';

type EntityKey = 'projects' | 'categories' | 'tags' | 'images' | 'links';

type ProjectWithRelations = Project & {
  categories: Category[];
  tags: (ProjectTag & { tag: Tag })[];
  images: Image[];
};

type ImageWithProject = Image & { project: Project };
type LinkWithProject = { id: number; name: string; href: string; projectId: number; project: Project };

const sidebarItems: { key: EntityKey; label: string }[] = [
  { key: 'projects', label: 'Проекты' },
  { key: 'categories', label: 'Категории' },
  { key: 'tags', label: 'Теги' },
  { key: 'images', label: 'Изображения' },
  { key: 'links', label: 'Ссылки' },
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
  const [links, setLinks] = useState<LinkWithProject[]>([]);

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


  const [linkForm, setLinkForm] = useState({ projectId: 0, name: '', href: '' });
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);

  const projectSelectOptions = useMemo(
    () => projects.map((p) => ({ id: p.id, label: `${p.title} (${p.shortname})` })),
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
    if (!res.ok) throw new Error('Не удалось получить категории');
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

  const fetchLinks = async () => {
    const res = await fetch('/api/admin/links', { cache: 'no-store' });
    if (!res.ok) throw new Error('Не удалось получить ссылки');
    setLinks(await res.json());
  };

  const reloadAll = async () => {
    await Promise.all([fetchProjects(), fetchCategories(), fetchTags(), fetchImages(), fetchLinks()]);
  };

  useEffect(() => { loadSession(); }, []);

  useEffect(() => {
    if (authenticated) reloadAll().catch((err) => setError(err.message));
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
      shortname: '', title: '', year: new Date().getFullYear(),
      description: '', url: '', categoryIds: [], tagIds: [],
    });
    setEditingProjectId(null);
  };

  const submitProject = async () => {
    setBusy(true); setError(null);
    try {
      const method = editingProjectId ? 'PUT' : 'POST';
      const url = editingProjectId ? `/api/admin/projects/${editingProjectId}` : '/api/admin/projects';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(projectForm) });
      if (!res.ok) { const p = await res.json().catch(() => ({})); throw new Error(p.error || 'Не удалось сохранить проект'); }
      await fetchProjects();
      resetProjectForm();
    } catch (err) { setError(err instanceof Error ? err.message : 'Ошибка сохранения проекта'); }
    finally { setBusy(false); }
  };

  const startEditProject = (project: ProjectWithRelations) => {
    setEditingProjectId(project.id);
    setProjectForm({
      shortname: project.shortname, title: project.title, year: project.year,
      description: project.description, url: project.url || '',
      categoryIds: project.categories?.map((c) => c.id) || [],
      tagIds: project.tags?.map((t) => t.tagId) || [],
    });
  };

  const deleteProject = async (id: number) => {
    if (!window.confirm('Удалить проект?')) return;
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) { const p = await res.json().catch(() => ({})); throw new Error(p.error || 'Не удалось удалить проект'); }
      await fetchProjects(); await fetchImages();
    } catch (err) { setError(err instanceof Error ? err.message : 'Ошибка удаления проекта'); }
    finally { setBusy(false); }
  };

  const resetCategoryForm = () => { setCategoryForm({ name: '', description: '' }); setEditingCategoryId(null); };

  const submitCategory = async () => {
    setBusy(true); setError(null);
    try {
      const method = editingCategoryId ? 'PUT' : 'POST';
      const url = editingCategoryId ? `/api/admin/categories/${editingCategoryId}` : '/api/admin/categories';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(categoryForm) });
      if (!res.ok) { const p = await res.json().catch(() => ({})); throw new Error(p.error || 'Не удалось сохранить категорию'); }
      await fetchCategories(); resetCategoryForm();
    } catch (err) { setError(err instanceof Error ? err.message : 'Ошибка сохранения категории'); }
    finally { setBusy(false); }
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm('Удалить категорию?')) return;
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) { const p = await res.json().catch(() => ({})); throw new Error(p.error || 'Не удалось удалить категорию'); }
      await Promise.all([fetchCategories(), fetchProjects()]);
    } catch (err) { setError(err instanceof Error ? err.message : 'Ошибка удаления категории'); }
    finally { setBusy(false); }
  };

  const resetTagForm = () => { setTagForm({ name: '', description: '' }); setEditingTagId(null); };

  const submitTag = async () => {
    setBusy(true); setError(null);
    try {
      const method = editingTagId ? 'PUT' : 'POST';
      const url = editingTagId ? `/api/admin/tags/${editingTagId}` : '/api/admin/tags';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tagForm) });
      if (!res.ok) { const p = await res.json().catch(() => ({})); throw new Error(p.error || 'Не удалось сохранить тег'); }
      await fetchTags(); resetTagForm();
    } catch (err) { setError(err instanceof Error ? err.message : 'Ошибка сохранения тега'); }
    finally { setBusy(false); }
  };

  const deleteTag = async (id: number) => {
    if (!window.confirm('Удалить тег?')) return;
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/api/admin/tags/${id}`, { method: 'DELETE' });
      if (!res.ok) { const p = await res.json().catch(() => ({})); throw new Error(p.error || 'Не удалось удалить тег'); }
      await Promise.all([fetchTags(), fetchProjects()]);
    } catch (err) { setError(err instanceof Error ? err.message : 'Ошибка удаления тега'); }
    finally { setBusy(false); }
  };

  const deleteImage = async (id: number) => {
    if (!window.confirm('Удалить изображение?')) return;
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/api/admin/images/${id}`, { method: 'DELETE' });
      if (!res.ok) { const p = await res.json().catch(() => ({})); throw new Error(p.error || 'Не удалось удалить изображение'); }
      await Promise.all([fetchImages(), fetchProjects()]);
    } catch (err) { setError(err instanceof Error ? err.message : 'Ошибка удаления изображения'); }
    finally { setBusy(false); }
  };

  const resetLinkForm = () => { setLinkForm({ projectId: 0, name: '', href: '' }); setEditingLinkId(null); };

  const submitLink = async () => {
    setBusy(true); setError(null);
    try {
      const method = editingLinkId ? 'PUT' : 'POST';
      const url = editingLinkId ? `/api/admin/links/${editingLinkId}` : '/api/admin/links';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(linkForm) });
      if (!res.ok) { const p = await res.json().catch(() => ({})); throw new Error(p.error || 'Не удалось сохранить ссылку'); }
      await fetchLinks(); resetLinkForm();
    } catch (err) { setError(err instanceof Error ? err.message : 'Ошибка сохранения ссылки'); }
    finally { setBusy(false); }
  };

  const deleteLink = async (id: number) => {
    if (!window.confirm('Удалить ссылку?')) return;
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/api/admin/links/${id}`, { method: 'DELETE' });
      if (!res.ok) { const p = await res.json().catch(() => ({})); throw new Error(p.error || 'Не удалось удалить ссылку'); }
      await fetchLinks();
    } catch (err) { setError(err instanceof Error ? err.message : 'Ошибка удаления ссылки'); }
    finally { setBusy(false); }
  };

  if (checkingSession) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
        <span className="ds-admin-label">Проверяем сессию</span>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="ds-admin-auth">
        <div className="ds-admin-auth-card">
          <div className="ds-admin-auth-header">
            <p className="ds-eyebrow" style={{ fontSize: '0.50rem', letterSpacing: '0.22em' }}>Admin</p>
            <h1 className="ds-admin-section-title" style={{ marginTop: '0.55rem' }}>
              Вход в панель
            </h1>
          </div>
          <div className="ds-admin-auth-body">
            {error && <div className="ds-admin-error">{error}</div>}
            <div className="ds-admin-field" style={{ marginBottom: 0 }}>
              <label className="ds-admin-label" htmlFor="admin-username">Логин</label>
              <input
                id="admin-username"
                className="ds-admin-input"
                autoComplete="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm((s) => ({ ...s, username: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="admin"
              />
            </div>
            <div className="ds-admin-field" style={{ marginBottom: 0 }}>
              <label className="ds-admin-label" htmlFor="admin-password">Пароль</label>
              <input
                id="admin-password"
                type="password"
                className="ds-admin-input"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((s) => ({ ...s, password: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="••••••"
              />
            </div>
            <button
              type="button"
              className="ds-admin-btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              onClick={handleLogin}
              disabled={busy}
            >
              {busy ? 'Входим...' : 'Войти'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const itemCounts: Record<EntityKey, number> = {
    projects: projects.length,
    categories: categories.length,
    tags: tags.length,
    images: images.length,
    links: links.length,
  };

  const activeLabel = sidebarItems.find((i) => i.key === active)?.label ?? '';

  return (
    <div className="ds-admin">
      <aside className="ds-admin-sidebar">
        <div className="ds-admin-sidebar-brand">
          <p className="ds-eyebrow" style={{ fontSize: '0.50rem', letterSpacing: '0.22em' }}>CMS</p>
        </div>
        <div className="ds-admin-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`ds-admin-nav-btn${active === item.key ? ' ds-admin-nav-btn--active' : ''}`}
              onClick={() => setActive(item.key)}
            >
              <span>{item.label}</span>
              <span className="ds-admin-nav-count">{itemCounts[item.key]}</span>
            </button>
          ))}
        </div>
        <div className="ds-admin-sidebar-footer">
          <button
            type="button"
            className="ds-admin-btn-secondary"
            style={{ width: '100%' }}
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      </aside>

      <main className="ds-admin-main">
        <div className="ds-admin-topbar">
          <p className="ds-eyebrow" style={{ fontSize: '0.50rem', letterSpacing: '0.20em' }}>
            {activeLabel}
          </p>
          {error && <div className="ds-admin-error">{error}</div>}
        </div>

        <div className="ds-admin-content-area">
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
              onDelete={deleteImage}
              busy={busy}
            />
          )}

          {active === 'links' && (
            <LinksView
              links={links}
              projects={projectSelectOptions}
              form={linkForm}
              setForm={setLinkForm}
              onSubmit={submitLink}
              onDelete={deleteLink}
              onEdit={(link) => {
                setEditingLinkId(link.id);
                setLinkForm({ projectId: link.projectId, name: link.name, href: link.href });
              }}
              editingId={editingLinkId}
              onReset={resetLinkForm}
              busy={busy}
            />
          )}
        </div>
      </main>
    </div>
  );
}

type ProjectsViewProps = {
  projects: ProjectWithRelations[];
  categories: Category[];
  tags: Tag[];
  form: { shortname: string; title: string; year: number; description: string; url: string; categoryIds: number[]; tagIds: number[] };
  setForm: React.Dispatch<React.SetStateAction<{ shortname: string; title: string; year: number; description: string; url: string; categoryIds: number[]; tagIds: number[] }>>;
  onSubmit: () => Promise<void>;
  onEdit: (project: ProjectWithRelations) => void;
  onDelete: (id: number) => void;
  editingId: number | null;
  onReset: () => void;
  busy: boolean;
};

function ProjectsView({ projects, categories, tags, form, setForm, onSubmit, onEdit, onDelete, editingId, onReset, busy }: ProjectsViewProps) {
  return (
    <>
      <div className="ds-admin-section-head">
        <div>
          <p className="ds-eyebrow" style={{ fontSize: '0.50rem', letterSpacing: '0.22em' }}>
            {editingId ? 'Редактирование' : 'Новый проект'}
          </p>
          <h2 className="ds-admin-section-title">Проекты</h2>
        </div>
        {editingId && (
          <button type="button" className="ds-admin-btn-secondary" onClick={onReset}>
            Сбросить форму
          </button>
        )}
      </div>

      <div className="ds-admin-grid">
        <div className="ds-admin-form-col">
          <div className="ds-admin-field">
            <label className="ds-admin-label">Короткое имя (slug)</label>
            <input
              className="ds-admin-input"
              value={form.shortname}
              onChange={(e) => setForm((s) => ({ ...s, shortname: e.target.value }))}
              placeholder="my-project"
            />
          </div>
          <div className="ds-admin-field">
            <label className="ds-admin-label">Заголовок</label>
            <input
              className="ds-admin-input"
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              placeholder="Новый проект"
            />
          </div>
          <div className="ds-admin-field">
            <label className="ds-admin-label">Год</label>
            <input
              type="number"
              className="ds-admin-input"
              value={form.year}
              onChange={(e) => setForm((s) => ({ ...s, year: Number(e.target.value) || s.year }))}
            />
          </div>
          <div className="ds-admin-field">
            <label className="ds-admin-label">Описание</label>
            <textarea
              className="ds-admin-textarea"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            />
          </div>
          <div className="ds-admin-field">
            <label className="ds-admin-label">URL (опционально)</label>
            <input
              className="ds-admin-input"
              value={form.url}
              onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>
          <div className="ds-admin-field">
            <label className="ds-admin-label">Категории</label>
            <select
              multiple
              className="ds-admin-select"
              value={form.categoryIds.map(String)}
              onChange={(e) => {
                const opts = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
                setForm((s) => ({ ...s, categoryIds: opts }));
              }}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="ds-admin-field" style={{ marginBottom: 0 }}>
            <label className="ds-admin-label">Теги</label>
            <select
              multiple
              className="ds-admin-select"
              value={form.tagIds.map(String)}
              onChange={(e) => {
                const opts = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
                setForm((s) => ({ ...s, tagIds: opts }));
              }}
            >
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
          </div>
          <div className="ds-admin-btn-group">
            <button type="button" className="ds-admin-btn-primary" onClick={onSubmit} disabled={busy}>
              {editingId ? 'Сохранить изменения' : 'Создать проект'}
            </button>
            {editingId && (
              <button type="button" className="ds-admin-btn-secondary" onClick={onReset}>
                Отменить
              </button>
            )}
          </div>
        </div>

        <div className="ds-admin-list-col">
          {projects.length === 0 ? (
            <div className="ds-admin-empty">Проектов пока нет</div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="ds-admin-list-row">
                <div style={{ minWidth: 0 }}>
                  <p className="ds-admin-row-meta">{project.shortname} — {project.year}</p>
                  <h3 className="ds-admin-row-title">{project.title}</h3>
                  {project.description && (
                    <p className="ds-admin-row-body">{project.description}</p>
                  )}
                  {project.categories?.length > 0 && (
                    <div className="ds-admin-row-tags">
                      {project.categories.map((cat) => (
                        <span key={cat.id} className="ds-tag">{cat.name}</span>
                      ))}
                    </div>
                  )}
                  {project.tags?.length > 0 && (
                    <div className="ds-admin-row-tags">
                      {project.tags.map((tag) => (
                        <span key={tag.id} className="ds-tag" style={{ borderColor: 'var(--ds-accent-dim)', color: 'var(--ds-accent)' }}>
                          {tag.tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ds-admin-row-actions">
                  <button type="button" className="ds-admin-btn-secondary" onClick={() => onEdit(project)}>
                    Ред.
                  </button>
                  <button type="button" className="ds-admin-btn-danger" onClick={() => onDelete(project.id)}>
                    Удал.
                  </button>
                </div>
              </div>
            ))
          )}
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

function CategoriesView({ categories, form, setForm, onSubmit, onDelete, onEdit, editingId, onReset, busy }: CategoriesViewProps) {
  return (
    <>
      <div className="ds-admin-section-head">
        <div>
          <p className="ds-eyebrow" style={{ fontSize: '0.50rem', letterSpacing: '0.22em' }}>
            {editingId ? 'Редактирование' : 'Новая категория'}
          </p>
          <h2 className="ds-admin-section-title">Категории</h2>
        </div>
        {editingId && (
          <button type="button" className="ds-admin-btn-secondary" onClick={onReset}>
            Сбросить форму
          </button>
        )}
      </div>

      <div className="ds-admin-grid">
        <div className="ds-admin-form-col">
          <div className="ds-admin-field">
            <label className="ds-admin-label">Название</label>
            <input
              className="ds-admin-input"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
          </div>
          <div className="ds-admin-field" style={{ marginBottom: 0 }}>
            <label className="ds-admin-label">Описание</label>
            <textarea
              className="ds-admin-textarea"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            />
          </div>
          <div className="ds-admin-btn-group">
            <button type="button" className="ds-admin-btn-primary" onClick={onSubmit} disabled={busy}>
              {editingId ? 'Сохранить' : 'Создать'}
            </button>
            {editingId && (
              <button type="button" className="ds-admin-btn-secondary" onClick={onReset}>
                Отменить
              </button>
            )}
          </div>
        </div>

        <div className="ds-admin-list-col">
          {categories.length === 0 ? (
            <div className="ds-admin-empty">Категорий пока нет</div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="ds-admin-list-row">
                <div>
                  <h3 className="ds-admin-row-title">{category.name}</h3>
                  {category.description && (
                    <p className="ds-admin-row-body">{category.description}</p>
                  )}
                </div>
                <div className="ds-admin-row-actions">
                  <button type="button" className="ds-admin-btn-secondary" onClick={() => onEdit(category)}>
                    Ред.
                  </button>
                  <button type="button" className="ds-admin-btn-danger" onClick={() => onDelete(category.id)}>
                    Удал.
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
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

function TagsView({ tags, form, setForm, onSubmit, onDelete, onEdit, editingId, onReset, busy }: TagsViewProps) {
  return (
    <>
      <div className="ds-admin-section-head">
        <div>
          <p className="ds-eyebrow" style={{ fontSize: '0.50rem', letterSpacing: '0.22em' }}>
            {editingId ? 'Редактирование' : 'Новый тег'}
          </p>
          <h2 className="ds-admin-section-title">Теги</h2>
        </div>
        {editingId && (
          <button type="button" className="ds-admin-btn-secondary" onClick={onReset}>
            Сбросить форму
          </button>
        )}
      </div>

      <div className="ds-admin-grid">
        <div className="ds-admin-form-col">
          <div className="ds-admin-field">
            <label className="ds-admin-label">Название</label>
            <input
              className="ds-admin-input"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
          </div>
          <div className="ds-admin-field" style={{ marginBottom: 0 }}>
            <label className="ds-admin-label">Описание</label>
            <textarea
              className="ds-admin-textarea"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            />
          </div>
          <div className="ds-admin-btn-group">
            <button type="button" className="ds-admin-btn-primary" onClick={onSubmit} disabled={busy}>
              {editingId ? 'Сохранить' : 'Создать'}
            </button>
            {editingId && (
              <button type="button" className="ds-admin-btn-secondary" onClick={onReset}>
                Отменить
              </button>
            )}
          </div>
        </div>

        <div className="ds-admin-list-col">
          {tags.length === 0 ? (
            <div className="ds-admin-empty">Тегов пока нет</div>
          ) : (
            tags.map((tag) => (
              <div key={tag.id} className="ds-admin-list-row">
                <div>
                  <h3 className="ds-admin-row-title">{tag.name}</h3>
                  {tag.description && (
                    <p className="ds-admin-row-body">{tag.description}</p>
                  )}
                </div>
                <div className="ds-admin-row-actions">
                  <button type="button" className="ds-admin-btn-secondary" onClick={() => onEdit(tag)}>
                    Ред.
                  </button>
                  <button type="button" className="ds-admin-btn-danger" onClick={() => onDelete(tag.id)}>
                    Удал.
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

type ImagesViewProps = {
  images: ImageWithProject[];
  onDelete: (id: number) => void;
  busy: boolean;
};

function ImageThumb({
  img,
  onDelete,
  busy,
}: {
  img: ImageWithProject;
  onDelete: (id: number) => void;
  busy: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '1',
        cursor: busy ? 'not-allowed' : 'pointer',
        borderRadius: '5px',
        overflow: 'hidden',
        border: '1px solid #2a2a2a',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !busy && onDelete(img.id)}
      title={img.alt ?? img.url}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.url}
        alt={img.alt ?? img.url}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {hovered && !busy && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(153, 27, 27, 0.80)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>✕</span>
        </div>
      )}
    </div>
  );
}

function ImagesView({ images, onDelete, busy }: ImagesViewProps) {
  const grouped = useMemo(() => {
    const map = new Map<number, { projectId: number; projectTitle: string; imgs: ImageWithProject[] }>();
    for (const img of images) {
      if (!map.has(img.projectId)) {
        map.set(img.projectId, { projectId: img.projectId, projectTitle: img.project.title, imgs: [] });
      }
      map.get(img.projectId)!.imgs.push(img);
    }
    return Array.from(map.values());
  }, [images]);

  return (
    <>
      <div className="ds-admin-section-head">
        <div>
          <p className="ds-eyebrow" style={{ fontSize: '0.50rem', letterSpacing: '0.22em' }}>Галерея</p>
          <h2 className="ds-admin-section-title">Изображения</h2>
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="ds-admin-empty">Изображений пока нет</div>
      ) : (
        grouped.map((group) => (
          <div key={group.projectId} style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgb(153,27,27)' }}>
                {group.projectTitle}
              </span>
              <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
              <span style={{ fontSize: '0.58rem', color: '#555' }}>{group.imgs.length} фото</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
              {group.imgs.map((img) => (
                <ImageThumb key={img.id} img={img} onDelete={onDelete} busy={busy} />
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}

type LinksViewProps = {
  links: LinkWithProject[];
  projects: { id: number; label: string }[];
  form: { projectId: number; name: string; href: string };
  setForm: React.Dispatch<React.SetStateAction<{ projectId: number; name: string; href: string }>>;
  onSubmit: () => Promise<void>;
  onDelete: (id: number) => void;
  onEdit: (link: LinkWithProject) => void;
  editingId: number | null;
  onReset: () => void;
  busy: boolean;
};

function LinksView({ links, projects, form, setForm, onSubmit, onDelete, onEdit, editingId, onReset, busy }: LinksViewProps) {
  return (
    <>
      <div className="ds-admin-section-head">
        <div>
          <p className="ds-eyebrow" style={{ fontSize: '0.50rem', letterSpacing: '0.22em' }}>
            {editingId ? 'Редактирование' : 'Новая ссылка'}
          </p>
          <h2 className="ds-admin-section-title">Ссылки</h2>
        </div>
        {editingId && (
          <button type="button" className="ds-admin-btn-secondary" onClick={onReset}>
            Сбросить форму
          </button>
        )}
      </div>

      <div className="ds-admin-grid">
        <div className="ds-admin-form-col">
          <div className="ds-admin-field">
            <label className="ds-admin-label">Проект</label>
            <select
              className="ds-admin-select"
              value={form.projectId}
              onChange={(e) => setForm((s) => ({ ...s, projectId: Number(e.target.value) }))}
            >
              <option value={0}>Выберите проект</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="ds-admin-field">
            <label className="ds-admin-label">Название</label>
            <input
              className="ds-admin-input"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
          </div>
          <div className="ds-admin-field" style={{ marginBottom: 0 }}>
            <label className="ds-admin-label">Href</label>
            <input
              className="ds-admin-input"
              value={form.href}
              onChange={(e) => setForm((s) => ({ ...s, href: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>
          <div className="ds-admin-btn-group">
            <button type="button" className="ds-admin-btn-primary" onClick={onSubmit} disabled={busy || !form.projectId}>
              {editingId ? 'Сохранить' : 'Добавить'}
            </button>
            {editingId && (
              <button type="button" className="ds-admin-btn-secondary" onClick={onReset}>
                Отменить
              </button>
            )}
          </div>
        </div>

        <div className="ds-admin-list-col">
          {links.length === 0 ? (
            <div className="ds-admin-empty">Ссылок пока нет</div>
          ) : (
            links.map((link) => (
              <div key={link.id} className="ds-admin-list-row">
                <div style={{ minWidth: 0 }}>
                  <p className="ds-admin-row-meta">#{link.id} — {link.project.title}</p>
                  <h3 className="ds-admin-row-title">{link.name}</h3>
                  <p className="ds-admin-row-body" style={{ wordBreak: 'break-all' }}>{link.href}</p>
                </div>
                <div className="ds-admin-row-actions">
                  <button type="button" className="ds-admin-btn-secondary" onClick={() => onEdit(link)}>
                    Ред.
                  </button>
                  <button type="button" className="ds-admin-btn-danger" onClick={() => onDelete(link.id)}>
                    Удал.
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
