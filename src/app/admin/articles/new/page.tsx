
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Save,
  Send,
  Sparkles,
  X,
  WandSparkles,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ArticleStatus = "Draft" | "Published";

type GeneratedArticle = {
  title: string;
  excerpt: string;
  paragraphs: string[];
};

export default function NewArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [status, setStatus] = useState<ArticleStatus>("Draft");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);

  // AI assistant states
  const [aiBrief, setAiBrief] = useState("");
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  // Load categories from Supabase
  useEffect(() => {
    async function loadCategories() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name");

      if (error) {
        alert("Unable to load categories: " + error.message);
      } else {
        setCategories(data ?? []);
      }

      setLoadingCategories(false);
    }

    loadCategories();
  }, []);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(createSlug(value));
  };

  // Generate article using Groq AI
  async function handleGenerateArticle() {
    if (generating) return;

    if (aiBrief.trim().length < 10) {
      setAiError("Please describe your article idea in at least 10 characters.");
      return;
    }

    if (aiBrief.trim().length > 3000) {
      setAiError("Your article brief cannot exceed 3,000 characters.");
      return;
    }

    setGenerating(true);
    setAiError("");

    try {
      const selectedCategory = categories.find(
        (item) => item.id === category
      );

      const response = await fetch("/api/admin/generate-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brief: aiBrief.trim(),
          category: selectedCategory?.name || "General",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to generate your article. Please try again."
        );
      }

      const article = data.article as GeneratedArticle;

      if (
        !article ||
        typeof article.title !== "string" ||
        typeof article.excerpt !== "string" ||
        !Array.isArray(article.paragraphs) ||
        !article.paragraphs.every(
          (paragraph) => typeof paragraph === "string"
        )
      ) {
        throw new Error("The AI returned an invalid article. Please try again.");
      }

      // Populate the existing article form
      handleTitleChange(article.title.trim());

      // Keep the excerpt within the existing 250-character limit
      setExcerpt(article.excerpt.trim().slice(0, 250));

      // Convert generated paragraphs into the existing content format
      setContent(
        article.paragraphs
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
          .join("\n\n")
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while generating your article.";

      setAiError(message);
    } finally {
      setGenerating(false);
    }
  }

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

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const removeCoverImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setCoverFile(null);
    setImagePreview("");
  };

  async function handleSubmit(publish: boolean) {
    if (saving) return;

    if (
      !title.trim() ||
      !slug.trim() ||
      !category ||
      !excerpt.trim() ||
      !content.trim()
    ) {
      alert(
        "Please complete the title, URL, category, excerpt and article content."
      );
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      alert("Please enter a valid article URL.");
      return;
    }

    setSaving(true);

    const supabase = createClient();

    try {
      // Confirm the administrator's current session
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Your session has expired. Please log in again.");
      }

      // Upload cover image if one was selected
      let coverImageUrl: string | null = null;

      if (coverFile) {
        const fileExtension =
          coverFile.name.split(".").pop()?.toLowerCase() || "jpg";

        const filePath = `${user.id}/${crypto.randomUUID()}.${fileExtension}`;

        const { data: uploadData, error: uploadError } =
          await supabase.storage
            .from("article-covers")
            .upload(filePath, coverFile, {
              contentType: coverFile.type,
              cacheControl: "3600",
              upsert: false,
            });

        if (uploadError) {
          throw new Error("Image upload failed: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("article-covers")
          .getPublicUrl(uploadData.path);

        coverImageUrl = publicUrlData.publicUrl;
      }

      // Convert the text into structured article paragraphs
      const articleSections = [
        {
          heading: "",
          paragraphs: content
            .trim()
            .split(/\n\s*\n/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean),
        },
      ];

      // Estimate reading time at approximately 200 words per minute
      const wordCount = content.trim().split(/\s+/).length;
      const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

      // Save the article to Supabase
      const { error: insertError } = await supabase
        .from("articles")
        .insert({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content: articleSections,
          category_id: category,
          cover_image_url: coverImageUrl,
          author_id: user.id,
          author_name: "The Open Tab Editorial",
          read_time_minutes: readTimeMinutes,
          status: publish ? "published" : "draft",
          published_at: publish ? new Date().toISOString() : null,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setStatus(publish ? "Published" : "Draft");

      alert(
        publish
          ? "Article published successfully!"
          : "Article saved as a draft successfully!"
      );

      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      alert(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin/articles"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#777783] transition hover:text-[#24264A]"
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
              Create an article
            </h1>
            <p className="mt-2 text-sm text-[#777783]">
              Create, prepare and publish a new story.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving || generating}
              onClick={() => handleSubmit(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E9E7E1] bg-white px-5 py-3 text-sm font-semibold text-[#24264A] transition hover:bg-[#F2F0EB] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save draft"}
            </button>

            <button
              type="button"
              disabled={saving || generating}
              onClick={() => handleSubmit(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#24264A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#35385F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={16} />
              {saving ? "Processing..." : "Publish article"}
            </button>
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1fr_320px]">
          <div className="space-y-7">
            {/* Article information */}
            <section className="rounded-2xl border border-[#E9E7E1] bg-white p-6 sm:p-8">
              <h2 className="mb-6 text-lg font-bold text-[#24264A]">
                Article information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#30303A]">
                    Article title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter your article title"
                    className="w-full rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3.5 text-sm outline-none transition focus:border-[#24264A]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#30303A]">
                    Article URL
                  </label>
                  <div className="flex items-center rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4">
                    <span className="shrink-0 text-xs text-[#9999A1]">
                      /blog/
                    </span>
                    <input
                      value={slug}
                      onChange={(e) => setSlug(createSlug(e.target.value))}
                      placeholder="article-url"
                      className="min-w-0 flex-1 bg-transparent py-3.5 pl-1 text-sm text-[#24264A] outline-none"
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#9999A1]">
                    Automatically generated. You can edit it.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#30303A]">
                    Short description / Excerpt
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={4}
                    maxLength={250}
                    placeholder="Write a short introduction to your article..."
                    className="w-full resize-none rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3.5 text-sm outline-none transition focus:border-[#24264A]"
                  />
                  <p className="mt-2 text-right text-xs text-[#9999A1]">
                    {excerpt.length}/250 characters
                  </p>
                </div>
              </div>
            </section>

            {/* Article content */}
            <section className="rounded-2xl border border-[#E9E7E1] bg-white p-6 sm:p-8">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#24264A]">
                    Article content
                  </h2>
                  <p className="mt-1 text-xs text-[#9999A1]">
                    Write or edit the main body of your story.
                  </p>
                </div>
                <span className="rounded-full bg-[#F1F0F8] px-3 py-1.5 text-xs font-semibold text-[#24264A]">
                  Basic editor
                </span>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                placeholder={`Start writing your article here...

Separate paragraphs with a blank line.

You can also generate an article using the AI assistant.`}
                className="w-full resize-y rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-5 py-4 text-sm leading-7 text-[#30303A] outline-none transition focus:border-[#24264A]"
              />

              <p className="mt-3 text-xs text-[#9999A1]">
                {content.trim() ? content.trim().split(/\s+/).length : 0} words
              </p>
            </section>
          </div>

          <aside className="space-y-7">
            {/* AI writing assistant */}
            <section className="rounded-2xl border border-[#E9E7E1] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F0F8]">
                  <Sparkles size={21} className="text-[#24264A]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#24264A]">
                    AI writing assistant
                  </h2>
                  <p className="text-xs text-[#777783]">
                    Powered by Groq AI
                  </p>
                </div>
              </div>

              <p className="mb-4 text-xs leading-6 text-[#777783]">
                Describe the article you want to create. AI will generate
                a title, short description and complete article for you.
              </p>

              <label className="mb-2 block text-sm font-semibold text-[#30303A]">
                What should the article cover?
              </label>

              <textarea
                value={aiBrief}
                onChange={(e) => {
                  setAiBrief(e.target.value);
                  setAiError("");
                }}
                rows={5}
                maxLength={3000}
                disabled={generating}
                placeholder="Example: Explain how artificial intelligence is transforming small businesses, including its benefits, challenges and future opportunities."
                className="w-full resize-y rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#24264A] disabled:opacity-60"
              />

              <p className="mb-4 mt-2 text-right text-xs text-[#9999A1]">
                {aiBrief.length}/3000 characters
              </p>

              {aiError && (
                <div
                  role="alert"
                  className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700"
                >
                  {aiError}
                </div>
              )}

              <button
                type="button"
                onClick={handleGenerateArticle}
                disabled={generating || saving || aiBrief.trim().length < 10}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#24264A] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#35385F] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generating article...
                  </>
                ) : (
                  <>
                    <WandSparkles size={17} />
                    Generate article
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[11px] leading-5 text-[#9999A1]">
                Review and edit AI-generated content before publishing.
              </p>
            </section>

            {/* Publishing details */}
            <section className="rounded-2xl border border-[#E9E7E1] bg-white p-6">
              <h2 className="mb-5 text-base font-bold text-[#24264A]">
                Publishing details
              </h2>

              <label className="mb-2 block text-sm font-semibold text-[#30303A]">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loadingCategories}
                className="mb-6 w-full rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-3 py-3 text-sm outline-none focus:border-[#24264A] disabled:opacity-50"
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select a category"}
                </option>

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
                  {status}
                </p>
                <p className="mt-1 text-xs leading-5 text-[#777783]">
                  {status === "Draft"
                    ? "Your article will remain unpublished until you publish it."
                    : "Your article has been published."}
                </p>
              </div>
            </section>

            {/* Cover image */}
            <section className="rounded-2xl border border-[#E9E7E1] bg-white p-6">
              <h2 className="mb-2 text-base font-bold text-[#24264A]">
                Cover image
              </h2>
              <p className="mb-5 text-xs leading-5 text-[#777783]">
                Choose an image to represent your article. Maximum size: 5MB.
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
                    onClick={removeCoverImage}
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
          </aside>
        </div>
      </div>
    </div>
  );
}
