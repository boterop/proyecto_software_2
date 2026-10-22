const baseUrl = () =>
  (import.meta.env.VITE_API_URL ?? globalThis.API_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(status, detail, fieldErrors = {}) {
    super(detail || "Error en la solicitud");
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
    this.fieldErrors = fieldErrors;
  }
}

async function parseProblemDetail(response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {
      detail: response.statusText || "Error en la solicitud",
      fieldErrors: {},
    };
  }
  try {
    const body = await response.json();
    return {
      detail: body.detail ?? body.title ?? "Error en la solicitud",
      fieldErrors: body.errors ?? {},
    };
  } catch {
    return { detail: "Error en la solicitud", fieldErrors: {} };
  }
}

export async function apiFetch(path, options = {}) {
  const url = `${baseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(options.headers ?? {});

  if (options.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.ok) {
    if (response.status === 204) {
      return null;
    }
    const type = response.headers.get("content-type") ?? "";
    if (type.includes("application/json")) {
      return response.json();
    }
    return null;
  }

  const { detail, fieldErrors } = await parseProblemDetail(response);
  throw new ApiError(response.status, detail, fieldErrors);
}
