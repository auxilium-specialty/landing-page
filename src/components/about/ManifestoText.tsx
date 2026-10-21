import { cn } from "@/lib/utils";

/**
 * The manifesto, as three paragraphs. Shared by the About page and the holding
 * page so the words live in one place; each caller styles the container.
 */
export function ManifestoText({ asideClassName }: { asideClassName?: string }) {
  return (
    <>
      <p>
        Innovation is outpacing insurance. At Auxilium{" "}
        <i className={cn("text-brand-mid", asideClassName)}>[Latin for help, aid, assistance, or support]</i> we
        believe that insurance is the enabler of adoption. By providing coverage for novel and underserved risks as well
        as defining adoption frameworks, we help markets and industries move forward with confidence, free from the fear
        of costly mistakes.
      </p>
      <p>
        Over the past few years we have witnessed a new industrial revolution unfolding in front of our eyes. Yet many
        still hesitate because of the potential dangers. This is no different than when steam, electricity, and the
        automobile each arrived with new exposures. We are an AI-native company, using state-of-the-art tools to
        underwrite, price and distribute insurance where others cannot.
      </p>
      <p>
        We're here to make sure emerging risks are mitigated, to protect inventors and builders, and to{" "}
        <b className="font-semibold">insure industrial revolutions</b>.
      </p>
    </>
  );
}
