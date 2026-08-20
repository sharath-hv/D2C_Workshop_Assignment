import { Typography } from "../lib/acko/Typography";
import { Button } from "../lib/acko/Button";
import { TextInput } from "../lib/acko/TextInput";
import { Dropdown } from "../lib/acko/Dropdown";
import { DatePicker } from "../lib/acko/DatePicker";
import { ChipGroup } from "../lib/acko/Chip";
import { Alert } from "../lib/acko/Alert";
import { Surface } from "../lib/acko/Surface";
import { ChevronLeft, Headphone, Discount, Info } from "../lib/acko/icons";

const CONTENT_WIDTH_CLASSES = "mx-auto w-full max-w-[560px] px-16 min-[600px]:max-w-[720px] min-[600px]:px-32 lg:px-40";

const MARITAL_STATUS_OPTIONS = [
  { label: "Married", value: "married" },
  { label: "Unmarried", value: "unmarried" },
];

const RESIDENTIAL_STATUS_OPTIONS = [
  { label: "Resident", value: "resident" },
  { label: "Non-resident", value: "non-resident" },
];

const EDUCATION_OPTIONS = [
  { label: "Below 10th", value: "below-10th" },
  { label: "10th/12th", value: "10th-12th" },
  { label: "Diploma/Graduate and above", value: "diploma-graduate-plus" },
  { label: "Post graduate and above", value: "post-graduate-plus" },
];

const OCCUPATION_OPTIONS = [
  { label: "Salaried", value: "salaried" },
  { label: "Self-employed", value: "self-employed" },
  { label: "Business owner", value: "business-owner" },
  { label: "Student", value: "student" },
  { label: "Retired", value: "retired" },
];

/**
 * "Almost there! We just need a few more details" — proposer KYC form
 * (Personal details + Professional details), built from the ACKO skill files
 * only. See CLAUDE.md for the missing-components protocol this screen was
 * checked against — every element here maps to a documented @acko/*
 * component or pattern, so no `missing-components-*.md` entry was needed.
 */
export function AlmostThereDetailsPage() {
  return (
    <div style={{ background: "var(--surfaceBase)", minHeight: "100vh" }}>
      {/* Sticky nav (cards.md "Sticky nav / header rule" + scales.md --zSticky) — full-bleed
          bar, constrained inner row, stays pinned while the form scrolls underneath. */}
      <div className="acko-sticky-header w-full">
        <div className={`${CONTENT_WIDTH_CLASSES} flex items-center justify-between py-12`}>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            iconLeft={<ChevronLeft aria-hidden="true" />}
            aria-label="Go back"
          />
          <Button variant="secondary" size="sm" iconLeft={<Headphone aria-hidden="true" />}>
            Help
          </Button>
        </div>
      </div>

      <div
        className={`${CONTENT_WIDTH_CLASSES} flex flex-col`}
        // 180px = 148px sticky-footer height + a 32px gap above the coupon strip.
        style={{ paddingBottom: "calc(180px + env(safe-area-inset-bottom))" }}
      >
        {/* Screen title — mt-8 per explicit request, overriding layout.md's Standard Flow
            Screen template (Header ↓32 Title); see missing-components log. */}
        <Typography variant="heading-xl" weight="bold" as="h1" className="mt-8">
          Almost there! We just need a few more details
        </Typography>

        {/* Advisory note — mt-24 per explicit request, overriding layout.md's Standard Flow
            Screen template's tighter Title↓8 Subtitle step; see missing-components log. */}
        <div className="mt-24">
          <Alert severity="warning" icon={<Info />}>
            Please make sure this information is as per your PAN card
          </Alert>
        </div>

        {/* Personal + Professional details — flat on mobile/tablet (matches the source
            screenshots); gains a Card-primary panel at desktop (see .acko-form-panel) so
            the form reads as a defined shape on wide viewports instead of floating.
            mt-32 matches the template's Subtitle→Primary-content step; the two sections
            inside are separated by gap-48, a true section break. */}
        <div className="acko-form-panel mt-32 flex flex-col gap-48">
          <section>
            <Typography variant="heading-sm" as="h2">
              Personal details
            </Typography>
            {/* layout.md: form fields stay single-column on mobile, can pair up from
                tablet (>=600px) — responsiveness.md's canonical breakpoint. */}
            <div className="mt-32 grid grid-cols-1 gap-24 min-[600px]:grid-cols-2">
              <div className="min-[600px]:col-span-2">
                <TextInput id="fullName" label="Full Name" autoComplete="name" />
              </div>
              <DatePicker id="dob" label="Date of birth" />
              <TextInput id="email" label="Email ID" type="email" autoComplete="email" spellCheck={false} />
              <ChipGroup name="maritalStatus" legend="Marital Status" options={MARITAL_STATUS_OPTIONS} />
              <ChipGroup
                name="residentialStatus"
                legend="Residential Status"
                options={RESIDENTIAL_STATUS_OPTIONS}
              />
            </div>
          </section>

          <section>
            <Typography variant="heading-sm" as="h2">
              Professional details
            </Typography>
            <div className="mt-32 grid grid-cols-1 gap-24 min-[600px]:grid-cols-2">
              <Dropdown id="education" label="Educational Qualification" options={EDUCATION_OPTIONS} />
              <Dropdown id="occupation" label="Occupation type" options={OCCUPATION_OPTIONS} />
              <div className="min-[600px]:col-span-2">
                <TextInput id="monthlyIncome" label="Monthly income" type="text" inputMode="numeric" prefix="₹" />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky price footer */}
      <div className="fixed inset-x-0 bottom-0 z-[var(--zSticky)]" data-fixed-bottom-bar>
        {/* Savings indicator, not a brand moment — solid success-green per semantics.md's
            success family, overriding Surface's brandLight fill (still used structurally
            for its full-bleed shell). See missing-components log. */}
        <Surface variant="brandLight" className="w-full rounded-none" style={{ background: "var(--statusSuccessSubtle)" }}>
          <div className="flex h-40 items-center justify-center gap-8">
            <span className="inline-flex size-16 shrink-0 [&_svg]:size-full" style={{ color: "var(--statusSuccessText)" }} aria-hidden="true">
              <Discount />
            </span>
            <Typography variant="label-lg" weight="semibold" color="success" as="p">
              'ACKO15LIFE' coupon applied
            </Typography>
          </div>
        </Surface>
        <div
          className={`${CONTENT_WIDTH_CLASSES} flex items-center justify-between py-16`}
          style={{
            background: "var(--surfaceBase)",
            paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
          }}
        >
          <div className="flex flex-col">
            <Typography
              variant="body-sm"
              color="secondary"
              style={{ textDecoration: "line-through" }}
            >
              ₹8,015/yr
            </Typography>
            {/* flex-wrap: from tablet up (600px, responsiveness.md's canonical breakpoint)
                there's room for "Price details" to sit inline after "(0% GST)" with a
                16px gap; on mobile it wraps to its own line below, matching the source
                screenshots. */}
            <div className="flex flex-wrap items-baseline">
              <div className="flex items-baseline gap-4">
                <Typography variant="heading-md" weight="bold" as="p">
                  6,813/yr
                </Typography>
                <Typography variant="body-sm" color="secondary">
                  (0% GST)
                </Typography>
              </div>
              {/* semantics.md's text/link (--textLink, blue) is the documented token for
                  hyperlinks — --textBrand is for "brand-coloured text (links, active
                  labels)" generally, but this is specifically a hyperlink. Typography's
                  color prop doesn't expose "link" as one of its 7 values, so overriding
                  via style rather than inventing new component API. See missing-components
                  log. */}
              <Typography
                as="button"
                variant="body-sm"
                weight="medium"
                className="acko-tap-target-link acko-link-underline-on-hover basis-full mt-4 min-[600px]:ml-16 min-[600px]:mt-0 min-[600px]:basis-auto"
                style={{
                  color: "var(--textLink)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                Price details
              </Typography>
            </div>
          </div>
          <Button variant="inverted" size="md">
            Review my plan
          </Button>
        </div>
      </div>
    </div>
  );
}
