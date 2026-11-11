
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  FolderOpen,
  Pencil,
  Trash2,
  X,
  ArrowUpRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const supabase = createClient();

  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  // Fetch categories and their actual article counts.
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    const [categoriesResult, articlesResult] = await Promise.all([
      supabase
        .from("categories")
        .select("id, name, slug, description")
        .order("name", { ascending: true }),

      supabase
        .from("articles")
        .select("category_id"),
    ]);

    if (categoriesResult.error || articlesResult.error) {
      console.error(
        "Categories loading error:",
        categoriesResult.error || articlesResult.error
      );

      setError("Unable to load categories. Please refresh the page.");
      setLoading(false);
      return;
    }

    const articleCounts = new Map<string, number>();

    (articlesResult.data ?? []).forEach((article) => {
      if (article.category_id) {
        articleCounts.set(
          article.category_id,
          (articleCounts.get(article.category_id) ?? 0) + 1
        );
      }
    });

    const formattedCategories: Category[] = (
      categoriesResult.data ?? []
    ).map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      articleCount: articleCounts.get(category.id) ?? 0,
    }));

    setCategories(formattedCategories);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter((category) =>
    `${category.name} ${category.description}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setError("");
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);
    setError("");
    setShowModal(true);
  };

  // Save a new category or update an existing one.
  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const slug = generateSlug(trimmedName);

    if (!trimmedName || !trimmedDescription) {
      alert("Please enter a category name and description.");
      return;
    }

    if (!slug) {
      alert("Please enter a valid category name.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        (category.name.toLowerCase() === trimmedName.toLowerCase() ||
          category.slug === slug) &&
        category.id !== editingCategory?.id
    );

    if (duplicate) {
      alert("A category with this name or URL slug already exists.");
      return;
    }

    setSaving(true);

    let result;

    if (editingCategory) {
      result = await supabase
        .from("categories")
        .update({
          name: trimmedName,
          slug,
          description: trimmedDescription,
        })
        .eq("id", editingCategory.id);
    } else {
      result = await supabase.from("categories").insert({
        name: trimmedName,
        slug,
        description: trimmedDescription,
      });
    }

    if (result.error) {
      console.error("Category save error:", result.error);

      if (result.error.code === "23505") {
        alert("A category with this name or slug already exists.");
      } else {
        alert("Unable to save category. Please try again.");
      }

      setSaving(false);
      return;
    }

    setSaving(false);
    setShowModal(false);
    setEditingCategory(null);

    await fetchCategories();
  };

  // Delete only categories that have no assigned articles.
  const handleDelete = async (category: Category) => {
    if (category.articleCount > 0) {
      alert(
        "This category has articles assigned to it. Reassign those articles before deleting this category."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    setDeletingId(category.id);

    // Check the database again before deletion.
    const { count, error: countError } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("category_id", category.id);

    if (countError) {
      alert("Unable to verify this category's articles. Please try again.");
      setDeletingId(null);
      return;
    }

    if ((count ?? 0) > 0) {
      alert(
        "This category now has assigned articles. Reassign them before deleting."
      );
      setDeletingId(null);
      await fetchCategories();
      return;
    }

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (deleteError) {
      console.error("Category delete error:", deleteError);
      alert("Unable to delete this category. Please try again.");
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    await fetchCategories();
  };

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#777783]">
              Content organisation
            </p>

            <h1 className="editorial-heading text-4xl font-bold text-[#24264A]">
              Categories
            </h1>

            <p className="mt-2 text-sm text-[#777783]">
              Organise your stories into meaningful topics.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#24264A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#35385F]"
          >
            <Plus size={18} />
            Add category
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E9E7E1] bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#777783]">Total categories</p>
              <FolderOpen size={20} className="text-[#777783]" />
            </div>

            <h2 className="mt-3 text-3xl font-bold text-[#24264A]">
              {categories.length.toString().padStart(2, "0")}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#E9E7E1] bg-white p-6">
            <p className="text-sm text-[#777783]">
              Articles in categories
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#24264A]">
              {categories.reduce(
                (total, category) => total + category.articleCount,
                0
              )}
            </h2>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#E9E7E1] bg-white px-4">
          <Search size={18} className="text-[#9999A1]" />

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-transparent py-4 text-sm outline-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={fetchCategories}
              className="ml-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Categories */}
        {loading ? (
          <div className="rounded-2xl border border-[#E9E7E1] bg-white px-5 py-16 text-center text-sm text-[#777783]">
            Loading categories...
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="rounded-2xl border border-[#E9E7E1] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#24264A]/5"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F0F8] text-[#24264A]">
                    <FolderOpen size={21} />
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(category)}
                      className="rounded-lg p-2 text-[#777783] transition hover:bg-[#F1F0F8] hover:text-[#24264A]"
                      title="Edit category"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(category)}
                      disabled={deletingId === category.id}
                      className="rounded-lg p-2 text-[#9999A1] transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      title="Delete category"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold leading-6 text-[#24264A]">
                  {category.name}
                </h3>

                <p className="mt-2 min-h-[60px] text-sm leading-6 text-[#777783]">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#F0EEE9] pt-4">
                  <span className="text-xs font-medium text-[#777783]">
                    {category.articleCount} articles
                  </span>

                  <Link
                    href={`/category/${category.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#24264A] hover:underline"
                  >
                    View category
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E3E0D9] bg-white px-5 py-16 text-center">
            <FolderOpen
              size={32}
              className="mx-auto mb-4 text-[#9999A1]"
            />

            <h3 className="font-bold text-[#24264A]">
              No categories found
            </h3>

            <p className="mt-2 text-sm text-[#777783]">
              Try another search or create a new category.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#24264A]">
                  {editingCategory ? "Edit category" : "Add category"}
                </h2>

                <p className="mt-1 text-xs text-[#777783]">
                  Enter the details for this category.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-[#777783] hover:bg-[#F8F7F4]"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#30303A]">
                  Category name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Science & Innovation"
                  className="w-full rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3 text-sm outline-none focus:border-[#24264A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#30303A]">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the type of articles in this category..."
                  className="w-full resize-none rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3 text-sm outline-none focus:border-[#24264A]"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-xl bg-[#24264A] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#35385F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingCategory
                    ? "Save changes"
                    : "Create category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
