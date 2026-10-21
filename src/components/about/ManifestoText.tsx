import { cn } from "@/lib/utils";

/**
 * The manifesto, as three paragraphs. Shared by the About page and the holding
 * page so the words live in one place; each caller styles the container.
 */
export function ManifestoText({ asideClassName }: { asideClassName?: string }) {
  return (
    <>
      <p>
        Autonomy is outpacing insurance. At Auxilium{" "}
        <i className={cn("text-brand-mid", asideClassName)}>[Latin for help, aid, assistance, or support]</i> we
        believe that insurance is the enabler of adoption. By providing coverage for the risks innovation brings with it
        and defining adoption frameworks, tools can be used with confidence and fear of costly mistakes is removed.
      </p>
      <p>
        Over the past few years we have witnessed a new industrial revolution unfolding in front of our eyes. Yet
        businesses remain skeptical of the new tools and present hesitancy of using them due to the potential danger.
        This is no different than when steam, electricity, and the automobile each arrived with new exposures.
      </p>
      <p>
        We're here to make sure emerging risks are mitigated, to protect inventors and builders, and to{" "}
        <b className="font-semibold">insure industrial revolutions</b>.
      </p>
    </>
  );
}
