"use client";

import { useState } from "react";
import Link from "next/link";
import { saveInvitationAction } from "@/lib/actions";
import type { Invitation } from "@/lib/invitation";
import type { InvitationRecord } from "@/lib/types";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block font-serif text-sm text-[#6b2040]">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-[#f9a8d4] px-4 py-3 text-[#4a1530] outline-none focus:border-[#e11d48]";

async function uploadFile(file: File) {
  const body = new FormData();
  body.set("file", file);
  const res = await fetch("/api/upload", { method: "POST", body });
  const json = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error || "Upload failed");
  return json.url;
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="rounded-2xl border border-[#fde4ea] bg-[#fffafb] p-4">
      <p className="font-serif text-sm text-[#6b2040]">{label}</p>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-3 h-28 w-full rounded-xl object-cover" />
      ) : null}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} mt-3`}
      />
      <label className="mt-3 inline-block cursor-pointer rounded-full bg-white px-4 py-2 font-serif text-xs tracking-[0.16em] text-[#c81e4a] uppercase ring-1 ring-[#f9a8d4]">
        {busy ? "Uploading…" : "Upload image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setBusy(true);
            try {
              onChange(await uploadFile(file));
            } catch (error) {
              window.alert(error instanceof Error ? error.message : "Upload failed");
            } finally {
              setBusy(false);
              e.target.value = "";
            }
          }}
        />
      </label>
    </div>
  );
}

export function InvitationEditor({ record }: { record: InvitationRecord }) {
  const [title, setTitle] = useState(record.title);
  const [slug, setSlug] = useState(record.slug);
  const [published, setPublished] = useState(record.published);
  const [chargedAmount, setChargedAmount] = useState(String(record.chargedAmount));
  const [extraNotes, setExtraNotes] = useState(record.extraNotes);
  const [content, setContent] = useState<Invitation>(record.content);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const patch = (partial: Partial<Invitation>) =>
    setContent((current) => ({ ...current, ...partial }));

  const save = async () => {
    setSaving(true);
    setMessage("");
    const result = await saveInvitationAction({
      id: record.id,
      title,
      slug,
      published,
      chargedAmount: Number(chargedAmount) || 0,
      extraNotes,
      content: { ...content, slug },
    });
    setSaving(false);
    setMessage(result.ok ? "Saved." : result.error);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-serif text-xs tracking-[0.3em] text-[#c81e4a] uppercase">
            Edit page
          </p>
          <h1 className="hero-names mt-1 text-5xl">{title || "Invitation"}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/i/${slug}`}
            className="rounded-full px-5 py-3 font-serif text-sm tracking-[0.16em] text-[#c81e4a] uppercase ring-1 ring-[#f9a8d4]"
          >
            Open link
          </Link>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-full bg-[#c81e4a] px-5 py-3 font-serif text-sm tracking-[0.16em] text-white uppercase disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
      {message ? (
        <p className="rounded-2xl bg-[#fff1f2] px-4 py-3 font-serif text-[#c81e4a]">{message}</p>
      ) : null}

      <section className="rounded-[28px] border border-[#f9a8d4] bg-white p-6 sm:p-8">
        <h2 className="font-cinzel text-lg tracking-[0.16em] text-[#9d174d] uppercase">
          Client
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Internal title">
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Shareable slug">
            <input className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)} />
          </Field>
          <Field label="Amount charged (INR)">
            <input
              className={inputClass}
              type="number"
              min="0"
              value={chargedAmount}
              onChange={(e) => setChargedAmount(e.target.value)}
            />
          </Field>
          <Field label="Published">
            <select
              className={inputClass}
              value={published ? "yes" : "no"}
              onChange={(e) => setPublished(e.target.value === "yes")}
            >
              <option value="yes">Yes, guests can open it</option>
              <option value="no">Draft only</option>
            </select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Additional client information">
            <textarea
              className={inputClass}
              rows={4}
              value={extraNotes}
              onChange={(e) => setExtraNotes(e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#f9a8d4] bg-white p-6 sm:p-8">
        <h2 className="font-cinzel text-lg tracking-[0.16em] text-[#9d174d] uppercase">
          Envelope & scratch
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Envelope caption">
            <input
              className={inputClass}
              value={content.gateCaption}
              onChange={(e) => patch({ gateCaption: e.target.value })}
            />
          </Field>
          <Field label="Envelope hint">
            <input
              className={inputClass}
              value={content.gateHint}
              onChange={(e) => patch({ gateHint: e.target.value })}
            />
          </Field>
          <Field label="Wax initials">
            <input
              className={inputClass}
              value={content.initials}
              onChange={(e) => patch({ initials: e.target.value })}
            />
          </Field>
          <Field label="Scratch kicker">
            <input
              className={inputClass}
              value={content.scratchKicker}
              onChange={(e) => patch({ scratchKicker: e.target.value })}
            />
          </Field>
          <Field label="Scratch title">
            <input
              className={inputClass}
              value={content.scratchTitle}
              onChange={(e) => patch({ scratchTitle: e.target.value })}
            />
          </Field>
          <Field label="Scratch hint">
            <input
              className={inputClass}
              value={content.scratchHint}
              onChange={(e) => patch({ scratchHint: e.target.value })}
            />
          </Field>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ImageField
            label="Door image"
            value={content.doorImage}
            onChange={(doorImage) => patch({ doorImage })}
          />
          <ImageField
            label="Optional extra card image"
            value={content.heroImage}
            onChange={(heroImage) => patch({ heroImage })}
          />
        </div>
      </section>

      <section className="rounded-[28px] border border-[#f9a8d4] bg-white p-6 sm:p-8">
        <h2 className="font-cinzel text-lg tracking-[0.16em] text-[#9d174d] uppercase">
          Couple & copy
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Groom first name">
            <input
              className={inputClass}
              value={content.groom.firstName}
              onChange={(e) =>
                patch({ groom: { ...content.groom, firstName: e.target.value } })
              }
            />
          </Field>
          <Field label="Bride first name">
            <input
              className={inputClass}
              value={content.bride.firstName}
              onChange={(e) =>
                patch({ bride: { ...content.bride, firstName: e.target.value } })
              }
            />
          </Field>
          <Field label="Groom full name">
            <input
              className={inputClass}
              value={content.groom.fullName}
              onChange={(e) =>
                patch({ groom: { ...content.groom, fullName: e.target.value } })
              }
            />
          </Field>
          <Field label="Bride full name">
            <input
              className={inputClass}
              value={content.bride.fullName}
              onChange={(e) =>
                patch({ bride: { ...content.bride, fullName: e.target.value } })
              }
            />
          </Field>
          <Field label="Groom parents">
            <input
              className={inputClass}
              value={content.groom.parents}
              onChange={(e) =>
                patch({ groom: { ...content.groom, parents: e.target.value } })
              }
            />
          </Field>
          <Field label="Bride parents">
            <input
              className={inputClass}
              value={content.bride.parents}
              onChange={(e) =>
                patch({ bride: { ...content.bride, parents: e.target.value } })
              }
            />
          </Field>
        </div>
        <div className="mt-4 grid gap-4">
          <Field label="Greeting">
            <input
              className={inputClass}
              value={content.greeting}
              onChange={(e) => patch({ greeting: e.target.value })}
            />
          </Field>
          <Field label="Families line">
            <input
              className={inputClass}
              value={content.familiesLine}
              onChange={(e) => patch({ familiesLine: e.target.value })}
            />
          </Field>
          <Field label="Verse">
            <textarea
              className={inputClass}
              rows={3}
              value={content.verse}
              onChange={(e) => patch({ verse: e.target.value })}
            />
          </Field>
          <Field label="Blessing">
            <textarea
              className={inputClass}
              rows={2}
              value={content.blessing}
              onChange={(e) => patch({ blessing: e.target.value })}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#f9a8d4] bg-white p-6 sm:p-8">
        <h2 className="font-cinzel text-lg tracking-[0.16em] text-[#9d174d] uppercase">
          Wedding date
        </h2>
        <p className="mt-2 font-serif text-sm text-[#6b2040]">
          This date is revealed inside the heart scratch card.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["weekday", "Weekday"],
              ["day", "Day"],
              ["month", "Month"],
              ["year", "Year"],
              ["displayDate", "Display date"],
              ["displayTime", "Display time"],
              ["venue", "Venue name"],
              ["city", "City"],
              ["iso", "Countdown ISO datetime"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              <input
                className={inputClass}
                value={content.wedding[key]}
                onChange={(e) =>
                  patch({ wedding: { ...content.wedding, [key]: e.target.value } })
                }
              />
            </Field>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#f9a8d4] bg-white p-6 sm:p-8">
        <h2 className="font-cinzel text-lg tracking-[0.16em] text-[#9d174d] uppercase">
          Couple gallery
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {content.coupleImages.map((image, index) => (
            <div key={index} className="space-y-3">
              <ImageField
                label={`Photo ${index + 1}`}
                value={image.src}
                onChange={(src) => {
                  const coupleImages = content.coupleImages.map((item, i) =>
                    i === index ? { ...item, src } : item,
                  );
                  patch({ coupleImages });
                }}
              />
              <input
                className={inputClass}
                value={image.caption}
                placeholder="Caption"
                onChange={(e) => {
                  const coupleImages = content.coupleImages.map((item, i) =>
                    i === index ? { ...item, caption: e.target.value } : item,
                  );
                  patch({ coupleImages });
                }}
              />
              <input
                className={inputClass}
                value={image.alt}
                placeholder="Alt text"
                onChange={(e) => {
                  const coupleImages = content.coupleImages.map((item, i) =>
                    i === index ? { ...item, alt: e.target.value } : item,
                  );
                  patch({ coupleImages });
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#f9a8d4] bg-white p-6 sm:p-8">
        <h2 className="font-cinzel text-lg tracking-[0.16em] text-[#9d174d] uppercase">
          Ceremonies
        </h2>
        <div className="mt-5 space-y-8">
          {content.ceremonies.map((ceremony, index) => (
            <div key={ceremony.id} className="rounded-2xl border border-[#fde4ea] p-4">
              <p className="font-cinzel text-[#c81e4a] uppercase">{ceremony.id}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["kicker", "Kicker"],
                    ["title", "Title"],
                    ["date", "Date"],
                    ["time", "Time"],
                    ["venue", "Venue"],
                  ] as const
                ).map(([key, label]) => (
                  <Field key={key} label={label}>
                    <input
                      className={inputClass}
                      value={ceremony[key]}
                      onChange={(e) => {
                        const ceremonies = content.ceremonies.map((item, i) =>
                          i === index ? { ...item, [key]: e.target.value } : item,
                        );
                        patch({ ceremonies });
                      }}
                    />
                  </Field>
                ))}
              </div>
              <div className="mt-4">
                <Field label="Poem">
                  <textarea
                    className={inputClass}
                    rows={3}
                    value={ceremony.poem}
                    onChange={(e) => {
                      const ceremonies = content.ceremonies.map((item, i) =>
                        i === index ? { ...item, poem: e.target.value } : item,
                      );
                      patch({ ceremonies });
                    }}
                  />
                </Field>
              </div>
              <div className="mt-4">
                <ImageField
                  label="Ceremony image"
                  value={ceremony.image}
                  onChange={(image) => {
                    const ceremonies = content.ceremonies.map((item, i) =>
                      i === index ? { ...item, image } : item,
                    );
                    patch({ ceremonies });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#f9a8d4] bg-white p-6 sm:p-8">
        <h2 className="font-cinzel text-lg tracking-[0.16em] text-[#9d174d] uppercase">
          Rituals
        </h2>
        <div className="mt-5 space-y-4">
          {content.rituals.map((ritual, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-3">
              <input
                className={inputClass}
                value={ritual.name}
                onChange={(e) => {
                  const rituals = content.rituals.map((item, i) =>
                    i === index ? { ...item, name: e.target.value } : item,
                  );
                  patch({ rituals });
                }}
              />
              <input
                className={inputClass}
                value={ritual.time}
                onChange={(e) => {
                  const rituals = content.rituals.map((item, i) =>
                    i === index ? { ...item, time: e.target.value } : item,
                  );
                  patch({ rituals });
                }}
              />
              <input
                className={inputClass}
                value={ritual.note}
                onChange={(e) => {
                  const rituals = content.rituals.map((item, i) =>
                    i === index ? { ...item, note: e.target.value } : item,
                  );
                  patch({ rituals });
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#f9a8d4] bg-white p-6 sm:p-8">
        <h2 className="font-cinzel text-lg tracking-[0.16em] text-[#9d174d] uppercase">
          Venue map
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Map search query">
            <input
              className={inputClass}
              value={content.map.query}
              onChange={(e) => patch({ map: { ...content.map, query: e.target.value } })}
            />
          </Field>
          <Field label="Map label">
            <input
              className={inputClass}
              value={content.map.label}
              onChange={(e) => patch({ map: { ...content.map, label: e.target.value } })}
            />
          </Field>
          <Field label="Address">
            <input
              className={inputClass}
              value={content.map.address}
              onChange={(e) => patch({ map: { ...content.map, address: e.target.value } })}
            />
          </Field>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-[#c81e4a] px-6 py-3 font-serif text-sm tracking-[0.16em] text-white uppercase disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
