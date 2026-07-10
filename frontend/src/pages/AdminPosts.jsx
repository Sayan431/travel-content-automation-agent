import { useEffect, useState } from "react";
import api from "../api/client";
import StatusBadge from "../components/StatusBadge";

const EDITABLE_FIELDS = [
  { key: "blog_title",         label: "Blog Title",          type: "input" },
  { key: "slug",               label: "Slug",                type: "input" },
  { key: "meta_description",   label: "Meta Description",    type: "input" },
  { key: "article",            label: "Article Body",        type: "textarea", rows: 14 },
  { key: "instagram_caption",  label: "Instagram Caption",   type: "textarea", rows: 4  },
  { key: "facebook_post",      label: "Facebook Post",       type: "textarea", rows: 4  },
  { key: "linkedin_post",      label: "LinkedIn Post",       type: "textarea", rows: 4  },
  { key: "hashtags",           label: "Hashtags",            type: "input" },
  { key: "cta",                label: "CTA",                 type: "input" },
];

const STATUS_OPTIONS = ["pending", "posted", "rejected", "failed"];

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // { id, ...draft }
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get("/content/");
      setPosts(res.data || []);
    } catch {
      alert("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openEdit = (post) => {
    setEditing({
      id: post.id,
      blog_title: post.blog_title || "",
      slug: post.slug || "",
      meta_description: post.meta_description || "",
      article: post.article || "",
      instagram_caption: post.instagram_caption || "",
      facebook_post: post.facebook_post || "",
      linkedin_post: post.linkedin_post || "",
      hashtags: post.hashtags || "",
      cta: post.cta || "",
      status: post.status,
    });
  };

  const saveEdit = async () => {
    const { id, ...payload } = editing;
    try {
      setSaving(true);
      await api.put(`/content/${id}`, payload);
      setEditing(null);
      await load();
    } catch {
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = posts.filter((p) => {
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchSearch =
      !search ||
      p.blog_title?.toLowerCase().includes(search.toLowerCase()) ||
      p.slug?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = posts.filter((p) => p.status === s).length;
    return acc;
  }, {});

  return (
    <>
      {/* Hero */}
      <div className="dash-hero">
        <img
          className="dash-hero-img"
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
          alt="Blog writing"
        />
        <div className="dash-hero-overlay">
          <p className="dash-hero-eyebrow">Travel Agent · Admin</p>
          <div className="dash-hero-tags">
            <span className="dash-hero-tag"><i className="ti ti-file-text" /> All Content</span>
            <span className="dash-hero-tag"><i className="ti ti-edit" /> Edit & Manage</span>
          </div>
          <h1 className="dash-hero-title">All Posts</h1>
          <p className="dash-hero-sub">
            Browse, edit and manage all generated blog posts regardless of status.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="adm-page-toolbar">
        <input
          className="adm-search-input"
          placeholder="Search by title or slug…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="adm-filter-pills">
          {["all", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              className={`adm-pill ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? `All (${posts.length})` : `${s} (${counts[s] || 0})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="dash-loading"><i className="ti ti-loader-2" /> Loading posts…</div>
      ) : (
        <div className="adm-posts-list">
          {filtered.length === 0 && (
            <div className="adm-empty">No posts match your filters.</div>
          )}
          {filtered.map((post) => (
            <div key={post.id} className="adm-post-row">
              <div className="adm-post-row-header">
                <div className="adm-post-row-title">
                  <StatusBadge status={post.status} />
                  <span>{post.blog_title || "(Untitled)"}</span>
                </div>
                <div className="adm-post-row-actions">
                  <button
                    className="adm-pill-btn"
                    onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                  >
                    <i className={`ti ${expandedId === post.id ? "ti-chevron-up" : "ti-chevron-down"}`} />
                    {expandedId === post.id ? "Collapse" : "Preview"}
                  </button>
                  <button className="adm-btn-edit" onClick={() => openEdit(post)}>
                    <i className="ti ti-pencil" /> Edit
                  </button>
                </div>
              </div>

              {expandedId === post.id && (
                <div className="adm-post-preview">
                  <p><b>Slug:</b> {post.slug}</p>
                  <p><b>Meta:</b> {post.meta_description}</p>
                  <p><b>CTA:</b> {post.cta}</p>
                  <p><b>Hashtags:</b> {post.hashtags}</p>
                  <div className="adm-post-preview-article">
                    {(post.article || "").split("\n").filter(Boolean).slice(0, 6).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                    {(post.article || "").split("\n").filter(Boolean).length > 6 && (
                      <p className="adm-preview-more">… (truncated — click Edit to see full content)</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Drawer */}
      {editing && (
        <div className="adm-modal-overlay" onClick={() => setEditing(null)}>
          <div className="adm-modal adm-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2><i className="ti ti-edit" /> Edit Post #{editing.id}</h2>
              <button className="adm-modal-close" onClick={() => setEditing(null)}>
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="adm-modal-form adm-modal-scrollable">
              {/* Status change */}
              <label>
                <span>Status</span>
                <select
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              {EDITABLE_FIELDS.map(({ key, label, type, rows }) => (
                <label key={key}>
                  <span>{label}</span>
                  {type === "textarea" ? (
                    <textarea
                      className="edit-textarea"
                      rows={rows}
                      value={editing[key]}
                      onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                    />
                  ) : (
                    <input
                      className="edit-input"
                      value={editing[key]}
                      onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn-primary" onClick={saveEdit} disabled={saving}>
                <i className="ti ti-device-floppy" /> {saving ? "Saving…" : "Save Changes"}
              </button>
              <button className="adm-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
