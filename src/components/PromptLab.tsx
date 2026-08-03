import { useState, useEffect, useCallback, useRef } from "react";
import { History, Share2, Copy, Sparkles, Check, ChevronDown, Zap, ArrowRight, MoreHorizontal, UserCog, Target, Info, ShieldAlert, LayoutList, FileCode, Users, MessageSquare, Award, CheckCircle2, AlertCircle, RotateCcw, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Icon mapping for each missing element
const ELEMENT_ICONS: Record<string, LucideIcon> = {
  "Role": UserCog,
  "Goal": Target,
  "Context": Info,
  "Constraints": ShieldAlert,
  "Output format": LayoutList,
  "Examples": FileCode,
  "Audience": Users,
  "Tone": MessageSquare,
  "Success criteria": Award
};

// Motion tokens
const MOTION = {
  micro: "220ms",
  expand: "320ms",
  primary: "cubic-bezier(0.22, 1, 0.36, 1)",
  alt: "cubic-bezier(0.16, 1, 0.3, 1)",
  bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)"
};
interface AnalysisResult {
  score: number;
  label: "Needs work" | "Good" | "Strong";
  missing: string[];
  tips: string[];
  detected: string[];
}
interface HistoryItem {
  prompt: string;
  score: number;
  timestamp: number;
}

// Confetti component for celebration
const Confetti = ({
  active
}: {
  active: boolean;
}) => {
  if (!active) return null;
  const colors = ["#f97316", "#fb923c", "#fdba74", "#22c55e", "#4ade80", "#fbbf24"];
  const particles = Array.from({
    length: 30
  }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.3}s`,
    duration: `${0.8 + Math.random() * 0.4}s`,
    size: 4 + Math.random() * 4
  }));
  return <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-20">
      {particles.map(p => <div key={p.id} className="absolute animate-confetti" style={{
      left: p.left,
      top: "-10px",
      width: p.size,
      height: p.size,
      backgroundColor: p.color,
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      animationDelay: p.delay,
      animationDuration: p.duration
    }} />)}
    </div>;
};
// Helper to check if content after a label is meaningful (not just placeholder)
function hasRealContent(text: string, labelPattern: RegExp): boolean {
  const match = text.match(labelPattern);
  if (!match) return false;
  
  // Get text after the label
  const afterLabel = text.slice(match.index! + match[0].length).trim();
  
  // Check if it's empty or just placeholder text
  if (!afterLabel || afterLabel.length < 3) return false;
  
  // Ignore placeholder patterns like [add context here], [your goal], etc.
  const placeholderPatterns = [
    /^\[.*?\]$/i,  // Just a bracket placeholder
    /^\[.*?\]\s*$/i,  // Bracket placeholder with trailing space
    /^\.{2,}$/,  // Just dots
    /^\.\.\./,  // Starts with ellipsis
  ];
  
  // Get the first "sentence" or chunk after the label
  const firstChunk = afterLabel.split(/[.!?\n]/)[0].trim();
  if (!firstChunk || firstChunk.length < 3) return false;
  
  // Check if first chunk is just a placeholder
  for (const pattern of placeholderPatterns) {
    if (pattern.test(firstChunk)) return false;
  }
  
  // If it starts with a bracket and ends with one, it's likely a placeholder
  if (/^\[.*\]$/.test(firstChunk)) return false;
  
  return true;
}

// Check if text contains real content for an element (not just the label)
function detectElement(text: string, key: string, patterns: RegExp[]): boolean {
  const trimmed = text.trim();
  
  // For structured elements (Role:, Context:, etc.), check for content after the label
  const structuredLabels: Record<string, RegExp> = {
    role: /(?:role|you are|act as):\s*/i,
    goal: /(?:goal|objective|help me):\s*/i,
    context: /context:\s*/i,
    constraints: /constraints?:\s*/i,
    format: /(?:output\s*)?format:\s*/i,
    examples: /examples?:\s*/i,
    audience: /audience:\s*/i,
    tone: /tone:\s*/i,
    success: /(?:success\s*)?criteria:\s*/i,
  };
  
  const labelPattern = structuredLabels[key];
  if (labelPattern && labelPattern.test(trimmed)) {
    // Has the label, but does it have real content?
    return hasRealContent(trimmed, labelPattern);
  }
  
  // For natural language patterns (not label-based), still use pattern matching
  // but require sufficient context around the match
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) {
      // For role patterns like "You are an expert", check there's content after
      if (/^(you are|act as|as a)/i.test(match[0])) {
        const afterMatch = trimmed.slice(match.index! + match[0].length).trim();
        // Need at least a few words after "You are"
        if (afterMatch.length < 5) return false;
        if (/^\[.*\]/.test(afterMatch)) return false;  // Placeholder
        return true;
      }
      
      // For goal patterns like "Help me", check there's content after
      if (/^(help me|i need|create|write|generate|build|design|develop|explain|analyze)/i.test(match[0])) {
        const afterMatch = trimmed.slice(match.index! + match[0].length).trim();
        if (afterMatch.length < 3) return false;
        if (/^\[.*\]/.test(afterMatch)) return false;
        return true;
      }
      
      // For other patterns, just verify the match exists with some context
      return true;
    }
  }
  
  return false;
}

const ANALYSIS_CRITERIA = [{
  key: "role",
  label: "Role",
  patterns: [/^(you are|act as|as a|imagine you're|pretend to be|you're a)/i, /assistant|expert|specialist|consultant|coach|advisor/i],
  weight: 12
}, {
  key: "goal",
  label: "Goal",
  patterns: [/^(help me|i need|create|write|generate|build|design|develop|explain|analyze)/i, /goal|objective|aim|purpose/i],
  weight: 15
}, {
  key: "context",
  label: "Context",
  patterns: [/background|context|situation|scenario|because|since|given that/i, /my (company|business|project|team|product)/i],
  weight: 12
}, {
  key: "constraints",
  label: "Constraints",
  patterns: [/must not|don't|avoid|limit|maximum|minimum|within|no more than|at least/i, /constraint|restriction|requirement/i],
  weight: 10
}, {
  key: "format",
  label: "Output format",
  patterns: [/bullet|list|table|steps|paragraph|json|markdown|format/i, /output|response|answer|result/i],
  weight: 12
}, {
  key: "examples",
  label: "Examples",
  patterns: [/example|for instance|such as|like this|e\.g\.|sample/i, /input.*output|before.*after/i],
  weight: 10
}, {
  key: "audience",
  label: "Audience",
  patterns: [/audience|reader|user|customer|client|beginner|expert|professional/i, /for (a|my|the) (team|boss|client|customer)/i],
  weight: 9
}, {
  key: "tone",
  label: "Tone",
  patterns: [/tone|style|formal|informal|friendly|professional|casual|direct|concise/i, /write (in|with) a/i],
  weight: 10
}, {
  key: "success",
  label: "Success criteria",
  patterns: [/success|good (answer|response)|should (include|contain|have)|criteria/i, /quality|measure|metric/i],
  weight: 10
}];

function analyzePrompt(prompt: string): AnalysisResult {
  const trimmed = prompt.trim();
  if (!trimmed) return {
    score: 0,
    label: "Needs work",
    missing: [],
    tips: [],
    detected: []
  };
  
  let totalScore = 0;
  const detected: string[] = [];
  const missing: string[] = [];
  
  ANALYSIS_CRITERIA.forEach(({
    key,
    label,
    patterns,
    weight
  }) => {
    // Use content-based detection instead of simple pattern matching
    const found = detectElement(trimmed, key, patterns);
    if (found) {
      detected.push(label);
      totalScore += weight;
    } else {
      missing.push(label);
    }
  });
  
  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount > 30) totalScore += 5;
  if (wordCount > 60) totalScore += 5;
  const score = Math.min(100, totalScore);
  const label: AnalysisResult["label"] = score < 60 ? "Needs work" : score < 80 ? "Good" : "Strong";
  const tips = generateTips(missing);
  return {
    score,
    label,
    missing: missing.slice(0, 5),
    tips,
    detected
  };
}

// Tip mapping for each missing element
const ELEMENT_TIPS: Record<string, string> = {
  "Role": "Start with 'You are a...' to define the AI's expertise and perspective",
  "Goal": "Clearly state what you want to achieve, e.g., 'Help me write...'",
  "Context": "Add background info like your situation, audience, or constraints",
  "Constraints": "Set boundaries: length limits, things to avoid, or requirements",
  "Output format": "Specify format: bullets, table, numbered steps, or JSON",
  "Examples": "Include examples of desired input/output or 'like this...'",
  "Audience": "Mention who will read this: beginners, experts, clients, etc.",
  "Tone": "Specify the tone: formal, friendly, concise, persuasive, etc.",
  "Success criteria": "Define what a good answer looks like or must include"
};

// Context-aware template generator that creates meaningful content based on user's prompt
function generateContextualTemplate(element: string, userPrompt: string): string {
  const prompt = userPrompt.toLowerCase().trim();
  
  // Detect the domain/topic from the prompt
  const isEmail = /email|message|newsletter|outreach|pitch|follow.?up/i.test(prompt);
  const isCode = /code|function|api|script|program|app|software|developer|bug|debug/i.test(prompt);
  const isWriting = /write|blog|article|essay|story|content|copy|post|caption/i.test(prompt);
  const isMarketing = /marketing|campaign|ad|brand|social|seo|promotion|sales/i.test(prompt);
  const isAnalysis = /analyze|review|assess|evaluate|compare|research|report/i.test(prompt);
  const isDesign = /design|ui|ux|layout|mockup|wireframe|visual|interface/i.test(prompt);
  const isPresentation = /presentation|slides|deck|pitch|keynote|powerpoint/i.test(prompt);
  const isBusiness = /business|strategy|plan|proposal|startup|investor|meeting/i.test(prompt);
  
  // Extract key subjects from the prompt
  const productMatch = prompt.match(/(?:my|our|the|a|an)\s+(product|app|tool|service|platform|software|feature|solution|company|business|brand|startup)/i);
  const productName = productMatch ? productMatch[0] : "your product";
  
  // Extract audience hints
  const audienceMatch = prompt.match(/(?:for|to)\s+(customers?|users?|clients?|founders?|developers?|marketers?|beginners?|experts?|professionals?|team|boss|manager)/i);
  const audienceHint = audienceMatch ? audienceMatch[1] : null;
  
  switch (element) {
    case "Role":
      if (isCode) return " You are a senior software engineer with expertise in clean code and best practices.";
      if (isEmail) return " You are an expert copywriter who specializes in high-converting email communication.";
      if (isMarketing) return " You are a seasoned marketing strategist with experience in growth and conversion optimization.";
      if (isWriting) return " You are a professional content writer with a talent for engaging, clear prose.";
      if (isAnalysis) return " You are a data analyst skilled at extracting actionable insights from complex information.";
      if (isDesign) return " You are a senior UX designer focused on user-centered, intuitive interfaces.";
      if (isPresentation) return " You are a presentation coach who creates compelling, visually clean slides.";
      if (isBusiness) return " You are a business strategist with experience helping startups scale effectively.";
      return " You are an expert assistant with deep knowledge in this domain.";
      
    case "Goal":
      // Goal is usually present if they typed anything, so provide an enhancement
      return " The primary objective is to create something immediately usable without further editing.";
      
    case "Context":
      if (isEmail) return ` Context: This is a ${prompt.includes("cold") ? "cold outreach" : "follow-up"} email for ${productName}. The recipient has ${prompt.includes("cold") ? "not heard of us before" : "previously expressed interest"}.`;
      if (isCode) return ` Context: This is for a production codebase. The code should be well-documented, tested, and follow established patterns.`;
      if (isMarketing) return ` Context: This is for a ${prompt.includes("b2b") ? "B2B" : "B2C"} audience. We're looking to increase engagement and conversions.`;
      if (isWriting) return ` Context: This content will be published on our main platform. It should align with our brand voice and engage readers.`;
      if (isAnalysis) return ` Context: This analysis will inform key decisions. Accuracy and clarity are critical.`;
      if (isBusiness) return ` Context: This is for a growing startup looking to scale efficiently while maintaining quality.`;
      return ` Context: This will be used professionally and needs to make a strong impression.`;
      
    case "Constraints":
      if (isEmail) return " Keep it under 150 words. Avoid salesy language. Include one clear call-to-action.";
      if (isCode) return " Follow DRY principles. Include error handling. Add inline comments for complex logic.";
      if (isMarketing) return " Stay on-brand. Avoid clichés. Focus on benefits over features.";
      if (isWriting) return " Keep paragraphs short (2-3 sentences). Use active voice. Avoid jargon.";
      if (isPresentation) return " Maximum 6 bullet points per slide. Use visuals where possible. Keep text minimal.";
      return " Keep it concise and focused. Avoid unnecessary complexity or filler content.";
      
    case "Output format":
      if (isCode) return " Format as clean, executable code with comments. Include usage examples.";
      if (isEmail) return " Format as a ready-to-send email with subject line, body, and signature.";
      if (isAnalysis) return " Format as a structured report with executive summary, key findings, and recommendations.";
      if (isPresentation) return " Format as slide-by-slide content with headers and bullet points.";
      if (isWriting) return " Format with clear headings, short paragraphs, and scannable structure.";
      return " Format as a well-structured response with clear sections.";
      
    case "Examples":
      if (isEmail) return " For example, a subject line like 'Quick question about [topic]' works well for open rates.";
      if (isCode) return " For example: input: getUserById(123) → output: { id: 123, name: 'John', email: 'john@example.com' }";
      if (isMarketing) return " For example, 'Join 10,000+ users who...' is more compelling than 'Sign up now'.";
      return " For example, show a before/after or input/output comparison.";
      
    case "Audience":
      if (audienceHint) return ` The audience is ${audienceHint} who have varying levels of familiarity with the topic.`;
      if (isCode) return " The audience is developers who will maintain this code, so prioritize readability.";
      if (isMarketing) return " The audience is potential customers who are problem-aware but may not know our solution.";
      if (isEmail) return " The audience is busy professionals who skim emails, so lead with value.";
      if (isBusiness) return " The audience is stakeholders who need clear, actionable information.";
      return " The audience needs clear, accessible content without assuming prior expertise.";
      
    case "Tone":
      if (isEmail) return " Use a warm, professional tone that feels human and builds rapport.";
      if (isCode) return " Use clear, technical language with helpful comments.";
      if (isMarketing) return " Use an energetic, confident tone that inspires action.";
      if (isWriting) return " Use a conversational yet authoritative tone that engages readers.";
      if (isAnalysis) return " Use an objective, analytical tone backed by evidence.";
      if (isBusiness) return " Use a professional, strategic tone that conveys competence.";
      return " Use a clear, professional tone that is easy to understand.";
      
    case "Success criteria":
      if (isEmail) return " A successful email gets opened, read fully, and drives the reader to take the specified action.";
      if (isCode) return " Success means the code runs correctly, handles edge cases, and is easy to maintain.";
      if (isMarketing) return " Success means the content captures attention, communicates value, and drives conversions.";
      if (isWriting) return " Success means the content is engaging, easy to read, and achieves its intended purpose.";
      if (isAnalysis) return " Success means delivering clear insights that directly inform decision-making.";
      return " A successful response is immediately usable, requires minimal editing, and fully addresses the request.";
      
    default:
      return ` [Add ${element.toLowerCase()}]`;
  }
}

// Generate a complete improved prompt that's ready to use
function generateCompletePrompt(original: string): string {
  const prompt = original.trim();
  
  // Detect domain
  const isEmail = /email|message|newsletter|outreach|pitch|follow.?up/i.test(prompt);
  const isCode = /code|function|api|script|program|app|software|developer|bug|debug/i.test(prompt);
  const isWriting = /write|blog|article|essay|story|content|copy|post|caption/i.test(prompt);
  const isMarketing = /marketing|campaign|ad|brand|social|seo|promotion|sales/i.test(prompt);
  const isAnalysis = /analyze|review|assess|evaluate|compare|research|report/i.test(prompt);
  
  // Extract any product/topic mentions for context
  const productMatch = prompt.match(/(?:for|about|on|my)\s+([^.,!?]+)/i);
  const productHint = productMatch ? productMatch[1].trim() : "[your product or topic]";
  
  // Build the complete prompt as clean paragraphs
  let improved = "";
  
  // Role paragraph
  if (isCode) {
    improved += "You are a senior software engineer with 10+ years of experience writing clean, maintainable code.\n\n";
  } else if (isEmail) {
    improved += "You are an expert copywriter who specializes in high-converting email communication that gets responses.\n\n";
  } else if (isMarketing) {
    improved += "You are a seasoned marketing strategist with deep expertise in conversion optimization and brand messaging.\n\n";
  } else if (isWriting) {
    improved += "You are a professional content writer known for creating engaging, clear, and impactful prose.\n\n";
  } else if (isAnalysis) {
    improved += "You are a skilled analyst who transforms complex data into clear, actionable insights.\n\n";
  } else {
    improved += "You are an expert assistant with deep knowledge and experience in this domain.\n\n";
  }
  
  // Goal paragraph (incorporate original prompt)
  improved += `Your goal is to ${prompt.toLowerCase().replace(/^(help me |please |i need to |i want to )/i, '')}.\n\n`;
  
  // Context paragraph
  if (isEmail) {
    improved += `The context is: [This email is for ${productHint}. The recipient is busy and will only skim unless the opening captures their attention.]\n\n`;
  } else if (isCode) {
    improved += `The context is: [This code will be part of a production system for ${productHint}. It needs to be robust and follow best practices.]\n\n`;
  } else if (isMarketing) {
    improved += `The context is: [This is for ${productHint} in a competitive market. The messaging needs to differentiate clearly and resonate with the target audience.]\n\n`;
  } else if (isWriting) {
    improved += `The context is: [This content about ${productHint} will be published publicly. It should engage readers from the first sentence.]\n\n`;
  } else if (isAnalysis) {
    improved += `The context is: [This analysis of ${productHint} will inform important decisions. Accuracy and clarity are essential.]\n\n`;
  } else {
    improved += `The context is: [Describe the situation, background, or relevant details about ${productHint}.]\n\n`;
  }
  
  // Audience paragraph
  if (isEmail) {
    improved += "The audience is: [Busy professionals who receive dozens of emails daily. They skim first, so lead with value.]\n\n";
  } else if (isCode) {
    improved += "The audience is: [Developers who will read and maintain this code. Prioritize readability.]\n\n";
  } else if (isMarketing) {
    improved += "The audience is: [Potential customers aware of their problem but may not know about our solution.]\n\n";
  } else {
    improved += "The audience is: [Describe who will receive or use this output.]\n\n";
  }
  
  // Constraints paragraph
  if (isEmail) {
    improved += "Constraints to follow: Keep under 150 words. Avoid pushy language. Include exactly one clear call-to-action. Make the subject line compelling and under 50 characters.\n\n";
  } else if (isCode) {
    improved += "Constraints to follow: Follow DRY and SOLID principles. Include proper error handling. Add clear comments for complex logic. Use meaningful variable names.\n\n";
  } else if (isMarketing) {
    improved += "Constraints to follow: Stay authentic and on-brand. Lead with benefits, not features. Avoid jargon. Include a compelling call-to-action.\n\n";
  } else {
    improved += "Constraints to follow: [Be concise. Avoid jargon. Prioritize clarity over complexity.]\n\n";
  }
  
  // Tone paragraph
  if (isEmail) {
    improved += "Use a warm, professional tone that feels human and builds rapport without being pushy.\n\n";
  } else if (isCode) {
    improved += "Use clear, technical language with helpful comments.\n\n";
  } else if (isMarketing) {
    improved += "Use an energetic, confident tone that inspires action while remaining authentic.\n\n";
  } else if (isWriting) {
    improved += "Use a conversational yet authoritative tone that engages readers.\n\n";
  } else {
    improved += "Use a clear, professional tone that is easy to understand.\n\n";
  }
  
  // Output format paragraph
  if (isEmail) {
    improved += "Format the output as: A complete, ready-to-send email including subject line, email body, and signature.\n\n";
  } else if (isCode) {
    improved += "Format the output as: Complete, runnable code with a brief explanation and usage example.\n\n";
  } else {
    improved += "Format the output as: [Specify structure, length, or format requirements.]\n\n";
  }
  
  // Success criteria paragraph
  if (isEmail) {
    improved += "A successful result: The email gets opened, read fully, and drives the reader to take the specified action.";
  } else if (isCode) {
    improved += "A successful result: The code runs correctly, handles edge cases, and is easy to maintain.";
  } else if (isMarketing) {
    improved += "A successful result: The content captures attention, communicates value clearly, and drives conversions.";
  } else {
    improved += "A successful result: [The output is immediately usable, requires minimal editing, and fully addresses the request.]";
  }
  
  return improved;
}
function generateTips(missing: string[]): string[] {
  const tips: string[] = [];
  if (missing.includes("Role")) tips.push(ELEMENT_TIPS["Role"]);
  if (missing.includes("Goal")) tips.push(ELEMENT_TIPS["Goal"]);
  if (missing.includes("Context")) tips.push(ELEMENT_TIPS["Context"]);
  if (missing.includes("Output format")) tips.push(ELEMENT_TIPS["Output format"]);
  if (missing.includes("Constraints")) tips.push(ELEMENT_TIPS["Constraints"]);
  return tips.slice(0, 3);
}
// Structured output types for proper UI rendering
interface ImprovedPromptSection {
  label: string;
  content: string;
  isList?: boolean;
  items?: string[];
}

interface ImprovedPromptData {
  type: "improve";
  sections: ImprovedPromptSection[];
}

interface WhyExplanationData {
  type: "why";
  score: number;
  detected: string[];
  missing: string[];
  tips: string[];
  isStrong: boolean;
}

type OutputData = ImprovedPromptData | WhyExplanationData | null;

function generateImprovedPromptData(original: string): ImprovedPromptData {
  const trimmed = original.trim();
  let intent = "create content";
  if (/email/i.test(trimmed)) intent = "write an email";
  else if (/code|function|api/i.test(trimmed)) intent = "write code";
  else if (/explain|understand/i.test(trimmed)) intent = "explain a concept";
  else if (/analyze|review/i.test(trimmed)) intent = "analyze information";
  else if (/design|create|build/i.test(trimmed)) intent = "design a solution";
  else if (/write|draft|compose/i.test(trimmed)) intent = "write content";

  return {
    type: "improve",
    sections: [
      { label: "Role", content: "You are an expert assistant skilled in clear, actionable communication." },
      { label: "Goal", content: `${intent} based on the following request: "${trimmed.slice(0, 100)}${trimmed.length > 100 ? '...' : ''}"` },
      { label: "Context", content: "The user needs professional-quality output that is ready to use immediately." },
      { 
        label: "Constraints", 
        content: "",
        isList: true,
        items: [
          "Keep the response concise and focused",
          "Avoid jargon unless necessary",
          "Ensure the output is actionable"
        ]
      },
      { label: "Output Format", content: "Provide a structured response with clear sections or bullet points." },
      { label: "Success Criteria", content: "The output should be clear, complete, and immediately usable." }
    ]
  };
}

function generateWhyExplanationData(analysis: AnalysisResult): WhyExplanationData {
  return {
    type: "why",
    score: analysis.score,
    detected: analysis.detected,
    missing: analysis.missing,
    tips: analysis.tips,
    isStrong: analysis.score >= 80
  };
}

// Animated dropdown component
const AnimatedDropdown = ({
  isOpen,
  children,
  className
}: {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);
  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };
  if (!shouldRender) return null;
  return <div className={cn("absolute right-0 top-full mt-1 bg-background border border-border rounded-lg z-50 py-1 will-change-transform", isOpen ? "animate-dropdown-in" : "animate-dropdown-out", className)} onAnimationEnd={handleAnimationEnd}>
      {children}
    </div>;
};

// Collapsible panel with grid animation
const CollapsiblePanel = ({
  isOpen,
  children
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) => {
  return <div className="grid transition-all will-change-transform" style={{
    gridTemplateRows: isOpen ? "1fr" : "0fr",
    transitionDuration: MOTION.expand,
    transitionTimingFunction: MOTION.primary
  }}>
      <div className="overflow-x-hidden overflow-y-visible min-h-0">
        <div className="transition-all will-change-transform" style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(6px)",
        transitionDuration: MOTION.expand,
        transitionTimingFunction: MOTION.primary
      }}>
          {children}
        </div>
      </div>
    </div>;
};

// Structured content renderer for the output panel
const StructuredOutputRenderer = ({ 
  data, 
  analysis 
}: { 
  data: OutputData;
  analysis: AnalysisResult | null;
}) => {
  if (!data) return null;

  // For "improve" mode, show detected elements confirmation
  if (data.type === "improve" && analysis) {
    return (
      <div className="space-y-3">
        {/* Success header */}
        <div className="flex items-center gap-2 pb-2 border-b border-border/30">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-semibold text-foreground">Prompt Enhanced</span>
          <span className="text-xs text-muted-foreground">— All elements now detected</span>
        </div>

        {/* Detected elements grid */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground/80 uppercase tracking-wide">Detected elements</span>
            <span className="text-xs text-emerald-500">({analysis.detected.length}/{ANALYSIS_CRITERIA.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.detected.map((item, i) => {
              const IconComponent = ELEMENT_ICONS[item];
              return (
                <span 
                  key={i}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium"
                  style={{
                    opacity: 0,
                    animation: `dropdown-in ${MOTION.micro} ${MOTION.primary} forwards`,
                    animationDelay: `${i * 40}ms`
                  }}
                >
                  <CheckCircle2 className="w-3 h-3 opacity-70" />
                  {item}
                </span>
              );
            })}
          </div>
        </div>

        {/* Tip */}
        <div className="flex items-start gap-2 pt-2 border-t border-border/30 text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <span className="text-xs leading-relaxed">Your prompt now includes all key elements for optimal AI responses. Copy and use it!</span>
        </div>
      </div>
    );
  }

  // Legacy "why" mode (kept for reference but no longer accessible)
  if (data.type === "why" && analysis) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border/30">
          <span className="text-sm font-semibold text-foreground">Score Breakdown:</span>
          <span className="text-lg font-bold text-primary">{analysis.score}</span>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>

        {analysis.detected.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-foreground/80 uppercase tracking-wide">Detected elements</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-6">
              {analysis.detected.map((item, i) => {
                const IconComponent = ELEMENT_ICONS[item];
                return (
                  <span 
                    key={i}
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium"
                  >
                    {IconComponent && <IconComponent className="w-3 h-3 opacity-70" />}
                    {item}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {analysis.missing.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-foreground/80 uppercase tracking-wide">Missing elements</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-6">
              {analysis.missing.map((item, i) => {
                const IconComponent = ELEMENT_ICONS[item];
                return (
                  <span 
                    key={i}
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium"
                  >
                    {IconComponent && <IconComponent className="w-3 h-3 opacity-70" />}
                    {item}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

// Content switcher for smooth crossfade between Improve/Why content
const ContentSwitcher = ({
  data,
  contentKey,
  analysis
}: {
  data: OutputData;
  contentKey: string;
  analysis: AnalysisResult | null;
}) => {
  const [displayedData, setDisplayedData] = useState<OutputData>(data);
  const [displayedAnalysis, setDisplayedAnalysis] = useState<AnalysisResult | null>(analysis);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevKeyRef = useRef(contentKey);

  useEffect(() => {
    if (contentKey !== prevKeyRef.current && data) {
      setIsTransitioning(true);
      const timeout = setTimeout(() => {
        setDisplayedData(data);
        setDisplayedAnalysis(analysis);
        setIsTransitioning(false);
        prevKeyRef.current = contentKey;
      }, 150);
      return () => clearTimeout(timeout);
    } else if (data && !displayedData) {
      setDisplayedData(data);
      setDisplayedAnalysis(analysis);
    }
  }, [data, contentKey, displayedData, analysis]);

  return (
    <div 
      className="transition-all will-change-transform" 
      style={{
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? "translateY(-4px)" : "translateY(0)",
        transitionDuration: "150ms",
        transitionTimingFunction: MOTION.primary
      }}
    >
      <StructuredOutputRenderer data={displayedData} analysis={displayedAnalysis} />
    </div>
  );
};

// Copy tooltip component
// CopyTooltip removed - using toast notification instead
const PromptLab = () => {
  // Input state
  const fullText = "Help me craft a persuasive email pitch for my new product…";
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Compact vs expanded mode
  const [inputKey, setInputKey] = useState(0); // Key for forcing remount
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Line height and max lines for auto-resize
  const LINE_HEIGHT = 22; // px
  const MIN_LINES = 1;
  const MAX_LINES = 4;
  const MIN_HEIGHT = LINE_HEIGHT * MIN_LINES;
  const MAX_HEIGHT = LINE_HEIGHT * MAX_LINES;

  // Analysis state
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [outputMode, setOutputMode] = useState<"improve" | "why" | null>(null);
  const [outputData, setOutputData] = useState<OutputData>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [status, setStatus] = useState<"ready" | "analyzing">("ready");
  const [scoreGlow, setScoreGlow] = useState(false);
  const [hasImproved, setHasImproved] = useState(false);
  const prevScoreRef = useRef(0);
  const historyRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Wait for fonts before starting typing animation
  useEffect(() => {
    const startTyping = async () => {
      // Wait for fonts to be ready
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      // Small additional delay for layout stability
      await new Promise(resolve => setTimeout(resolve, 100));
      setFontsReady(true);
      setIsTyping(true);
    };
    startTyping();
  }, []);

  // Typing animation
  useEffect(() => {
    if (!isTyping || !fontsReady) return;
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setInputValue(fullText);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, [isTyping, fontsReady]);

  // Auto-resize textarea
  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to auto to get accurate scrollHeight
    textarea.style.height = `${MIN_HEIGHT}px`;
    
    // Calculate new height clamped to max
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
    
    textarea.style.height = `${newHeight}px`;
    
    // Enable/disable scrolling based on content
    if (scrollHeight > MAX_HEIGHT) {
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.overflowY = 'hidden';
    }
  }, [MIN_HEIGHT, MAX_HEIGHT]);

  // Resize on value change - only when expanded
  useEffect(() => {
    if (isExpanded) {
      resizeTextarea();
    }
  }, [inputValue, displayedText, isTyping, resizeTextarea, isExpanded]);

  // Close dropdowns on outside click + Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setShowMobileMenu(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowHistory(false);
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Load history & check URL params
  useEffect(() => {
    const saved = localStorage.getItem("promptlab-history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {/* ignore */}
    }
    const params = new URLSearchParams(window.location.search);
    const sharedPrompt = params.get("prompt");
    if (sharedPrompt) {
      const decoded = decodeURIComponent(sharedPrompt);
      setInputValue(decoded);
      setIsTyping(false);
      setTimeout(() => runAnalysis(decoded), 100);
    }
  }, []);
  const runAnalysis = useCallback((prompt: string) => {
    setStatus("analyzing");
    setTimeout(() => {
      const result = analyzePrompt(prompt);
      setAnalysis(result);
      setIsAnalyzed(true);
      setIsAnimating(true);
      setOutputMode(null);
      setOutputData(null);
      setShowOutput(false);
      setShowConfetti(false);
      setStatus("ready");
      const startScore = prevScoreRef.current;
      const endScore = result.score;
      const duration = 600;
      const startTime = Date.now();
      const animateScore = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startScore + (endScore - startScore) * eased);
        setDisplayScore(current);
        if (progress < 1) {
          requestAnimationFrame(animateScore);
        } else {
          prevScoreRef.current = endScore;
          setIsAnimating(false);
          // Trigger score glow
          setScoreGlow(true);
          setTimeout(() => setScoreGlow(false), 400);
          // Trigger confetti for strong prompts
          if (endScore >= 80) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1500);
          }
        }
      };
      requestAnimationFrame(animateScore);
      if (prompt.trim()) {
        const newItem: HistoryItem = {
          prompt: prompt.trim(),
          score: result.score,
          timestamp: Date.now()
        };
        setHistory(prev => {
          const updated = [newItem, ...prev.filter(h => h.prompt !== prompt.trim())].slice(0, 10);
          localStorage.setItem("promptlab-history", JSON.stringify(updated));
          return updated;
        });
      }
    }, 150);
  }, []);
  const handleSubmit = () => {
    if (inputValue.trim()) {
      runAnalysis(inputValue);
    }
  };
  const handleFocus = () => {
    setIsFocused(true);
    if (isTyping) {
      setIsTyping(false);
      setInputValue(fullText);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleSubmit();
    }
  };
  const handleImprove = () => {
    if (!inputValue.trim() || !analysis || analysis.missing.length === 0) return;
    
    // Improve = batch chip insertion (append all missing elements, don't rewrite)
    // This behaves exactly like clicking all missing chips at once
    let updatedPrompt = inputValue;
    
    for (const missingElement of analysis.missing) {
      const template = generateContextualTemplate(missingElement, inputValue);
      updatedPrompt += template;
    }
    
    setInputValue(updatedPrompt);
    setIsTyping(false);
    setIsExpanded(true); // Switch to expanded mode for longer content
    setHasImproved(true);
    
    // Re-analyze the updated prompt (don't assume perfect score)
    runAnalysis(updatedPrompt);
  };

  const handleStartOver = () => {
    // Reset to initial compact state with key-based remount
    setInputValue("");
    setDisplayedText("");
    setIsTyping(true);
    setIsExpanded(false); // Back to compact mode
    setInputKey(k => k + 1); // Force remount
    setAnalysis(null);
    setIsAnalyzed(false);
    setDisplayScore(0);
    prevScoreRef.current = 0;
    setOutputMode(null);
    setOutputData(null);
    setShowOutput(false);
    setShowConfetti(false);
    setHasImproved(false);
  };
  const handleCopy = async () => {
    // Generate text version for copying
    let textToCopy = inputValue;
    if (outputMode === "improve" && outputData?.type === "improve") {
      textToCopy = outputData.sections
        .map(s => {
          if (s.isList && s.items) {
            return `**${s.label}:**\n${s.items.map(item => `- ${item}`).join('\n')}`;
          }
          return `**${s.label}:** ${s.content}`;
        })
        .join('\n\n');
    }
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1200);
  };
  const handleShare = async () => {
    if (!inputValue.trim()) return;
    const url = new URL(window.location.href);
    url.searchParams.set("prompt", encodeURIComponent(inputValue));
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  const handleHistorySelect = (item: HistoryItem) => {
    setInputValue(item.prompt);
    setIsTyping(false);
    runAnalysis(item.prompt);
    setShowHistory(false);
    setShowMobileMenu(false);
  };
  const getLabelColor = (label: string) => {
    switch (label) {
      case "Strong":
        return "text-green-400";
      case "Good":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };
  const hasPrompt = inputValue.trim().length > 0;
  return <>
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(200px) rotate(720deg) scale(0); opacity: 0; }
        }
        .animate-confetti { animation: confetti 1s ease-out forwards; }
        
        @keyframes dropdown-in {
          0% { opacity: 0; transform: translateY(-4px) scale(0.98); box-shadow: 0 0 0 0 rgba(0,0,0,0); }
          100% { opacity: 1; transform: translateY(0) scale(1); box-shadow: 0 10px 40px -10px rgba(0,0,0,0.3); }
        }
        @keyframes dropdown-out {
          0% { opacity: 1; transform: translateY(0) scale(1); box-shadow: 0 10px 40px -10px rgba(0,0,0,0.3); }
          100% { opacity: 0; transform: translateY(-4px) scale(0.98); box-shadow: 0 0 0 0 rgba(0,0,0,0); }
        }
        .animate-dropdown-in { animation: dropdown-in ${MOTION.micro} ${MOTION.primary} forwards; }
        .animate-dropdown-out { animation: dropdown-out 180ms ${MOTION.primary} forwards; }
        
        @keyframes tooltip-in {
          0% { opacity: 0; transform: translateX(-50%) translateY(4px) scale(0.95); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes tooltip-out {
          0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(4px) scale(0.95); }
        }
        .animate-tooltip-in { animation: tooltip-in 180ms ${MOTION.primary} forwards; }
        .animate-tooltip-out { animation: tooltip-out 150ms ${MOTION.primary} forwards; }
        
        @keyframes score-glow {
          0%, 100% { filter: drop-shadow(0 0 0 hsl(var(--primary) / 0)); }
          50% { filter: drop-shadow(0 0 8px hsl(var(--primary) / 0.6)); }
        }
        .score-glow { animation: score-glow 400ms ${MOTION.primary}; }
        
        .btn-micro {
          transition: transform 140ms ${MOTION.primary}, 
                      opacity 180ms ease,
                      background-color 140ms ease,
                      box-shadow 180ms ${MOTION.primary};
        }
        .btn-micro:hover:not(:disabled) { 
          transform: translateY(-1px); 
          box-shadow: 0 4px 12px -4px hsl(var(--primary) / 0.25);
        }
        .btn-micro:active:not(:disabled) { transform: translateY(0); }
        .btn-micro:disabled { opacity: 0.5; }
        
        .progress-bar-fill {
          transition: width 700ms ${MOTION.primary};
        }
        .progress-bar-glow {
          box-shadow: 0 0 8px 1px hsl(var(--primary) / 0.4);
        }
        
        /* Custom scrollbar for textarea */
        .prompt-textarea {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--primary) / 0.4) transparent;
        }
        .prompt-textarea::-webkit-scrollbar {
          width: 6px;
        }
        .prompt-textarea::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }
        .prompt-textarea::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 3px;
          transition: background 150ms ease;
        }
        .prompt-textarea::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-confetti,
          .animate-dropdown-in,
          .animate-dropdown-out,
          .animate-tooltip-in,
          .animate-tooltip-out,
          .score-glow,
          .btn-micro,
          .progress-bar-fill {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      
      <div className="w-full max-w-2xl mx-auto">
        <div className={cn("relative bg-secondary/30 backdrop-blur-md border-2 rounded-xl will-change-transform", isFocused ? "border-primary shadow-lg shadow-primary/10" : "border-border/50 hover:border-muted-foreground/30")} style={{
        transition: `border-color ${MOTION.micro} ${MOTION.primary}, box-shadow ${MOTION.expand} ${MOTION.primary}`
      }}>
          <Confetti active={showConfetti} />
          
          {/* Header Row */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Prompt Analyzer</span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Status indicator */}
              <span className={cn("text-xs", status === "analyzing" ? "text-primary" : "text-muted-foreground/60")} style={{
              transition: `color ${MOTION.micro} ease`
            }}>
                {status === "analyzing" ? "Analyzing…" : "Ready"}
              </span>
              
              {/* Desktop actions */}
              <div className="hidden sm:flex items-center gap-1">
                <div ref={historyRef} className="relative">
                  <button onClick={() => setShowHistory(!showHistory)} className="btn-micro text-xs px-2 py-1 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <History className="w-3 h-3" />
                    <ChevronDown className="w-3 h-3" style={{
                    transform: showHistory ? "rotate(180deg)" : "rotate(0deg)",
                    transition: `transform ${MOTION.micro} ${MOTION.primary}`
                  }} />
                  </button>
                  <AnimatedDropdown isOpen={showHistory} className="w-64 max-h-48 overflow-y-auto">
                    {history.length === 0 ? <p className="text-xs text-muted-foreground px-3 py-2">No history yet</p> : history.map((item, i) => <button key={i} onClick={() => handleHistorySelect(item)} className="btn-micro w-full text-left px-3 py-2 hover:bg-secondary/50">
                          <p className="text-xs text-foreground truncate">{item.prompt}</p>
                          <p className="text-xs text-muted-foreground">Score: {item.score}</p>
                        </button>)}
                  </AnimatedDropdown>
                </div>
                <button onClick={handleShare} disabled={!hasPrompt} className="btn-micro text-xs px-2 py-1 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground">
                  <Share2 className="w-3 h-3" />
                </button>
              </div>

              {/* Mobile menu */}
              <div ref={mobileMenuRef} className="relative sm:hidden">
                <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="btn-micro p-1 rounded-md hover:bg-secondary/50 text-muted-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <AnimatedDropdown isOpen={showMobileMenu} className="w-48">
                  <button onClick={handleShare} disabled={!hasPrompt} className="btn-micro w-full text-left px-3 py-2 hover:bg-secondary/50 text-sm flex items-center gap-2">
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                  <div className="border-t border-border/50 my-1" />
                  <p className="px-3 py-1 text-xs text-muted-foreground">History</p>
                  {history.length === 0 ? <p className="text-xs text-muted-foreground px-3 py-2">No history yet</p> : history.slice(0, 5).map((item, i) => <button key={i} onClick={() => handleHistorySelect(item)} className="btn-micro w-full text-left px-3 py-2 hover:bg-secondary/50">
                        <p className="text-xs text-foreground truncate">{item.prompt}</p>
                      </button>)}
                </AnimatedDropdown>
              </div>
            </div>
          </div>

          {/* Prompt Input Row */}
          <div className="px-4 py-3">
            <div className="flex items-start gap-2" style={{ minHeight: `${MIN_HEIGHT + 8}px` }}>
              {/* Two distinct render modes: Compact (input-like) vs Expanded (textarea with autosize) */}
              <div className="flex-1 relative" key={inputKey}>
                {!isExpanded ? (
                  /* Compact mode: single-line input-style element */
                  <input
                    type="text"
                    id="heroPromptInput"
                    value={isTyping ? displayedText : inputValue}
                    readOnly={isTyping}
                    tabIndex={isTyping ? -1 : 0}
                    onChange={(e) => {
                      if (!isTyping) {
                        const newValue = e.target.value;
                        setInputValue(newValue);
                        // Switch to expanded mode if user types enough or pastes content
                        if (newValue.length > 60 || newValue.includes('\n')) {
                          setIsExpanded(true);
                        }
                      }
                    }}
                    onFocus={(e) => {
                      if (isTyping) {
                        e.target.blur();
                        setIsTyping(false);
                        setInputValue(displayedText);
                        setIsExpanded(true); // Expand when user interacts
                        return;
                      }
                      handleFocus();
                    }}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isTyping) {
                        const val = inputValue.trim();
                        if (val) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }
                    }}
                    className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base text-left"
                    placeholder={isTyping ? "" : "Enter your prompt..."}
                    style={{
                      lineHeight: `${LINE_HEIGHT}px`,
                      height: `${MIN_HEIGHT}px`,
                      caretColor: isFocused && !isTyping ? 'hsl(var(--primary))' : 'transparent',
                    }}
                  />
                ) : (
                  /* Expanded mode: auto-resizing textarea */
                  <textarea
                    ref={textareaRef}
                    id="heroPromptInput"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => handleFocus()}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={(e) => {
                      // Shift+Enter for new line (default behavior)
                      // Enter alone triggers analyze
                      if (e.key === "Enter" && !e.shiftKey) {
                        if (inputValue.trim()) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }
                    }}
                    className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base resize-none prompt-textarea text-left"
                    placeholder="Enter your prompt..."
                    style={{
                      lineHeight: `${LINE_HEIGHT}px`,
                      minHeight: `${MIN_HEIGHT}px`,
                      maxHeight: `${MAX_HEIGHT}px`,
                      caretColor: isFocused ? 'hsl(var(--primary))' : 'transparent',
                      transition: 'height 150ms cubic-bezier(0.22, 1, 0.36, 1)',
                      overflowY: 'hidden',
                    }}
                  />
                )}
              </div>
              {/* Arrow button - stays pinned at top */}
              <button
                id="heroPromptSubmit"
                onClick={handleSubmit}
                className="btn-micro w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 hover:bg-primary/90"
                aria-label="Analyze prompt"
                style={{ marginTop: '-2px' }}
              >
                <ArrowRight className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
          </div>

          {/* Analyzer Row - Animated */}
          <CollapsiblePanel isOpen={isAnalyzed && analysis !== null}>
            <div className="px-4 pb-3 space-y-3 border-t border-border/20 pt-3">
              {/* Score + Actions in one line */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Score display */}
                <div className={cn("flex items-center gap-2", scoreGlow && "score-glow")}>
                  <span className="text-xs text-muted-foreground">Score:</span>
                  <span className={cn("text-base font-semibold text-primary", isAnimating && "scale-110")} style={{
                  transition: `transform 200ms ${MOTION.bounce}`
                }}>
                    {displayScore}
                  </span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
                
                {/* Progress bar */}
                <div className={cn("w-16 h-1.5 rounded-full overflow-hidden bg-stone-500", scoreGlow && "progress-bar-glow")}>
                  <div className="h-full bg-primary rounded-full progress-bar-fill" style={{
                  width: `${displayScore}%`
                }} />
                </div>
                
                {/* Label */}
                {analysis && <span className={cn("text-xs font-medium", getLabelColor(analysis.label))} style={{
                transition: `color ${MOTION.micro} ease`
              }}>
                    {analysis.label}
                  </span>}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Action buttons */}
                <div className="flex items-center gap-1.5">
                  {hasImproved || (analysis && analysis.missing.length === 0) ? (
                    <Button size="sm" variant="ghost" onClick={handleStartOver} className="btn-micro text-xs h-6 px-2.5 rounded-full text-muted-foreground">
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Start over
                    </Button>
                  ) : (
                    <Button size="sm" variant={outputMode === "improve" ? "default" : "ghost"} onClick={handleImprove} disabled={!hasPrompt || !analysis || analysis.missing.length === 0} className="btn-micro text-xs h-6 px-2.5 rounded-full">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Improve
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={handleCopy} disabled={!hasPrompt && !outputData} className="btn-micro text-xs h-6 px-2.5 rounded-full">
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>

              {/* Element status rows - unified grid system */}
              {analysis && (
                <div className="grid grid-cols-[56px_1fr] gap-x-3 gap-y-2.5">
                  {/* Detected row */}
                  <span className="text-xs text-muted-foreground leading-[22px]">Detected:</span>
                  <div className="flex flex-wrap gap-1.5 items-center min-h-[22px]">
                    {analysis.detected.length > 0 ? (
                      analysis.detected.map((item, i) => {
                        const IconComponent = ELEMENT_ICONS[item];
                        return (
                          <span 
                            key={i}
                            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-medium"
                            style={{
                              opacity: 0,
                              animation: `dropdown-in ${MOTION.micro} ${MOTION.primary} forwards`,
                              animationDelay: `${i * 30}ms`
                            }}
                          >
                            {IconComponent && <IconComponent className="w-3 h-3" />}
                            {item}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-muted-foreground italic leading-[22px]">None yet</span>
                    )}
                  </div>

                  {/* Missing row */}
                  <span className="text-xs text-muted-foreground leading-[22px]">Missing:</span>
                  <div className="flex flex-wrap gap-1.5 items-center min-h-[22px]">
                    {analysis.missing.length > 0 ? (
                      <TooltipProvider delayDuration={100}>
                        {analysis.missing.map((item, i) => {
                          const IconComponent = ELEMENT_ICONS[item];
                          return (
                            <Tooltip key={i}>
                              <TooltipTrigger asChild>
                                <button 
                                  onClick={() => {
                                    const template = generateContextualTemplate(item, inputValue);
                                    const newValue = inputValue.trimEnd() + template;
                                    setInputValue(newValue);
                                    setIsTyping(false);
                                    setIsExpanded(true); // Switch to expanded for longer content
                                    setTimeout(() => runAnalysis(newValue), 100);
                                  }}
                                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium cursor-pointer hover:bg-amber-500/30 hover:border-amber-500/40 hover:scale-105 active:scale-100 transition-all duration-150"
                                  style={{
                                    opacity: 0,
                                    animation: `dropdown-in ${MOTION.micro} ${MOTION.primary} forwards`,
                                    animationDelay: `${i * 30}ms`
                                  }}
                                >
                                  {IconComponent && <IconComponent className="w-3 h-3" />}
                                  {item}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" sideOffset={8} avoidCollisions={true} className="max-w-[220px] text-xs leading-relaxed z-[100]">
                                <p className="mb-1">{ELEMENT_TIPS[item] || `Add ${item.toLowerCase()} to your prompt`}</p>
                                <p className="text-amber-400 font-medium">Click to insert template</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </TooltipProvider>
                    ) : (
                      <span className="text-xs text-emerald-500 font-medium flex items-center gap-1 leading-[22px]">
                        <Check className="w-3 h-3" />
                        All elements detected!
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Output area - stays open, content crossfades */}
              <CollapsiblePanel isOpen={showOutput && !!outputData}>
                <div className="bg-muted/30 border border-border/30 rounded-lg p-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                  <div className="max-w-[680px]">
                    <ContentSwitcher data={outputData} contentKey={outputMode || "none"} analysis={analysis} />
                  </div>
                </div>
              </CollapsiblePanel>
            </div>
          </CollapsiblePanel>
        </div>
      </div>
    </>;
};
export default PromptLab;