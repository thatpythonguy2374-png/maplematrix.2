import { createClient } from "jsr:@supabase/supabase-js@2";
import { Resend } from "npm:resend@4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-forwarded-for, x-real-ip",
};

// Rate limit configuration
const RATE_LIMIT_WINDOW_MINUTES = 10;
const MAX_SUBMISSIONS_PER_WINDOW = 3;
const MAX_SUBMISSIONS_PER_DAY = 10;
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
interface ProjectFormData {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  website?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  description: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get client IP from headers (set by proxy/load balancer)
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

    // Get user agent for additional fingerprinting
    const userAgent = req.headers.get("user-agent") || "";
    const userAgentHash = await hashString(userAgent);

    // Parse and validate request body
    const body: ProjectFormData = await req.json();

    // Validate required fields
    if (!body.fullName?.trim()) {
      return new Response(
        JSON.stringify({ error: "Full name is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!body.email?.trim() || !isValidEmail(body.email)) {
      return new Response(
        JSON.stringify({ error: "Valid email address is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    if (!body.phone?.trim()) {
  return new Response(
    JSON.stringify({ error: "Phone number is required" }),
    {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

    if (!body.description?.trim()) {
      return new Response(
  JSON.stringify({ error: "Project description is required" }),
  {
    status: 400,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  }
);
    }

    // Validate field lengths
    if (body.fullName.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name must be less than 100 characters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (body.email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Email must be less than 255 characters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (body.company && body.company.length > 100) {
      return new Response(
        JSON.stringify({
          error: "Company name must be less than 100 characters",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (body.description.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Message must be less than 2000 characters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limits
    const now = new Date();
    const windowStart = new Date(
      now.getTime() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
    );
    const dayStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Count submissions in the short window (10 minutes)
    const { count: windowCount, error: windowError } = await supabase
      .from("contact_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", clientIp)
      .gte("submitted_at", windowStart.toISOString());

    if (windowError) {
      console.error("Error checking rate limit:", windowError);
      return new Response(
        JSON.stringify({ error: "An error occurred. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if ((windowCount || 0) >= MAX_SUBMISSIONS_PER_WINDOW) {
      return new Response(
        JSON.stringify({
          error: "rate_limit",
          message: "Please wait a bit and try again.",
          retryAfter: RATE_LIMIT_WINDOW_MINUTES * 60,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": String(RATE_LIMIT_WINDOW_MINUTES * 60),
          },
        }
      );
    }

    // Count submissions in the day
    const { count: dayCount, error: dayError } = await supabase
      .from("contact_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", clientIp)
      .gte("submitted_at", dayStart.toISOString());

    if (dayError) {
      console.error("Error checking daily rate limit:", dayError);
      return new Response(
        JSON.stringify({ error: "An error occurred. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if ((dayCount || 0) >= MAX_SUBMISSIONS_PER_DAY) {
      return new Response(
        JSON.stringify({
          error: "rate_limit",
          message:
            "You've reached the daily submission limit. Please try again tomorrow.",
          retryAfter: 24 * 60 * 60,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": String(24 * 60 * 60),
          },
        }
      );
    }

    // Record this attempt for rate limiting
    const { error: rateLimitInsertError } = await supabase
      .from("contact_rate_limits")
      .insert({
        ip_address: clientIp,
        user_agent_hash: userAgentHash,
      });

    if (rateLimitInsertError) {
      console.error("Error recording rate limit:", rateLimitInsertError);
      // Continue anyway - don't block the submission
    }

    // Insert the contact submission
    const { error: insertError } = await supabase
  .from("project_enquiries")
  .insert({
    full_name: body.fullName.trim(),
    email: body.email.trim(),
    phone: body.phone.trim(),
    company: body.company?.trim() || null,
    website: body.website?.trim() || null,
    project_type: body.projectType || null,
    budget: body.budget || null,
    timeline: body.timeline || null,
    description: body.description.trim(),
  });

    if (insertError) {
      console.error("Error inserting project enquiry:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to submit. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    const {
  data: adminData,
  error: adminError,
} = await resend.emails.send({
  from: "Maple Matrix <onboarding@resend.dev>",
  to: ["maplematrix2374@gmail.com"],
  subject: `🚀 New Project Enquiry - ${body.fullName}`,
  html: `
    <h2>New Project Enquiry</h2>
    <p><strong>Name:</strong> ${body.fullName}</p>
    <p><strong>Email:</strong> ${body.email}</p>
    <p><strong>Phone:</strong> ${body.phone}</p>
    <p>${body.description}</p>
  `,
});

console.log("Admin Email Response:", adminData);

if (adminError) {
  console.error("Admin Email Error:", adminError);
}

const {
  data: customerData,
  error: customerError,
} = await resend.emails.send({
  from: "Maple Matrix <onboarding@resend.dev>",
  to: [body.email],
  subject: "We've received your project enquiry",
  html: `
    <h2>Thank you, ${body.fullName}!</h2>

    <p>We've received your enquiry.</p>

    <p>
      Our team will contact you within one business day.
    </p>

    <strong>Maple Matrix</strong>
  `,
});

console.log("Customer Email Response:", customerData);

if (customerError) {
  console.error("Customer Email Error:", customerError);
}
    // Optionally cleanup old rate limit entries
    try {
      await supabase.rpc("cleanup_old_rate_limits");
    } catch (cleanupError) {
      // Non-critical, just log
      console.error("Error cleaning up rate limits:", cleanupError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Message sent successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Hash a string using SHA-256
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
