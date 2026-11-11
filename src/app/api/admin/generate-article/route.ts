
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // 1. Confirm the API key exists
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service is not configured." },
        { status: 500 }
      );
    }

    // 2. Authenticate the user
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    // 3. Verify administrator permissions
    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || admin?.role !== "admin") {
      return NextResponse.json(
        { error: "You are not authorized to use this feature." },
        { status: 403 }
      );
    }

    // 4. Validate the article brief
    const body = await request.json();
    const brief =
      typeof body.brief === "string" ? body.brief.trim() : "";

    const category =
      typeof body.category === "string"
        ? body.category.trim().slice(0, 100)
        : "General";

    if (!brief || brief.length < 10) {
      return NextResponse.json(
        { error: "Please provide a more detailed article brief." },
        { status: 400 }
      );
    }

    if (brief.length > 3000) {
      return NextResponse.json(
        { error: "Your article brief must not exceed 3,000 characters." },
        { status: 400 }
      );
    }

    // 5. Send the request to Groq
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model:
            process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          temperature: 0.7,
        max_completion_tokens: 4000,
reasoning_effort: "low",
          response_format: {
            type: "json_object",
          },
          messages: [
            {
              role: "system",
              content: `
You are the professional editorial writer for The Open Tab.

The Open Tab is a modern digital publication covering technology,
AI, programming, business, entrepreneurship, careers, digital
lifestyle, opinions and ideas.

Write informative, engaging, well-structured articles.
Use a professional, natural and human editorial voice.
Avoid unnecessary repetition, exaggerated claims and generic filler.

Return valid JSON with exactly these fields:
{
  "title": "Article title",
  "excerpt": "A concise article summary",
  "paragraphs": [
    "Opening paragraph",
    "Another paragraph"
  ]
}

Requirements:
- Create a compelling and relevant title.
- Write an informative excerpt.
- Write a complete, useful article with clear explanations.
- Use multiple paragraphs and logical section breaks.
- Do not include markdown or HTML.
- Return JSON only.
              `,
            },
            {
              role: "user",
              content: `
Write an article based on this brief:

${brief}

Article category: ${category}

The article should be suitable for publication on The Open Tab.
              `,
            },
          ],
        }),
      }
    );

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json().catch(() => null);

      console.error("Groq API error:", errorData);

      return NextResponse.json(
        { error: "AI could not generate the article. Please try again." },
        { status: 502 }
      );
    }

    // 6. Extract and validate the generated content
    const result = await groqResponse.json();

    const generatedText = result.choices?.[0]?.message?.content;

    if (typeof generatedText !== "string") {
      throw new Error("Invalid AI response.");
    }

    const article = JSON.parse(generatedText);

    if (
      typeof article.title !== "string" ||
      typeof article.excerpt !== "string" ||
      !Array.isArray(article.paragraphs) ||
      !article.paragraphs.every(
        (paragraph: unknown) => typeof paragraph === "string"
      )
    ) {
      throw new Error("AI returned an invalid article structure.");
    }

    return NextResponse.json({
      success: true,
      article: {
        title: article.title,
        excerpt: article.excerpt,
        paragraphs: article.paragraphs,
      },
    });
  } catch (error) {
    console.error("Article generation error:", error);

    return NextResponse.json(
      { error: "Something went wrong while generating your article." },
      { status: 500 }
    );
  }
}
