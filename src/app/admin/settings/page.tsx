
"use client";

import { useState } from "react";
import {
  Settings,
  Globe,
  User,
  Search,
  Bell,
  Save,
  Camera,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const [publicationName, setPublicationName] = useState("The Open Tab");
  const [tagline, setTagline] = useState(
    "Ideas, tools and perspectives for a changing world."
  );
  const [websiteUrl, setWebsiteUrl] = useState("https://theopentab.com");
  const [contactEmail, setContactEmail] = useState(
    "abiolaboluwatife28@gmail.com"
  );

  const [adminName, setAdminName] = useState("Editor");
  const [adminEmail, setAdminEmail] = useState(
    "abiolaboluwatife28@gmail.com"
  );
  const [bio, setBio] = useState(
    "Administrator and editor at The Open Tab."
  );

  const [seoTitle, setSeoTitle] = useState(
    "The Open Tab | Ideas, Tools and Perspectives"
  );
  const [seoDescription, setSeoDescription] = useState(
    "Explore technology, programming, business, digital lifestyle and fresh perspectives."
  );

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newsletterNotifications, setNewsletterNotifications] =
    useState(true);
  const [commentNotifications, setCommentNotifications] = useState(false);

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "profile", label: "Admin profile", icon: User },
    { id: "seo", label: "SEO settings", icon: Search },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const handleSave = () => {
    alert(
      "Settings updated in this session. Permanent saving will be enabled after database integration."
    );
  };

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#777783]">
            Administration
          </p>

          <h1 className="editorial-heading text-4xl font-bold text-[#24264A]">
            Settings
          </h1>

          <p className="mt-2 text-sm text-[#777783]">
            Manage your publication and administrator preferences.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[250px_1fr]">
          <aside className="h-fit rounded-2xl border border-[#E9E7E1] bg-white p-3">
            <p className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-[#9999A1]">
              Settings menu
            </p>

            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? "bg-[#F1F0F8] text-[#24264A]"
                        : "text-[#777783] hover:bg-[#F8F7F4] hover:text-[#24264A]"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="space-y-6">
            {activeTab === "general" && (
              <section className="rounded-2xl border border-[#E9E7E1] bg-white p-6 sm:p-8">
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F0F8] text-[#24264A]">
                    <Globe size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#24264A]">
                      General information
                    </h2>
                    <p className="text-xs text-[#777783]">
                      Basic information about your publication.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Publication name
                    </label>
                    <input
                      value={publicationName}
                      onChange={(e) => setPublicationName(e.target.value)}
                      className="w-full rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3 text-sm outline-none focus:border-[#24264A]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Publication tagline
                    </label>
                    <textarea
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      rows={2}
                      className="w-full resize-none rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3 text-sm outline-none focus:border-[#24264A]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Website URL
                    </label>
                    <input
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3 text-sm outline-none focus:border-[#24264A]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Contact email
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3 text-sm outline-none focus:border-[#24264A]"
                    />
                  </div>
                </div>
              </section>
            )}

            {activeTab === "profile" && (
              <section className="rounded-2xl border border-[#E9E7E1] bg-white p-6 sm:p-8">
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F0F8] text-[#24264A]">
                    <User size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#24264A]">
                      Administrator profile
                    </h2>
                    <p className="text-xs text-[#777783]">
                      Manage your public author information.
                    </p>
                  </div>
                </div>

                <div className="mb-7 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F0F8] text-[#24264A]">
                    <User size={28} />
                  </div>

                  <button
                    onClick={() =>
                      alert("Profile photo upload will be added with Supabase Storage.")
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E9E7E1] px-4 py-2.5 text-xs font-semibold text-[#24264A] hover:bg-[#F8F7F4]"
                  >
                    <Camera size={15} />
                    Change photo
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Display name
                    </label>
                    <input
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3 text-sm outline-none focus:border-[#24264A]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3 text-sm outline-none focus:border-[#24264A]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Short biography
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full resize-none rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3 text-sm outline-none focus:border-[#24264A]"
                    />
                  </div>
                </div>
              </section>
            )}

            {activeTab === "seo" && (
              <section className="rounded-2xl border border-[#E9E7E1] bg-white p-6 sm:p-8">
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F0F8] text-[#24264A]">
                    <Search size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#24264A]">
                      SEO settings
                    </h2>
                    <p className="text-xs text-[#777783]">
                      Default search engine information for your website.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Default SEO title
                    </label>
                    <input
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      maxLength={70}
                      className="w-full rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3 text-sm outline-none focus:border-[#24264A]"
                    />
                    <p className="mt-2 text-right text-xs text-[#9999A1]">
                      {seoTitle.length}/70 characters
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Default SEO description
                    </label>
                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      maxLength={170}
                      rows={4}
                      className="w-full resize-none rounded-xl border border-[#E9E7E1] bg-[#FCFBF9] px-4 py-3 text-sm outline-none focus:border-[#24264A]"
                    />
                    <p className="mt-2 text-right text-xs text-[#9999A1]">
                      {seoDescription.length}/170 characters
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F8F7F4] p-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#777783]">
                      Search preview
                    </p>
                    <p className="text-base font-semibold text-[#24264A]">
                      {seoTitle || "Your website title"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#777783]">
                      {seoDescription || "Your website description will appear here."}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "notifications" && (
              <section className="rounded-2xl border border-[#E9E7E1] bg-white p-6 sm:p-8">
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F0F8] text-[#24264A]">
                    <Bell size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#24264A]">
                      Notification preferences
                    </h2>
                    <p className="text-xs text-[#777783]">
                      Choose which updates you want to receive.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      label: "Email notifications",
                      description: "Receive important publication updates by email.",
                      value: emailNotifications,
                      change: setEmailNotifications,
                      icon: Mail,
                    },
                    {
                      label: "Newsletter subscriptions",
                      description: "Get notified when readers subscribe to your newsletter.",
                      value: newsletterNotifications,
                      change: setNewsletterNotifications,
                      icon: Bell,
                    },
                    {
                      label: "Comment notifications",
                      description: "Receive updates when readers comment on articles.",
                      value: commentNotifications,
                      change: setCommentNotifications,
                      icon: ShieldCheck,
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-5 border-b border-[#F0EEE9] pb-5 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3">
                          <Icon
                            size={19}
                            className="mt-1 shrink-0 text-[#777783]"
                          />
                          <div>
                            <p className="text-sm font-semibold text-[#24264A]">
                              {item.label}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[#777783]">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <button
                          role="switch"
                          aria-checked={item.value}
                          onClick={() => item.change(!item.value)}
                          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                            item.value ? "bg-[#24264A]" : "bg-[#D8D6D0]"
                          }`}
                        >
                          <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                              item.value ? "left-6" : "left-1"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl bg-[#24264A] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#35385F]"
              >
                <Save size={17} />
                Save settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
