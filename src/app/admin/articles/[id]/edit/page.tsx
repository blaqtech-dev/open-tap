
"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Send,
  ImagePlus,
  Sparkles,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
};

type ArticleSection = {
  heading?: string;
  paragraphs?: string[];
};

type Article = {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  excerpt: string;
  content: unknown;
  status: "published" | "draft";
  published_at: string | null;
  cover_image_url: string | null;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function contentToText(value: unknown): string {
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value
      .map((section) => {
        const item = section as ArticleSection;

        return (item.paragraphs ?? []).join("\n\n");
      })
      .filter(Boolean)
      .join("\n\n");
  }

  return "";
}

function getStoragePath(url: string): string | null {
  const marker = "/storage/v1/object/public/article-covers/";

  if (!url.includes(marker)) return null;

  return decodeURIComponent(url.split(marker)[1]);
}

function EditArticleContent() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const [status, setStatus] = useState<"published" | "draft">("draft");
  const [originalPublishedAt, setOriginalPublishedAt] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadArticle = useCallback(async () => {
    const supabase = createClient();

    try {
      const [articleResult, categoryResult] = await Promise.all([
        supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .maybeSingle(),

        supabase
          .from("categories")
          .select("id, name")
          .order("name"),
      ]);

      if (articleResult.error) {
        throw new Error(articleResult.error.message);
      }

      if (categoryResult.error) {
        throw new Error(categoryResult.error.message);
      }

      if (!articleResult.data) {
        setLoading(false);
        return;
      }

      const article = articleResult.data as Article;

      setTitle(article.title);
      setSlug(article.slug);
      setCategory(article.category_id ?? "");
      setExcerpt(article.excerpt);
      setContent(contentToText(article.content));
      setStatus(article.status);
      setOriginalPublishedAt(article.published_at);
      setCoverImageUrl(article.cover_image_url ?? "");
      setImagePreview(article.cover_image_url ?? "");
      setCategories(categoryResult.data ?? []);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to load this article."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      alert("Please select a PNG, JPG or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must not exceed 5MB.");
      event.target.value = "";
      return;
    }

    setCoverFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveExistingImage(false);
  };

  const handleRemoveImage = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setCoverFile(null);
    setImagePreview("");
    setRemoveExistingImage(true);
  };

  async function handleUpdate(publish: boolean) {
    if (saving) return;

    if (
      !title.trim() ||
      !slug.trim() ||
      !category ||
      !excerpt.trim() ||
      !content.trim()
    ) {
      alert("Please complete all required article fields.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      alert("Please enter a valid article URL.");
      return;
    }

    setSaving(true);

    const supabase = createClient();

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Your session has expired. Please log in again.");
      }

      let newCoverImageUrl = removeExistingImage
        ? null
        : coverImageUrl || null;

      let uploadedImagePath: string | null = null;

      // Upload a replacement cover image when selected
      if (coverFile) {
        const extension =
          coverFile.name.split(".").pop()?.toLowerCase() || "jpg";

        uploadedImagePath =
          `${user.id}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("article-covers")
          .upload(uploadedImagePath, coverFile, {
            contentType: coverFile.type,
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error("Image upload failed: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("article-covers")
          .getPublicUrl(uploadedImagePath);

        newCoverImageUrl = publicUrlData.publicUrl;
      }

      const articleSections: ArticleSection[] = [
        {
          heading: "",
          paragraphs: content
            .trim()
            .split(/\n\s*\n/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean),
        },
      ];

      const wordCount = content.trim().split(/\s+/).length;
      const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

      const nextStatus = publish ? "published" : status;

      const nextPublishedAt =
        nextStatus === "published"
          ? originalPublishedAt ?? new Date().toISOString()
          : null;

      const { error: updateError } = await supabase
        .from("articles")
        .update({
          title: title.trim(),
          slug: slug.trim(),
          category_id: category,
          excerpt: excerpt.trim(),
          content: articleSections,
          cover_image_url: newCoverImageUrl,
          read_time_minutes: readTimeMinutes,
          status: nextStatus,
          published_at: nextPublishedAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        // Avoid leaving a newly uploaded image behind if saving fails
        if (uploadedImagePath) {
          await supabase.storage
            .from("article-covers")
            .remove([uploadedImagePath]);
        }

        throw new Error(updateError.message);
      }

      // Remove the previous cover image after the database update succeeds
      if (
        coverImageUrl &&
        (coverFile || removeExistingImage)
      ) {
        const oldImagePath = getStoragePath(coverImageUrl);

        if (oldImagePath) {
          const { error: removeError } = await supabase.storage
            .from("article-covers")
            .remove([oldImagePath]);

          if (removeError) {
            console.error("Old cover image removal failed:", removeError);
          }
        }
      }

      alert(
        publish
          ? "Article published successfully!"
          : "Article changes saved successfully!"
      );

      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating the article."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[#777783]">
        Loading article...
      </div>
    );
  }

  if (!title && !slug) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
        <h1 className="editorial-heading text-3xl font-bold text-[#24264A]">
          Article not found
        </h1>
        <p className="mt-3 text-sm text-[#777783]">
          This article could not be found in your database.
        </p>
        <Link
          href="/admin/articles"
          className="mt-6 rounded-xl bg-[#24264A] px-5 py-3 text-sm font-semibold text-white"
        >
          Back to articles
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin/articles"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#777783] hover:text-[#24264A]"
        >
          <ArrowLeft size={17} />
          Back to articles
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#777783]">
              Content management
            </p>
            <h1 className="editorial-heading text-4xl font-bold text-[#24264A]">
              Edit article
            </h1>
            <p className="mt-2 text-sm text-[#777783]">
              Make changes to your existing story.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleUpdate(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E9E7E1] bg-white px-5 py-3 text-sm font-semibold text-[#24264A] hover:bg-[#F2F0EB] disabled:opacity-50"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save changes"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleUpdate(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#24264A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#35385F] disabled:opacity-50"
            >
              <Send size={16} />
              {saving ? "Processing..." : "Publish"}
            </button>
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1fr_320px]">
          <div className="space-y-7">
            <section className="rounded-2xl border border-[#E9E7E1] bg-white p-6 sm:p-8">
              <h2 className="mb-6 text-lg font-bold text-[#24264A]">
                Article information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Article title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setSlug(createSlug(e.target.value));
                    }}
                    className="w-full rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3.5 text-sm outline-none focus:border-[#24264A]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Article URL
                  </label>
                  <div className="flex items-center rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4">
                    <span className="shrink-0 text-xs text-[#9999A1]">
                      /blog/
                    </span>
                    <input
                      value={slug}
                      onChange={(e) => setSlug(createSlug(e.target.value))}
                      className="min-w-0 flex-1 bg-transparent py-3.5 pl-1 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Short description
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={4}
                    maxLength={250}
                    className="w-full resize-none rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3.5 text-sm outline-none focus:border-[#24264A]"
                  />
                  <p className="mt-2 text-right text-xs text-[#9999A1]">
                    {excerpt.length}/250 characters
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E9E7E1] bg-white p-6 sm:p-8">
              <h2 className="mb-5 text-lg font-bold text-[#24264A]">
                Article content
              </h2>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="w-full resize-y rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-5 py-4 text-sm leading-7 outline-none focus:border-[#24264A]"
              />

              <p className="mt-3 text-xs text-[#9999A1]">
                {content.trim() ? content.trim().split(/\s+/).length : 0} words
              </p>
            </section>
          </div>

          <aside className="space-y-7">
            <section className="rounded-2xl border border-[#E9E7E1] bg-white p-6">
              <h2 className="mb-5 text-base font-bold text-[#24264A]">
                Publishing details
              </h2>

              <label className="mb-2 block text-sm font-semibold">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mb-6 w-full rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-3 py-3 text-sm outline-none focus:border-[#24264A]"
              >
                <option value="">Select category</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <div className="rounded-xl bg-[#F8F7F4] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#777783]">
                  Current status
                </p>
                <p className="mt-2 text-sm font-bold text-[#24264A]">
                  {status === "published" ? "Published" : "Draft"}
                </p>
                <p className="mt-1 text-xs leading-5 text-[#777783]">
                  Saving changes keeps the current status. Use Publish to
                  publish this article.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E9E7E1] bg-white p-6">
              <h2 className="mb-2 text-base font-bold text-[#24264A]">
                Cover image
              </h2>

              <p className="mb-5 text-xs leading-5 text-[#777783]">
                Upload a new image to replace the current cover. Maximum size:
                5MB.
              </p>

              {imagePreview ? (
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={imagePreview}
                    alt="Article cover preview"
                    className="h-44 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-3 top-3 rounded-full bg-white p-2 text-[#24264A] shadow"
                    aria-label="Remove cover image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E3E0D9] bg-[#FCFBF9] px-4 py-10 text-center transition hover:border-[#24264A]">
                  <ImagePlus size={27} className="mb-3 text-[#777783]" />
                  <span className="text-sm font-semibold text-[#24264A]">
                    Upload cover image
                  </span>
                  <span className="mt-1 text-xs text-[#9999A1]">
                    PNG, JPG or WEBP
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {coverFile && (
                <p className="mt-3 break-all text-xs text-[#777783]">
                  {coverFile.name}
                </p>
              )}
            </section>

            <div className="rounded-2xl bg-[#24264A] p-6 text-white">
              <Sparkles size={22} className="mb-4 text-[#D9D7FF]" />
              <h3 className="font-bold">AI writing assistance</h3>
              <p className="mt-2 text-xs leading-6 text-white/70">
                AI-assisted editing and article improvement will be available
                after API integration.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function EditArticlePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-[#777783]">
          Loading article editor...
        </div>
      }
    >
      <EditArticleContent />
    </Suspense>
  );
}
