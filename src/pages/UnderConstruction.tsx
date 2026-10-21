import { useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { GlassWordmark } from "@/components/holding/GlassWordmark";
import { ManifestoText } from "@/components/about/ManifestoText";
import { FORMSPREE_ENDPOINT } from "@/features/contact/PortalForm";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import "@/styles/holding.css";

/**
 * The one page shown while the site is rebuilt, a single screen that never
 * scrolls: the wordmark and a way to get in touch on the left, the manifesto on
 * the right, centered as a pair. The form drops open over the space below the
 * button and moves nothing. On phones, where the columns stack, it opens over
 * the manifesto.
 */
export default function UnderConstruction() {
  const [open, setOpen] = useState(false);
  const [lift, setLift] = useState(0);
  const liftRef = useRef(0);
  const mainRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // On a short window the open form would run past the bottom, so the left
  // column sits just high enough for it to fit. This is worked out from the window
  // size alone (the closed form keeps its size), never from opening it.
  useLayoutEffect(() => {
    const main = mainRef.current;
    const left = leftRef.current;
    const anchor = anchorRef.current;
    const drawer = drawerRef.current;
    if (!main || !left || !anchor || !drawer) return;
    const measure = () => {
      const m = main.getBoundingClientRect();
      const { paddingTop, paddingBottom } = getComputedStyle(main);
      const anchorBottom = anchor.getBoundingClientRect().bottom + liftRef.current;
      const leftTop = left.getBoundingClientRect().top + liftRef.current;
      const overflow = anchorBottom + drawer.offsetHeight - (m.bottom - parseFloat(paddingBottom));
      const room = leftTop - (m.top + parseFloat(paddingTop));
      const next = Math.round(Math.max(0, Math.min(overflow, room)));
      liftRef.current = next;
      setLift(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    [main, left, drawer].forEach((el) => ro.observe(el));
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="holding relative flex h-svh flex-col overflow-hidden px-5 py-5 font-manifesto sm:px-10 sm:py-6 lg:px-16">
      <header className="relative flex items-center justify-end whitespace-nowrap font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[#1a1712]/70 sm:justify-between">
        <span className="hidden sm:inline">{site.name}</span>
        <span className="flex items-center gap-2.5">
          <span className="holding-dot h-1.5 w-1.5 bg-[#b58d3c]" />
          Under construction
        </span>
      </header>

      <main ref={mainRef} className="relative flex min-h-0 flex-1 items-center py-4 sm:py-6">
        <div className="grid w-full gap-6 sm:gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16 xl:grid-cols-[1.35fr_1fr]">
          <div
            ref={leftRef}
            className="relative z-10"
            style={lift ? { transform: `translateY(-${lift}px)` } : undefined}
          >
            <h1 className="w-full">
              <GlassWordmark />
            </h1>

            <div ref={anchorRef} className="relative mt-5 sm:mt-10">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="holding-contact"
                className="inline-flex items-center gap-3 rounded-none border border-[#b58d3c]/60 bg-white px-6 py-3.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#8c6a22] transition-colors hover:border-[#b58d3c] hover:bg-[#b58d3c]/[0.06]"
              >
                Get in touch
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", open && "rotate-180")} />
              </button>

              <div
                id="holding-contact"
                ref={drawerRef}
                data-open={open}
                className="holding-drawer absolute left-0 top-full z-20 w-full max-w-[30rem]"
              >
                <ContactForm />
              </div>
            </div>
          </div>

          <section
            aria-label="Manifesto"
            className={cn(
              "transition-opacity duration-300 lg:border-l lg:border-[#b58d3c]/25 lg:pl-12",
              open && "max-lg:opacity-0",
            )}
          >
            <div className="mb-3 flex items-center gap-3 sm:mb-6">
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[#8c6a22]">Manifesto</span>
              <span className="h-px w-12 bg-[#b58d3c]/50" />
            </div>
            <div className="max-w-[36rem] space-y-3 text-[clamp(0.8rem,1.75vh,1.15rem)] font-light leading-normal sm:leading-relaxed text-[#1a1712]/85 sm:space-y-4">
              <ManifestoText asideClassName="text-[#8c6a22]" />
            </div>
          </section>
        </div>
      </main>

      <footer className="relative flex flex-col justify-between gap-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#1a1712]/60 sm:flex-row">
        <span>
          © {new Date().getFullYear()} {site.legalName}
        </span>
        <span className="flex gap-6">
          <a href={`mailto:${site.email.contact}`} className="normal-case tracking-[0.08em] hover:text-[#8c6a22]">
            {site.email.contact}
          </a>
          <a href={site.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#8c6a22]">
            LinkedIn
          </a>
        </span>
      </footer>
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const data = new FormData(e.currentTarget);
    data.set("portal", "Holding page");
    data.set("_subject", "[Holding page] Auxilium inquiry");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("idle");
      toast.error(`Something went wrong. Please email ${site.email.contact} directly.`);
    }
  }

  if (status === "success") {
    return (
      <div className="mt-3 border border-[#b58d3c]/30 bg-white px-6 py-10 text-center shadow-[0_18px_40px_-24px_rgb(26_23_18/0.35)]">
        <p className="font-manifesto text-2xl font-light text-[#8c6a22]">Thank you.</p>
        <p className="mt-2 text-sm text-[#1a1712]/70">We will be in touch shortly.</p>
      </div>
    );
  }

  const label = "font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#1a1712]/50";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 space-y-3.5 border border-[#1a1712]/10 bg-white p-5 text-left shadow-[0_18px_40px_-24px_rgb(26_23_18/0.35)] sm:px-6"
    >
      <div className="grid grid-cols-2 gap-3.5">
        <label className="block">
          <span className={label}>Name</span>
          <input name="name" required autoComplete="name" className="holding-field" />
        </label>
        <label className="block">
          <span className={label}>Firm</span>
          <input name="organization" required autoComplete="organization" className="holding-field" />
        </label>
      </div>
      <label className="block">
        <span className={label}>Email</span>
        <input name="email" type="email" required autoComplete="email" className="holding-field" />
      </label>
      <label className="block">
        <span className={label}>
          Message <span className="normal-case tracking-normal text-[#1a1712]/30">(optional)</span>
        </span>
        <textarea name="message" rows={2} className="holding-field resize-none" />
      </label>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex flex-1 items-center justify-center gap-2 bg-gradient-to-b from-[#e8c77a] to-[#c39a45] px-6 py-3.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#1a1408] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending
            </>
          ) : (
            <>
              Send <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
        <a
          href={`mailto:${site.email.contact}`}
          className="flex items-center gap-1.5 font-mono text-[0.68rem] text-[#1a1712]/60 transition-colors hover:text-[#8c6a22]"
        >
          <Mail className="h-3.5 w-3.5" /> {site.email.contact}
        </a>
      </div>
    </form>
  );
}
