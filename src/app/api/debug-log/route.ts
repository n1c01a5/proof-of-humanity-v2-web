// ==================== DEBUG: REMOVE THIS ENTIRE FILE ====================
import { NextResponse } from "next/server";

/**
 * Temporary debug API route — receives client-side console output
 * relayed by DebugLogRelay.tsx and prints it to the server terminal.
 *
 * DELETE THIS FILE once debugging is done.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const level = (body.level ?? "info").toUpperCase();
    console.log(`\n[CLIENT ${level}]`, JSON.stringify(body.args ?? body, null, 2), "\n");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
// ==================== /DEBUG: REMOVE THIS ENTIRE FILE ====================
