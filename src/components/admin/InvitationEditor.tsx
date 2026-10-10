"use client";

import { useState } from "react";
import Link from "next/link";
import { saveInvitationAction } from "@/lib/actions";
import type { Ceremony, CeremonyTheme, Invitation } from "@/lib/invitation";
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

function VideoField({
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
        <video
          src={value}
          className="mt-3 h-40 w-full rounded-xl bg-black object-cover"
          muted
          playsInline
          controls
        />
      ) : (
        <p className="mt-3 font-serif text-sm text-[#9d174d]/70">
          No video yet. Guests will go straight to the invitation.
        </p>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Video URL or upload below"
        className={`${inputClass} mt-3`}
      />
      <div className="mt-3 flex flex-wrap gap-3">
        <label className="inline-block cursor-pointer rounded-full bg-white px-4 py-2 font-serif text-xs tracking-[0.16em] text-[#c81e4a] uppercase ring-1 ring-[#f9a8d4]">
          {busy ? "Uploading…" : "Upload video"}
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
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
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-full bg-white px-4 py-2 font-serif text-xs tracking-[0.16em] text-[#9d174d] uppercase ring-1 ring-[#f9a8d4]"
          >
            Remove video
          </button>
        ) : null}
      </div>
    </div>
  );
}

function AudioField({
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
        <audio src={value} className="mt-3 w-full" controls />
      ) : (
        <p className="mt-3 font-serif text-sm text-[#9d174d]/70">
          No music yet. The invitation will stay silent.
        </p>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Audio URL or upload below"
        className={`${inputClass} mt-3`}
      />
      <div className="mt-3 flex flex-wrap gap-3">
        <label className="inline-block cursor-pointer rounded-full bg-white px-4 py-2 font-serif text-xs tracking-[0.16em] text-[#c81e4a] uppercase ring-1 ring-[#f9a8d4]">
          {busy ? "Uploading…" : "Upload audio"}
          <input
            type="file"
            accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac"
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
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-full bg-white px-4 py-2 font-serif text-xs tracking-[0.16em] text-[#9d174d] uppercase ring-1 ring-[#f9a8d4]"
          >
            Remove audio
          </button>
        ) : null}
      </div>
    </div>
  );
}

const EVENT_THEMES: { value: CeremonyTheme; label: string }[] = [
  { value: "haldi", label: "Haldi — gold" },
  { value: "mehendi", label: "Mehendi — green" },
  { value: "sangeet", label: "Sangeet — purple" },
  { value: "wedding", label: "Wedding — rose" },
  { value: "reception", label: "Reception — navy gold" },
];

function blankEvent(): Ceremony {
  return {
    id: `event-${crypto.randomUUID()}`,
    kicker: "",
    title: "New event",
    poem: "",
    date: "",
    time: "",
    venue: "",
    image: "",
    theme: "wedding",
    showContent: true,
  };
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
          Entry video
        </h2>
        <p className="mt-2 font-serif text-sm text-[#6b2040]">
          Guests see the couple names on a white screen while the video loads.
          They tap the video to play it. When it finishes, the invitation fades in.
        </p>
        <div className="mt-5">
          <VideoField
            label="Opening video"
            value={content.introVideo}
            onChange={(introVideo) => patch({ introVideo })}
          />
        </div>
        <div className="mt-5">
          <AudioField
            label="Invitation music"
            value={content.backgroundAudio ?? ""}
            onChange={(backgroundAudio) => patch({ backgroundAudio })}
          />
          <p className="mt-2 font-serif text-sm text-[#6b2040]">
            Plays when the main invitation opens. Guests can mute it with a
            small button.
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Tap-screen caption">
            <input
              className={inputClass}
              value={content.gateCaption}
              onChange={(e) => patch({ gateCaption: e.target.value })}
            />
          </Field>
          <Field label="Tap-screen hint">
            <input
              className={inputClass}
              value={content.gateHint}
              onChange={(e) => patch({ gateHint: e.target.value })}
            />
          </Field>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Date card initials">
            <input
              className={inputClass}
              value={content.initials}
              onChange={(e) => patch({ initials: e.target.value })}
            />
          </Field>
          <Field label="Date card kicker">
            <input
              className={inputClass}
              value={content.scratchKicker}
              onChange={(e) => patch({ scratchKicker: e.target.value })}
            />
          </Field>
          <Field label="Date card title">
            <input
              className={inputClass}
              value={content.scratchTitle}
              onChange={(e) => patch({ scratchTitle: e.target.value })}
            />
          </Field>
          <Field label="Date card hint">
            <input
              className={inputClass}
              value={content.scratchHint}
              onChange={(e) => patch({ scratchHint: e.target.value })}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#f9a8d4] bg-white p-6 sm:p-8">
        <h2 className="font-cinzel text-lg tracking-[0.16em] text-[#9d174d] uppercase">
          Couple & copy
        </h2>
        <p className="mt-2 font-serif text-sm text-[#6b2040]">
          The “You are invited” block can stay as text, or be replaced by one
          custom image.
        </p>
        <div className="mt-5 max-w-md">
          <Field label="You are invited section">
            <select
              className={inputClass}
              value={content.showCoupleIntro === false ? "image" : "text"}
              onChange={(e) =>
                patch({ showCoupleIntro: e.target.value === "text" })
              }
            >
              <option value="text">Show text content</option>
              <option value="image">Custom image only</option>
            </select>
          </Field>
        </div>
        {content.showCoupleIntro === false ? (
          <div className="mt-5">
            <ImageField
              label="You are invited image"
              value={content.coupleIntroImage ?? ""}
              onChange={(coupleIntroImage) => patch({ coupleIntroImage })}
            />
          </div>
        ) : null}
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
          The scratch card reveals the wedding date and countdown. Time and
          venue stay in these fields for the rest of the invitation.
        </p>
        <div className="mt-5 max-w-md">
          <Field label="Scratch section look">
            <select
              className={inputClass}
              value={content.scratchUseTheme ? "theme" : "text"}
              onChange={(e) =>
                patch({ scratchUseTheme: e.target.value === "theme" })
              }
            >
              <option value="text">Text only — default blush theme</option>
              <option value="theme">Custom background image</option>
            </select>
          </Field>
        </div>
        {content.scratchUseTheme ? (
          <div className="mt-5">
            <ImageField
              label="Scratch section background"
              value={content.scratchBackground ?? ""}
              onChange={(scratchBackground) => patch({ scratchBackground })}
            />
          </div>
        ) : null}
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
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-cinzel text-lg tracking-[0.16em] text-[#9d174d] uppercase">
              Couple gallery
            </h2>
            <p className="mt-2 font-serif text-sm text-[#6b2040]">
              Hide the photo grid on the invitation, or add and remove pictures.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              patch({
                coupleImages: [
                  ...(content.coupleImages ?? []),
                  { src: "", alt: "", caption: "" },
                ],
              })
            }
            className="rounded-full bg-[#c81e4a] px-4 py-2 font-serif text-xs tracking-[0.16em] text-white uppercase"
          >
            Add photo
          </button>
        </div>
        <div className="mt-5 max-w-md">
          <Field label="Show image gallery">
            <select
              className={inputClass}
              value={content.showGallery === false ? "no" : "yes"}
              onChange={(e) => patch({ showGallery: e.target.value === "yes" })}
            >
              <option value="yes">Yes, show photos</option>
              <option value="no">No, hide the gallery</option>
            </select>
          </Field>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {(content.coupleImages ?? []).length === 0 ? (
            <p className="font-serif text-sm text-[#6b2040] sm:col-span-2">
              No photos yet. Add one to include it on the invitation.
            </p>
          ) : null}
          {(content.coupleImages ?? []).map((image, index) => (
            <div key={index} className="space-y-3 rounded-2xl border border-[#fde4ea] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-cinzel text-sm text-[#c81e4a] uppercase">
                  Photo {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    patch({
                      coupleImages: content.coupleImages.filter((_, i) => i !== index),
                    })
                  }
                  className="rounded-full px-3 py-1.5 font-serif text-xs tracking-[0.16em] text-[#9d174d] uppercase ring-1 ring-[#f9a8d4]"
                >
                  Remove
                </button>
              </div>
              <ImageField
                label="Image"
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
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-cinzel text-lg tracking-[0.16em] text-[#9d174d] uppercase">
              Events
            </h2>
            <p className="mt-2 font-serif text-sm text-[#6b2040]">
              Add only the events this invitation needs — two, four, or more.
            </p>
          </div>
          <button
            type="button"
            onClick={() => patch({ ceremonies: [...content.ceremonies, blankEvent()] })}
            className="rounded-full bg-[#c81e4a] px-4 py-2 font-serif text-xs tracking-[0.16em] text-white uppercase"
          >
            Add event
          </button>
        </div>
        <div className="mt-5 space-y-8">
          {content.ceremonies.length === 0 ? (
            <p className="rounded-2xl bg-[#fff7f8] px-4 py-6 text-center font-serif text-[#6b2040]">
              No events yet. Add the first one for this invitation.
            </p>
          ) : null}
          {content.ceremonies.map((ceremony, index) => (
            <div key={ceremony.id} className="rounded-2xl border border-[#fde4ea] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-cinzel text-[#c81e4a] uppercase">
                  Event {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    patch({
                      ceremonies: content.ceremonies.filter((_, i) => i !== index),
                    })
                  }
                  className="rounded-full px-4 py-2 font-serif text-xs tracking-[0.16em] text-[#9d174d] uppercase ring-1 ring-[#f9a8d4]"
                >
                  Remove
                </button>
              </div>
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
                <Field label="Card colour">
                  <select
                    className={inputClass}
                    value={ceremony.theme}
                    onChange={(e) => {
                      const theme = e.target.value as CeremonyTheme;
                      const ceremonies = content.ceremonies.map((item, i) =>
                        i === index ? { ...item, theme } : item,
                      );
                      patch({ ceremonies });
                    }}
                  >
                    {EVENT_THEMES.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Text box on image">
                  <select
                    className={inputClass}
                    value={ceremony.showContent === false ? "no" : "yes"}
                    onChange={(e) => {
                      const showContent = e.target.value === "yes";
                      const ceremonies = content.ceremonies.map((item, i) =>
                        i === index ? { ...item, showContent } : item,
                      );
                      patch({ ceremonies });
                    }}
                  >
                    <option value="yes">Show title and details</option>
                    <option value="no">Image only — hide the box</option>
                  </select>
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Details">
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
                  label="Event image"
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
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-cinzel text-lg tracking-[0.16em] text-[#9d174d] uppercase">
            Rituals
          </h2>
          <button
            type="button"
            onClick={() =>
              patch({
                rituals: [...content.rituals, { name: "", time: "", note: "" }],
              })
            }
            className="rounded-full bg-[#c81e4a] px-4 py-2 font-serif text-xs tracking-[0.16em] text-white uppercase"
          >
            Add ritual
          </button>
        </div>
        <div className="mt-5 space-y-4">
          {content.rituals.map((ritual, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_2fr_auto]">
              <input
                className={inputClass}
                value={ritual.name}
                placeholder="Name"
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
                placeholder="Time"
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
                placeholder="Note"
                onChange={(e) => {
                  const rituals = content.rituals.map((item, i) =>
                    i === index ? { ...item, note: e.target.value } : item,
                  );
                  patch({ rituals });
                }}
              />
              <button
                type="button"
                onClick={() =>
                  patch({ rituals: content.rituals.filter((_, i) => i !== index) })
                }
                className="rounded-full px-4 py-3 font-serif text-xs tracking-[0.16em] text-[#9d174d] uppercase ring-1 ring-[#f9a8d4]"
              >
                Remove
              </button>
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

      <section className="rounded-[28px] border border-[#f9a8d4] bg-white p-6 sm:p-8">
        <h2 className="font-cinzel text-lg tracking-[0.16em] text-[#9d174d] uppercase">
          Branding bar
        </h2>
        <p className="mt-2 font-serif text-sm text-[#6b2040]">
          A slim bar at the bottom of the invitation with your brand name and
          contact. Hide it for private clients if needed.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Show branding bar">
            <select
              className={inputClass}
              value={content.showBranding === false ? "no" : "yes"}
              onChange={(e) => patch({ showBranding: e.target.value === "yes" })}
            >
              <option value="yes">Yes, show it</option>
              <option value="no">No, hide it</option>
            </select>
          </Field>
          <Field label="Brand name">
            <input
              className={inputClass}
              value={content.brandingText ?? ""}
              onChange={(e) => patch({ brandingText: e.target.value })}
            />
          </Field>
          <Field label="Contact number">
            <input
              className={inputClass}
              value={content.contactNumber ?? ""}
              onChange={(e) => patch({ contactNumber: e.target.value })}
              placeholder="+91 98765 43210"
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
