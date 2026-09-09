import { escapeHtml } from "../../../shared/security/html";

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light dark; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: ui-sans-serif, system-ui, sans-serif;
      background: Canvas;
      color: CanvasText;
    }
    main {
      width: min(420px, calc(100vw - 32px));
      display: grid;
      gap: 16px;
    }
    h1 { font-size: 1.4rem; margin: 0; }
    p { margin: 0; opacity: 0.75; line-height: 1.4; }
    form { display: grid; gap: 12px; }
    label { display: grid; gap: 6px; font-size: 0.9rem; }
    input {
      padding: 10px 12px;
      font-size: 1rem;
      border: 1px solid color-mix(in srgb, CanvasText 20%, transparent);
      border-radius: 8px;
      background: Canvas;
      color: CanvasText;
    }
    button {
      padding: 10px 12px;
      border: 0;
      border-radius: 8px;
      background: CanvasText;
      color: Canvas;
      font-size: 1rem;
      cursor: pointer;
    }
    .error { color: #b42318; }
  </style>
</head>
<body>
  <main>${body}</main>
</body>
</html>`;
}

export function phoneLoginPage(input: { error?: string }): string {
  const error = input.error
    ? `<p class="error">${escapeHtml(input.error)}</p>`
    : "";
  return layout(
    "Sign in",
    `<h1>Sign in</h1>
     <p>Use your phone number. We will send a one-time code.</p>
     ${error}
     <form method="post" action="/login/otp">
       <label>Phone number
         <input name="phoneNumber" required autocomplete="tel" placeholder="+98912…" />
       </label>
       <button type="submit">Send code</button>
     </form>`,
  );
}

export function verifyOtpPage(input: {
  challengeId: string;
  error?: string;
}): string {
  const error = input.error
    ? `<p class="error">${escapeHtml(input.error)}</p>`
    : "";
  return layout(
    "Enter code",
    `<h1>Enter the code</h1>
     <p>Enter the 6-digit code we sent. It expires in a few minutes.</p>
     ${error}
     <form method="post" action="/login/verify">
       <input type="hidden" name="challengeId" value="${escapeHtml(input.challengeId)}" />
       <label>Code
         <input name="code" required inputmode="numeric" pattern="[0-9]{6}" autocomplete="one-time-code" />
       </label>
       <button type="submit">Continue</button>
     </form>
     <form method="post" action="/login/resend">
       <input type="hidden" name="challengeId" value="${escapeHtml(input.challengeId)}" />
       <button type="submit">Resend code</button>
     </form>`,
  );
}
