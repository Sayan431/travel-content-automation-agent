// import { useEffect, useState } from "react";
// import api from "../api/client";
// import StatusBadge from "../components/StatusBadge";

// export default function ContentReview() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [fetching, setFetching] = useState(false);
//   const [actionId, setActionId] = useState(null);

//   const load = async () => {
//     try {
//       const res = await api.get("/content/pending");
//       setItems(res.data || []);
//     } catch (error) {
//       alert("Failed to load generated blogs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const fetchAndGenerate = async () => {
//     try {
//       setFetching(true);

//       const res = await api.post("/feeds/fetch");

//       alert(
//         `Fetched ${res.data.new_articles} new articles and generated ${res.data.generated_content} AI blogs.`
//       );

//       await load();
//     } catch (error) {
//       alert("RSS fetch and AI blog generation failed.");
//     } finally {
//       setFetching(false);
//     }
//   };

//   const accept = async (id) => {
//     try {
//       setActionId(id);

//       await api.post(`/content/${id}/accept`);

//       await load();

//       alert("Selected blog accepted and posted successfully.");
//     } catch (error) {
//       alert("Accept/post failed.");
//     } finally {
//       setActionId(null);
//     }
//   };

//   const reject = async (id) => {
//     try {
//       setActionId(id);

//       await api.post(`/content/${id}/reject`);

//       await load();

//       alert("Selected blog rejected.");
//     } catch (error) {
//       alert("Reject failed.");
//     } finally {
//       setActionId(null);
//     }
//   };

//   if (loading) {
//     return <p>Loading content review...</p>;
//   }

//   return (
//     <>
//       <div className="page-head">
//         <div>
//           <p className="eyebrow">AI Travel Content Review</p>
//           <h1>Generated Travel Blogs</h1>
//           <p>
//             Fetch latest travel news, auto-generate AI blogs, then accept or reject each post.
//           </p>
//         </div>

//         <button type="button" onClick={fetchAndGenerate} disabled={fetching}>
//           {fetching ? "Fetching & Generating..." : "Fetch RSS & Generate Blogs"}
//         </button>
//       </div>

//       {items.length === 0 ? (
//         <div className="card empty-state">
//           <h2>No pending blogs</h2>
//           <p>Click “Fetch RSS & Generate Blogs” to create fresh AI travel content.</p>
//         </div>
//       ) : (
//         <div className="review-list">
//           {items.map((content) => (
//             <div className="card blog-review-card" key={content.id}>
//               <div className="blog-hero">
//                 <span>TRAVEL CONTENT</span>
//                 <h2>{content.blog_title}</h2>
//               </div>

//               <StatusBadge status={content.status} />

//               <section className="blog-section">
//                 <h3>SEO Details</h3>
//                 <p>
//                   <b>Slug:</b> {content.slug}
//                 </p>
//                 <p>
//                   <b>Meta Description:</b> {content.meta_description}
//                 </p>
//               </section>

//               <section className="blog-section">
//                 <h3>Generated Blog</h3>

//                 <article className="formatted-blog">
//                   {(content.article || "")
//                     .split("\n")
//                     .filter((paragraph) => paragraph.trim() !== "")
//                     .map((paragraph, index) => (
//                       <p key={index}>{paragraph}</p>
//                     ))}
//                 </article>
//               </section>

//               <section className="blog-section">
//                 <h3>Social Media Ready Posts</h3>

//                 <div className="social-grid">
//                   <div>
//                     <h4>Instagram</h4>
//                     <p>{content.instagram_caption}</p>
//                   </div>

//                   <div>
//                     <h4>Facebook</h4>
//                     <p>{content.facebook_post}</p>
//                   </div>

//                   <div>
//                     <h4>LinkedIn</h4>
//                     <p>{content.linkedin_post}</p>
//                   </div>
//                 </div>
//               </section>

//               <section className="blog-section">
//                 <p>
//                   <b>Hashtags:</b> {content.hashtags}
//                 </p>
//                 <p>
//                   <b>CTA:</b> {content.cta}
//                 </p>
//               </section>

//               <div className="actions">
//                 <button
//                   type="button"
//                   disabled={actionId === content.id}
//                   onClick={() => accept(content.id)}
//                 >
//                   {actionId === content.id ? "Posting..." : "Accept & Auto Post"}
//                 </button>

//                 <button
//                   type="button"
//                   className="danger"
//                   disabled={actionId === content.id}
//                   onClick={() => reject(content.id)}
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </>
//   );
// }

















import { useEffect, useState } from "react";
import api from "../api/client";
import StatusBadge from "../components/StatusBadge";

const fallbackBlogImage =
  "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1400&q=80";

const blogImages = [
  {
    keywords: ["paris", "eiffel", "louvre", "seine", "montmartre", "france", "french"],
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["amsterdam", "canal", "van gogh", "jordaan", "dam square", "netherlands", "dutch"],
    image:
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["keukenhof", "tulip", "flower", "garden", "spring"],
    image:
      "https://images.unsplash.com/photo-1584003564911-a7a321c84e1c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["beach", "sea", "coast", "pier", "scheveningen"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["brussels", "belgium", "chocolate", "mini europe"],
    image:
      "https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["giethoorn", "village", "boat", "countryside"],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  },
];

const getRelatedBlogImage = (content) => {
  const text = [
    content.blog_title,
    content.slug,
    content.meta_description,
    content.article,
    content.instagram_caption,
    content.facebook_post,
    content.linkedin_post,
    content.hashtags,
    content.cta,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const matchedImage = blogImages.find((item) =>
    item.keywords.some((keyword) => text.includes(keyword))
  );

  return matchedImage ? matchedImage.image : fallbackBlogImage;
};

export default function ContentReview() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [editMap, setEditMap] = useState({}); // { [contentId]: draftObject | null }
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get("/content/pending");
      setItems(res.data || []);
    } catch (error) {
      alert("Failed to load generated blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const fetchAndGenerate = async () => {
    try {
      setFetching(true);
      const res = await api.post("/feeds/fetch");
      alert(
        `Fetched ${res.data.new_articles} new articles and generated ${res.data.generated_content} AI blogs.`
      );
      await load();
    } catch (error) {
      alert("RSS fetch and AI blog generation failed.");
    } finally {
      setFetching(false);
    }
  };

  const startEdit = (content) => {
    setEditMap((prev) => ({
      ...prev,
      [content.id]: {
        blog_title: content.blog_title || "",
        slug: content.slug || "",
        meta_description: content.meta_description || "",
        article: content.article || "",
        instagram_caption: content.instagram_caption || "",
        facebook_post: content.facebook_post || "",
        linkedin_post: content.linkedin_post || "",
        hashtags: content.hashtags || "",
        cta: content.cta || "",
      },
    }));
  };

  const cancelEdit = (id) => {
    setEditMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateDraft = (id, field, value) => {
    setEditMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const saveEdit = async (id) => {
    try {
      setSavingId(id);
      await api.put(`/content/${id}`, editMap[id]);
      cancelEdit(id);
      await load();
    } catch (error) {
      alert("Failed to save changes.");
    } finally {
      setSavingId(null);
    }
  };

  const accept = async (id) => {
    try {
      setActionId(id);
      await api.post(`/content/${id}/accept`);
      await load();
      alert("Selected blog approved and posted successfully.");
    } catch (error) {
      alert("Accept/post failed.");
    } finally {
      setActionId(null);
    }
  };

  const reject = async (id) => {
    try {
      setActionId(id);
      await api.post(`/content/${id}/reject`);
      await load();
      alert("Selected blog rejected.");
    } catch (error) {
      alert("Reject failed.");
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return <p>Loading content review...</p>;
  }

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">AI Travel Content Review</p>
          <h1>Generated Travel Blogs</h1>
          <p>
            Fetch latest travel news, auto-generate AI blogs, then edit, accept or reject each post.
          </p>
        </div>
        <button type="button" onClick={fetchAndGenerate} disabled={fetching}>
          {fetching ? "Fetching & Generating..." : "Fetch RSS & Generate Blogs"}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="card empty-state">
          <h2>No pending blogs</h2>
          <p>Click "Fetch RSS & Generate Blogs" to create fresh AI travel content.</p>
        </div>
      ) : (
        <div className="review-list">
          {items.map((content) => {
            const blogImage = getRelatedBlogImage(content);
            const draft = editMap[content.id];
            const isEditing = Boolean(draft);

            return (
              <div className="card blog-review-card" key={content.id}>
                <div
                  className="blog-hero"
                  style={{
                    backgroundImage: `
                      linear-gradient(
                        to bottom,
                        rgba(0, 0, 0, 0.25),
                        rgba(0, 0, 0, 0.68)
                      ),
                      url(${blogImage})
                    `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "280px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "2rem",
                    color: "#fff",
                  }}
                >
                  <span>TRAVEL CONTENT</span>
                  <h2>{isEditing ? draft.blog_title || content.blog_title : content.blog_title}</h2>
                </div>

                <StatusBadge status={content.status} />

                {/* ── EDIT TOGGLE BAR ── */}
                <div className="edit-toolbar">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="btn-edit-save"
                        disabled={savingId === content.id}
                        onClick={() => saveEdit(content.id)}
                      >
                        <i className="ti ti-device-floppy" />
                        {savingId === content.id ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        className="btn-edit-cancel"
                        onClick={() => cancelEdit(content.id)}
                      >
                        <i className="ti ti-x" /> Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn-edit-toggle"
                      onClick={() => startEdit(content)}
                    >
                      <i className="ti ti-pencil" /> Edit Content
                    </button>
                  )}
                </div>

                {/* ── SEO ── */}
                <section className="blog-section">
                  <h3>SEO Details</h3>
                  {isEditing ? (
                    <div className="edit-fields">
                      <label>
                        <span>Title</span>
                        <input
                          className="edit-input"
                          value={draft.blog_title}
                          onChange={(e) => updateDraft(content.id, "blog_title", e.target.value)}
                        />
                      </label>
                      <label>
                        <span>Slug</span>
                        <input
                          className="edit-input"
                          value={draft.slug}
                          onChange={(e) => updateDraft(content.id, "slug", e.target.value)}
                        />
                      </label>
                      <label>
                        <span>Meta Description</span>
                        <input
                          className="edit-input"
                          value={draft.meta_description}
                          onChange={(e) => updateDraft(content.id, "meta_description", e.target.value)}
                        />
                      </label>
                    </div>
                  ) : (
                    <>
                      <p><b>Slug:</b> {content.slug}</p>
                      <p><b>Meta Description:</b> {content.meta_description}</p>
                    </>
                  )}
                </section>

                {/* ── ARTICLE ── */}
                <section className="blog-section">
                  <h3>Generated Blog</h3>
                  {isEditing ? (
                    <label>
                      <textarea
                        className="edit-textarea"
                        rows={14}
                        value={draft.article}
                        onChange={(e) => updateDraft(content.id, "article", e.target.value)}
                      />
                    </label>
                  ) : (
                    <article className="formatted-blog">
                      {(content.article || "")
                        .split("\n")
                        .filter((p) => p.trim() !== "")
                        .map((p, i) => <p key={i}>{p}</p>)}
                    </article>
                  )}
                </section>

                {/* ── SOCIAL ── */}
                <section className="blog-section">
                  <h3>Social Media Ready Posts</h3>
                  {isEditing ? (
                    <div className="edit-fields">
                      <label>
                        <span>Instagram Caption</span>
                        <textarea
                          className="edit-textarea"
                          rows={4}
                          value={draft.instagram_caption}
                          onChange={(e) => updateDraft(content.id, "instagram_caption", e.target.value)}
                        />
                      </label>
                      <label>
                        <span>Facebook Post</span>
                        <textarea
                          className="edit-textarea"
                          rows={4}
                          value={draft.facebook_post}
                          onChange={(e) => updateDraft(content.id, "facebook_post", e.target.value)}
                        />
                      </label>
                      <label>
                        <span>LinkedIn Post</span>
                        <textarea
                          className="edit-textarea"
                          rows={4}
                          value={draft.linkedin_post}
                          onChange={(e) => updateDraft(content.id, "linkedin_post", e.target.value)}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="social-grid">
                      <div><h4>Instagram</h4><p>{content.instagram_caption}</p></div>
                      <div><h4>Facebook</h4><p>{content.facebook_post}</p></div>
                      <div><h4>LinkedIn</h4><p>{content.linkedin_post}</p></div>
                    </div>
                  )}
                </section>

                {/* ── HASHTAGS & CTA ── */}
                <section className="blog-section">
                  {isEditing ? (
                    <div className="edit-fields">
                      <label>
                        <span>Hashtags</span>
                        <input
                          className="edit-input"
                          value={draft.hashtags}
                          onChange={(e) => updateDraft(content.id, "hashtags", e.target.value)}
                        />
                      </label>
                      <label>
                        <span>CTA</span>
                        <input
                          className="edit-input"
                          value={draft.cta}
                          onChange={(e) => updateDraft(content.id, "cta", e.target.value)}
                        />
                      </label>
                    </div>
                  ) : (
                    <>
                      <p><b>Hashtags:</b> {content.hashtags}</p>
                      <p><b>CTA:</b> {content.cta}</p>
                    </>
                  )}
                </section>

                <div className="actions">
                  <button
                    type="button"
                    disabled={actionId === content.id || isEditing}
                    onClick={() => accept(content.id)}
                  >
                    {actionId === content.id ? "Posting..." : "Accept & Auto Post"}
                  </button>
                  <button
                    type="button"
                    className="danger"
                    disabled={actionId === content.id || isEditing}
                    onClick={() => reject(content.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}




