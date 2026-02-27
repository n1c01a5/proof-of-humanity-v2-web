// ==================== DEBUG: REMOVE THIS ENTIRE FILE ====================
"use client";

import { useEffect } from "react";

/**
 * Temporary debug component — intercepts all console.log/warn/error
 * on the client and relays them to /api/debug-log so they appear
 * in the server terminal. Useful for debugging on mobile where
 * there's no access to DevTools.
 *
 * DELETE THIS FILE once debugging is done.
 */
export default function DebugLogRelay() {
  useEffect(() => {
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;

    function send(level: string, args: unknown[]) {
      const serialized = args.map((a) => {
        if (a instanceof Error)
          return { message: a.message, name: a.name, stack: a.stack };
        try {
          return JSON.parse(JSON.stringify(a));
        } catch {
          return String(a);
        }
      });

      fetch("/api/debug-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, args: serialized }),
      }).catch(() => {});
    }

    console.log = (...args: unknown[]) => {
      origLog.apply(console, args);
      send("log", args);
    };
    console.warn = (...args: unknown[]) => {
      origWarn.apply(console, args);
      send("warn", args);
    };
    console.error = (...args: unknown[]) => {
      origError.apply(console, args);
      send("error", args);
    };

    // Also catch unhandled errors & promise rejections
    const onError = (e: ErrorEvent) => {
      send("uncaught-error", [
        { message: e.message, filename: e.filename, lineno: e.lineno, colno: e.colno },
      ]);
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      send("unhandled-rejection", [
        e.reason instanceof Error
          ? { message: e.reason.message, name: e.reason.name, stack: e.reason.stack }
          : String(e.reason),
      ]);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    origLog("[DebugLogRelay] Intercepting console output → /api/debug-log");

    return () => {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
// ==================== /DEBUG: REMOVE THIS ENTIRE FILE ====================
