/**
 * OpenAI.com.my — Secure Google AI Studio / Gemini Interactions Edge Proxy API
 * Cloudflare Pages Function: /api/gemini
 *
 * Security & Architecture:
 * 1. Keeps GEMINI_API_KEY strictly on the Cloudflare Edge server (via Pages Secrets).
 * 2. Uses the Gemini v1 Interactions API (Api-Revision: 2026-05-20) and Gemini 4 Hydrogen
 *    for MOE KSSR/KSSM/SPM trilingual question generation ('question'), Socratic hints ('hint'),
 *    and general structured or multi-turn prompts ('generate').
 * 3. Enforces per-IP rate limiting, strict model validation, and legacy parameter migration.
 */

const DEFAULT_MODEL = 'gemini-4-hydrogen';
const INTERACTIONS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/interactions';
const API_REVISION = '2026-05-20';
const RATE_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;
const DEPRECATED_GEMINI_PATTERN = /^gemini-(?:1(?:\.\d+)?|2(?:\.\d+)?)(?:-[a-z0-9._-]+)?$/i;
const VALID_THINKING_LEVELS = new Set(['minimal', 'low', 'medium', 'high', 'xhigh']);

const RATE_LIMITER = globalThis.__OPENAI_MY_GEMINI_RATE__ || (globalThis.__OPENAI_MY_GEMINI_RATE__ = new Map());

const LANG_LABELS = {
  en: 'English',
  ms: 'Bahasa Melayu',
  bm: 'Bahasa Melayu',
  zh: 'Simplified Chinese (简体中文)'
};

const AGE_CONTEXT = {
  '5-6': 'Ages 5-6 (Malaysian Preschool / Prasekolah: early numeracy, shapes, phonics, basic nature)',
  '7-9': 'Ages 7-9 (Malaysian KSSR Primary 1-3: arithmetic, multiplication, basic science & language)',
  '10-12': 'Ages 10-12 (Malaysian KSSR Primary 4-6 / UPSR level: fractions, percentages, geometry, science, Sejarah)',
  '13-15': 'Ages 13-15 (Malaysian KSSM Secondary Form 1-3 / PT3 level: algebra, linear equations, Pythagoras, STEM)',
  '16+': 'Ages 16+ (Malaysian KSSM Upper Secondary Form 4-5 / SPM level: quadratics, calculus, physics, chemistry, Sejarah)'
};

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: getCorsHeaders()
  });
}

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = RATE_LIMITER.get(ip);
  if (!entry || now >= entry.resetAt) {
    RATE_LIMITER.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { allowed: false, retryAfterSec };
  }
  entry.count += 1;
  return { allowed: true };
}

const QUESTION_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    prompt: { type: 'string' },
    options: {
      type: 'array',
      items: { type: 'string' },
      minItems: 4,
      maxItems: 4
    },
    correctIndex: { type: 'integer' },
    explanation: { type: 'string' },
    subject: { type: 'string' },
    topic: { type: 'string' }
  },
  required: ['prompt', 'options', 'correctIndex', 'explanation']
};

/** Resolve and validate the target Gemini model, upgrading deprecated 1.x/2.x IDs. */
function sanitizeModel(requestedModel, envModel) {
  const candidate = String(requestedModel || envModel || DEFAULT_MODEL).trim();
  if (DEPRECATED_GEMINI_PATTERN.test(candidate)) {
    return DEFAULT_MODEL;
  }
  if (/^gemini-[a-z0-9._-]+$/i.test(candidate) && candidate.length <= 64) {
    return candidate;
  }
  return DEFAULT_MODEL;
}

/** Normalize thinking_level for Gemini 4 (where 'minimal' is rejected) and other models. */
function sanitizeThinkingLevel(requestedLevel, model, fallback = 'low') {
  const raw = String(requestedLevel || '').trim().toLowerCase();
  const isGemini4 = /^gemini-4/i.test(model);
  if (!raw || !VALID_THINKING_LEVELS.has(raw)) {
    return fallback;
  }
  if (isGemini4 && raw === 'minimal') {
    return 'low';
  }
  if ((model === 'gemini-4-argon' || model === 'gemini-4-carbon') && raw === 'xhigh') {
    return 'high';
  }
  return raw;
}

function extractTextFromParts(parts) {
  if (!Array.isArray(parts)) return '';
  return parts.map((p) => (typeof p?.text === 'string' ? p.text : '')).join('');
}

function extractSystemInstruction(raw) {
  if (!raw) return '';
  if (typeof raw === 'string') return raw.trim();
  if (Array.isArray(raw.parts)) return extractTextFromParts(raw.parts).trim();
  return '';
}

function contentsToInteractionSteps(contents) {
  return contents.map((item) => {
    const role = String(item?.role || 'user').toLowerCase();
    const text = extractTextFromParts(item?.parts);
    return {
      type: role === 'model' || role === 'assistant' ? 'model_output' : 'user_input',
      content: [{ type: 'text', text }]
    };
  });
}

/** Convert legacy uppercase Gemini responseSchema types (OBJECT/STRING) to JSON Schema lowercase. */
function normalizeJsonSchema(node) {
  if (Array.isArray(node)) {
    return node.map(normalizeJsonSchema);
  }
  if (!node || typeof node !== 'object') {
    return node;
  }
  const copy = {};
  for (const [key, value] of Object.entries(node)) {
    if (key === 'type' && typeof value === 'string') {
      copy[key] = value.toLowerCase();
    } else {
      copy[key] = normalizeJsonSchema(value);
    }
  }
  return copy;
}

function normalizeResponseFormat(body) {
  const explicit = body.response_format || body.responseFormat;
  if (explicit && typeof explicit === 'object') {
    if (Array.isArray(explicit)) {
      return explicit;
    }
    if (explicit.type) {
      return explicit.schema
        ? { ...explicit, schema: normalizeJsonSchema(explicit.schema) }
        : explicit;
    }
  }

  const rawGen = body.generation_config || body.generationConfig || {};
  const mimeType = body.responseMimeType || rawGen.responseMimeType || body.mime_type;
  const schema = body.responseSchema || rawGen.responseSchema;
  if (mimeType || schema) {
    const format = {
      type: 'text',
      mime_type: mimeType || 'application/json'
    };
    if (schema && typeof schema === 'object') {
      format.schema = normalizeJsonSchema(schema);
    }
    return format;
  }
  return null;
}

function buildGenerationConfig(body, model, defaultThinkingLevel) {
  const raw = body.generation_config || body.generationConfig || {};
  const genConfig = {};

  genConfig.thinking_level = sanitizeThinkingLevel(
    body.thinkingLevel || body.thinking_level || raw.thinking_level || raw.thinkingLevel,
    model,
    defaultThinkingLevel
  );

  // Gemini 4 shares max_output_tokens across thinking and output; raise sub-32K limits when explicit.
  const rawMax = body.maxOutputTokens ?? body.max_output_tokens ?? raw.max_output_tokens ?? raw.maxOutputTokens;
  if (typeof rawMax === 'number' && Number.isFinite(rawMax) && rawMax > 0) {
    const isGemini4 = /^gemini-4/i.test(model);
    genConfig.max_output_tokens = isGemini4 ? Math.max(32768, Math.floor(rawMax)) : Math.floor(rawMax);
  }

  if (typeof raw.seed === 'number') genConfig.seed = raw.seed;
  if (Array.isArray(raw.stop_sequences)) genConfig.stop_sequences = raw.stop_sequences;
  if (raw.thinking_summaries) genConfig.thinking_summaries = raw.thinking_summaries;

  return genConfig;
}

function buildStudentContext(body) {
  const ageBand = AGE_CONTEXT[body.ageBand] ? body.ageBand : '10-12';
  const langKey = String(body.lang || 'en').toLowerCase();
  const langName = LANG_LABELS[langKey] || 'English';
  return {
    ageProfile: AGE_CONTEXT[ageBand],
    langName,
    subject: String(body.subject || 'Mathematics').slice(0, 80),
    topic: String(body.topic || 'Core Syllabus').slice(0, 120)
  };
}

function createInteractionPayload({ model, input, systemInstruction, body, defaultThinkingLevel, responseFormat }) {
  const payload = {
    model,
    input,
    generation_config: buildGenerationConfig(body, model, defaultThinkingLevel)
  };
  if (systemInstruction) {
    payload.system_instruction = systemInstruction;
  }
  if (responseFormat) {
    payload.response_format = responseFormat;
  }
  const prevId = body.previous_interaction_id || body.previousInteractionId;
  if (typeof prevId === 'string' && prevId.trim()) {
    payload.previous_interaction_id = prevId.trim();
  }
  if (typeof body.store === 'boolean') {
    payload.store = body.store;
  }
  return payload;
}

function buildQuestionRequest(body, model) {
  const { ageProfile, langName, subject, topic } = buildStudentContext(body);
  const difficulty = String(body.difficulty || 'standard').slice(0, 40);

  return createInteractionPayload({
    model,
    body,
    defaultThinkingLevel: 'low',
    systemInstruction: [
      'You are an expert Malaysian Ministry of Education (MOE) KSSR/KSSM/SPM curriculum designer for OpenAI.com.my.',
      `Target student profile: ${ageProfile}.`,
      `Write all question text, options, and explanation strictly in ${langName}.`,
      'Return exactly 4 distinct multiple-choice options and ensure only 1 option is unambiguously correct.'
    ].join(' '),
    input: `Generate 1 ${difficulty} interactive educational game question for subject "${subject}" on topic "${topic}".`,
    responseFormat: {
      type: 'text',
      mime_type: 'application/json',
      schema: QUESTION_RESPONSE_SCHEMA
    }
  });
}

function buildHintRequest(body, model) {
  const ctx = buildStudentContext({ ...body, subject: body.subject || 'General' });
  const questionPrompt = String(body.prompt || body.question || '').slice(0, 600);
  const studentAnswer = String(body.studentAnswer || '').slice(0, 200);

  return createInteractionPayload({
    model,
    body,
    defaultThinkingLevel: 'low',
    systemInstruction: [
      `You are a friendly Malaysian tutor on OpenAI.com.my helping a student (${ctx.ageProfile}).`,
      `Respond concisely (2-3 sentences max) in ${ctx.langName}.`,
      'Give a helpful Socratic clue or step-by-step nudge without being condescending.'
    ].join(' '),
    input: `Subject: ${ctx.subject}\nQuestion: ${questionPrompt}${studentAnswer ? `\nStudent tried: ${studentAnswer}` : ''}\nGive a clear hint so the scholar can solve it.`
  });
}

function buildGeneralRequest(body, model) {
  const input = body.input !== undefined
    ? body.input
    : (Array.isArray(body.contents) && body.contents.length)
      ? contentsToInteractionSteps(body.contents)
      : String(body.prompt || '');

  const systemInstruction = extractSystemInstruction(body.system_instruction || body.systemInstruction);
  const responseFormat = normalizeResponseFormat(body);

  const payload = createInteractionPayload({
    model,
    input,
    systemInstruction,
    body,
    defaultThinkingLevel: 'medium',
    responseFormat
  });

  if (Array.isArray(body.tools) && body.tools.length) {
    payload.tools = body.tools;
  }
  return payload;
}

/** Extract concatenated text across model_output steps (v1 Interactions steps schema). */
function extractInteractionText(data) {
  if (Array.isArray(data?.steps)) {
    return data.steps
      .filter((step) => step && step.type === 'model_output')
      .flatMap((step) => (Array.isArray(step.content) ? step.content : []))
      .filter((item) => item && item.type === 'text' && typeof item.text === 'string')
      .map((item) => item.text)
      .join('');
  }
  if (typeof data?.output_text === 'string') {
    return data.output_text;
  }
  if (Array.isArray(data?.outputs)) {
    return data.outputs
      .filter((item) => typeof item?.text === 'string')
      .map((item) => item.text)
      .join('');
  }
  return '';
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: getCorsHeaders() });
}

export async function onRequestGet(context) {
  const env = context.env || {};
  return jsonResponse({
    ok: true,
    api: 'interactions-v1',
    configured: Boolean(env.GEMINI_API_KEY),
    defaultModel: sanitizeModel(null, env.GEMINI_MODEL),
    supportedModes: ['question', 'hint', 'generate'],
    endpoint: '/api/gemini'
  }, 200);
}

export async function onRequestPost(context) {
  const ip = context.request.headers.get('CF-Connecting-IP') || 'local';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return jsonResponse({
      ok: false,
      error: `Rate limit exceeded. Try again in ${rate.retryAfterSec}s.`
    }, 429);
  }

  const env = context.env || {};
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse({
      ok: false,
      configured: false,
      error: 'GEMINI_API_KEY is not configured in Cloudflare Pages Secrets yet. Run: npx wrangler pages secret put GEMINI_API_KEY --project-name openai-com-my'
    }, 503);
  }

  let body = {};
  try {
    body = await context.request.json();
  } catch (_) {
    return jsonResponse({ ok: false, error: 'Invalid JSON request body.' }, 400);
  }

  const mode = String(body.mode || 'generate').toLowerCase();
  if (mode === 'generate' && body.input === undefined && !body.prompt && !(Array.isArray(body.contents) && body.contents.length)) {
    return jsonResponse({ ok: false, error: 'Request requires "input", "prompt", or "contents".' }, 400);
  }
  if ((mode === 'hint' || mode === 'tutor') && !body.prompt && !body.question) {
    return jsonResponse({ ok: false, error: 'Hint mode requires "prompt" or "question".' }, 400);
  }

  const model = sanitizeModel(body.model, env.GEMINI_MODEL);
  const interactionBody = (mode === 'question' || mode === 'quiz')
    ? buildQuestionRequest(body, model)
    : (mode === 'hint' || mode === 'tutor')
      ? buildHintRequest(body, model)
      : buildGeneralRequest(body, model);

  let upstreamRes;
  let upstreamData;
  try {
    upstreamRes = await fetch(INTERACTIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
        'Api-Revision': API_REVISION
      },
      body: JSON.stringify(interactionBody)
    });
    upstreamData = await upstreamRes.json();
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: 'Failed to reach Google AI Studio Gemini Interactions API.',
      detail: String(err && err.message ? err.message : err)
    }, 502);
  }

  if (!upstreamRes.ok) {
    return jsonResponse({
      ok: false,
      status: upstreamRes.status,
      error: (upstreamData && upstreamData.error && upstreamData.error.message) || 'Gemini Interactions API request failed.'
    }, upstreamRes.status >= 400 && upstreamRes.status < 600 ? upstreamRes.status : 502);
  }

  const text = extractInteractionText(upstreamData);
  const expectsJson = (
    interactionBody.response_format?.mime_type === 'application/json' ||
    mode === 'question' ||
    mode === 'quiz'
  );

  let parsedJson = null;
  if (text && expectsJson) {
    try {
      parsedJson = JSON.parse(text);
    } catch (_) {
      parsedJson = null;
    }
  }

  const result = {
    ok: true,
    mode,
    model: upstreamData?.model || model,
    interactionId: upstreamData?.id || null,
    status: upstreamData?.status || null,
    text,
    json: parsedJson,
    usage: upstreamData?.usage || null,
    usageMetadata: upstreamData?.usage || null
  };

  if (mode === 'question' || mode === 'quiz') {
    result.question = parsedJson;
  }

  return jsonResponse(result, 200);
}
