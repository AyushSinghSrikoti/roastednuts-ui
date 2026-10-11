"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Database, LockKeyhole, Settings2, SlidersHorizontal } from "lucide-react";
import * as yup from "yup";

import { ThemedSelect } from "@/components/ui/select";
import type { SelectOption } from "@/components/ui/select";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { InlineLoader } from "@/components/ui/inline-loader";
import { BoundedNumberInput } from "@/components/ui/bounded-number-input";
import { createProject, listProjectPlatforms, updateProject } from "@/services/projects";
import { useBackgroundActions } from "@/components/background-actions/BackgroundActionProvider";
import { announceProjectsChanged } from "@/constants/project-events";
import type { ProjectConfigurationInput } from "@/types/project";

interface ProjectConfigurationPageProps {
  initialProjectName: string;
  projectId?: string;
  initialConfiguration?: ProjectConfigurationInput & { environmentLabel: string | null };
  initialPlatformOptions?: SelectOption[];
}

const fieldClass = "h-10 w-full rounded-xl border border-[#d9ccbe] bg-white px-3.5 text-sm text-[#34251d] outline-none transition placeholder:text-[#b09f93] focus:border-[#9b7258] focus:ring-3 focus:ring-[#b88a6b]/15";

function RequiredMark() {
  return <span className="ml-0.5 text-[#b84f42]" aria-hidden="true">*</span>;
}

const fallbackPlatform: SelectOption = { label: "Other", value: "other", iconUrl: null };
const environmentSuggestions = ["Production", "Staging", "Development", "Testing", "Preview"];

const storageOptions = [
  { label: "1 GB", value: "1" },
  { label: "5 GB", value: "5" },
  { label: "10 GB", value: "10" },
  { label: "25 GB", value: "25" },
];

const retentionOptions = [
  { label: "1 day", value: "1" },
  { label: "3 days", value: "3" },
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
];

const eventSizeOptions = [
  { label: "16 KB", value: "16" },
  { label: "32 KB", value: "32" },
  { label: "64 KB", value: "64" },
  { label: "128 KB", value: "128" },
];

const projectConfigurationSchema = yup.object({
  projectName: yup.string().trim().min(3, "Project name must be at least 3 characters.").max(64, "Project name cannot exceed 64 characters.").required("Project name is required."),
  platform: yup.string().required("Select a platform."),
  maximumStorageGb: yup.string().required("Select a storage limit."),
  retentionDays: yup.string().required("Select a retention period."),
  eventsPerMinute: yup.number().typeError("Enter a valid number.").integer("Enter a whole number.").min(1, "Minimum is 1.").max(1000, "Maximum is 1,000.").required("This field is required."),
  errorEventsPerMinute: yup.number().typeError("Enter a valid number.").integer("Enter a whole number.").min(1, "Minimum is 1.").max(250, "Maximum is 250.").required("This field is required."),
  maximumEventSizeKb: yup.string().required("Select a maximum event size."),
  eventsPerBatch: yup.number().typeError("Enter a valid number.").integer("Enter a whole number.").min(1, "Minimum is 1.").max(100, "Maximum is 100.").required("This field is required."),
});

type ConfigurationField = keyof yup.InferType<typeof projectConfigurationSchema>;
type ConfigurationErrors = Partial<Record<ConfigurationField, string>>;

function FieldError({ message }: { message?: string }) {
  return message ? <span className="mt-1.5 block text-[10px] text-[#b84f42]">{message}</span> : null;
}

function SettingToggle({ name, title, description, defaultChecked = false }: { name: string; title: string; description: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-[#e4d9ce] bg-white p-4">
      <span>
        <span className="block text-xs font-semibold text-[#49362b]">{title}</span>
        <span className="mt-1 block text-[11px] leading-4 text-[#917d70]">{description}</span>
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input name={name} type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-5 w-9 rounded-full bg-[#d9cec3] transition peer-checked:bg-[#75452e] peer-focus-visible:ring-3 peer-focus-visible:ring-[#b88a6b]/25" />
        <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-4" />
      </span>
    </label>
  );
}

export default function ProjectConfigurationPage({ initialProjectName, projectId, initialConfiguration, initialPlatformOptions }: ProjectConfigurationPageProps) {
  const router = useRouter();
  const { runBackgroundAction } = useBackgroundActions();
  const [projectName, setProjectName] = useState(initialProjectName);
  const [platformOptions, setPlatformOptions] = useState<SelectOption[]>(initialPlatformOptions ?? [fallbackPlatform]);
  const [platformsLoading, setPlatformsLoading] = useState(!initialPlatformOptions);
  const [errors, setErrors] = useState<ConfigurationErrors>({});
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialPlatformOptions) return;
    let active = true;

    listProjectPlatforms()
      .then((response) => {
        if (!active) return;

        const options = response.data.data.map((platform) => ({
          label: platform.name,
          value: platform.slug,
          iconUrl: platform.iconUrl,
        }));

        setPlatformOptions(options.some((option) => option.value === "other") ? options : [...options, fallbackPlatform]);
      })
      .catch(() => {
        if (active) setPlatformOptions([fallbackPlatform]);
      })
      .finally(() => {
        if (active) setPlatformsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [initialPlatformOptions]);

  const reviewConfiguration = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      const validated = await projectConfigurationSchema.validate(values, { abortEarly: false });
      setErrors({});
      setSubmissionError("");
      const name = validated.projectName;
      const configuration: ProjectConfigurationInput = {
        platform: validated.platform,
        environmentLabel: typeof values.environmentLabel === "string" && values.environmentLabel.trim() ? values.environmentLabel.trim() : undefined,
        maximumStorageGb: Number(validated.maximumStorageGb),
        retentionDays: Number(validated.retentionDays),
        archiveExpiredLogs: values.archiveExpiredLogs === "on",
        warnNearStorageLimit: values.warnNearStorageLimit === "on",
        eventsPerMinute: validated.eventsPerMinute,
        errorEventsPerMinute: validated.errorEventsPerMinute,
        maximumEventSizeKb: Number(validated.maximumEventSizeKb),
        eventsPerBatch: validated.eventsPerBatch,
        redactAuthorization: values.redactAuthorization === "on",
        redactCookies: values.redactCookies === "on",
        redactIpAddresses: values.redactIpAddresses === "on",
        storeStackTraces: values.storeStackTraces === "on",
      };
      void runBackgroundAction({
        title: `${projectId ? "Updating" : "Creating"} ${name}`,
        runningMessage: projectId ? "Saving the project settings…" : "Creating the project and applying its settings…",
        successMessage: `${name} was ${projectId ? "updated" : "created"} successfully.`,
        errorMessage: `We could not ${projectId ? "update" : "create"} ${name}. Please try again.`,
        task: () => projectId
          ? updateProject(projectId, { name, configuration })
          : createProject({ name, launchMode: "configured", configuration }),
        onSuccess: announceProjectsChanged,
      });
      router.push("/logs/projects");
    } catch (error: unknown) {
      if (!(error instanceof yup.ValidationError)) {
        setSubmissionError("We could not create the project. Please try again.");
        return;
      }

      const nextErrors: ConfigurationErrors = {};
      error.inner.forEach((validationError) => {
        const field = validationError.path as ConfigurationField | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = validationError.message;
      });
      setErrors(nextErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateField = (field: ConfigurationField, value: string) => {
    try {
      projectConfigurationSchema.validateSyncAt(field, { [field]: value });
      setErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors[field];
        return nextErrors;
      });
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        setErrors((current) => ({ ...current, [field]: error.message }));
      }
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <form noValidate onSubmit={reviewConfiguration} className="grid items-start gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-[#e0d5c8] bg-[#fffdf9] p-2 lg:sticky lg:top-24">
          {[
            { label: "General", icon: Settings2, active: true },
            { label: "Storage & retention", icon: Database },
            { label: "Ingestion limits", icon: SlidersHorizontal },
            { label: "Privacy", icon: LockKeyhole },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <a key={item.label} href={`#section-${index + 1}`} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs transition ${item.active ? "bg-[#f2e5d7] font-semibold text-[#5f3c28]" : "text-[#806c5f] hover:bg-[#f8f2eb]"}`}>
                <Icon className="size-3.5" />
                {item.label}
              </a>
            );
          })}
        </aside>

        <div className="rounded-2xl border border-[#e0d5c8] bg-[#fffdf9] p-4 sm:p-6 lg:p-7">
          <h1 className="mb-7 text-2xl font-semibold tracking-[-0.035em] text-[#2c2018] sm:text-3xl">{projectId ? "Edit project" : "Configure your project"}</h1>

          <div className="space-y-5">
          <section id="section-1" className="scroll-mt-24 rounded-2xl border border-[#e0d5c8] bg-[#fffdf9]">
            <div className="border-b border-[#ece3d9] px-5 py-4 sm:px-6">
              <h2 className="text-sm font-semibold text-[#392a21]">General</h2>
              <p className="mt-1 text-[11px] text-[#927f72]">Basic identity and deployment context.</p>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <label className="sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold text-[#49362b]">Project name<RequiredMark /></span>
                <input name="projectName" value={projectName} onChange={(event) => { setProjectName(event.target.value); validateField("projectName", event.target.value); }} placeholder="e.g. Checkout API" minLength={3} maxLength={64} aria-invalid={Boolean(errors.projectName)} className={`${fieldClass} ${errors.projectName ? "border-[#b84f42]" : ""}`} />
                <FieldError message={errors.projectName} />
              </label>
              <label>
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#49362b]">
                  <span>Platform<RequiredMark /></span>
                  <InlineLoader loading={platformsLoading} label="Loading platforms" />
                </span>
                <ThemedSelect name="platform" options={platformOptions} defaultValue={initialConfiguration?.platform} placeholder="Select" disabled={platformsLoading} invalid={Boolean(errors.platform)} onValueChange={(value) => validateField("platform", value ?? "")} />
                <FieldError message={errors.platform} />
              </label>
              <label>
                <span className="mb-2 block text-xs font-semibold text-[#49362b]">Project environment label</span>
                <CreatableCombobox name="environmentLabel" options={environmentSuggestions} defaultValue={initialConfiguration?.environmentLabel ?? ""} placeholder="Select or type your own" />
              </label>
            </div>
          </section>

          <section id="section-2" className="scroll-mt-24 rounded-2xl border border-[#e0d5c8] bg-[#fffdf9]">
            <div className="border-b border-[#ece3d9] px-5 py-4 sm:px-6">
              <h2 className="text-sm font-semibold text-[#392a21]">Storage & retention</h2>
              <p className="mt-1 text-[11px] text-[#927f72]">Control how much data is stored and for how long.</p>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <label><span className="mb-2 block text-xs font-semibold text-[#49362b]">Maximum storage<RequiredMark /></span><ThemedSelect name="maximumStorageGb" options={storageOptions} defaultValue={initialConfiguration ? String(initialConfiguration.maximumStorageGb) : undefined} placeholder="Select" invalid={Boolean(errors.maximumStorageGb)} onValueChange={(value) => validateField("maximumStorageGb", value ?? "")} /><FieldError message={errors.maximumStorageGb} /></label>
              <label><span className="mb-2 block text-xs font-semibold text-[#49362b]">Log retention<RequiredMark /></span><ThemedSelect name="retentionDays" options={retentionOptions} defaultValue={initialConfiguration ? String(initialConfiguration.retentionDays) : undefined} placeholder="Select" invalid={Boolean(errors.retentionDays)} onValueChange={(value) => validateField("retentionDays", value ?? "")} /><FieldError message={errors.retentionDays} /></label>
              <SettingToggle name="archiveExpiredLogs" title="Archive expired logs" description="Move expired segments to archive storage instead of deleting them." defaultChecked={initialConfiguration?.archiveExpiredLogs} />
              <SettingToggle name="warnNearStorageLimit" title="Storage warning" description="Notify project administrators when storage reaches 80%." defaultChecked={initialConfiguration?.warnNearStorageLimit ?? true} />
            </div>
          </section>

          <section id="section-3" className="scroll-mt-24 rounded-2xl border border-[#e0d5c8] bg-[#fffdf9]">
            <div className="border-b border-[#ece3d9] px-5 py-4 sm:px-6">
              <h2 className="text-sm font-semibold text-[#392a21]">Ingestion limits</h2>
              <p className="mt-1 text-[11px] text-[#927f72]">Protect the project from unexpected traffic and oversized payloads.</p>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <label><span className="mb-2 block text-xs font-semibold text-[#49362b]">Events per minute<RequiredMark /></span><BoundedNumberInput name="eventsPerMinute" min={1} max={1000} defaultValue={initialConfiguration?.eventsPerMinute} placeholder="Maximum 1,000" invalid={Boolean(errors.eventsPerMinute)} onValueChange={(value) => validateField("eventsPerMinute", value)} /><FieldError message={errors.eventsPerMinute} /></label>
              <label><span className="mb-2 block text-xs font-semibold text-[#49362b]">Error events per minute<RequiredMark /></span><BoundedNumberInput name="errorEventsPerMinute" min={1} max={250} defaultValue={initialConfiguration?.errorEventsPerMinute} placeholder="Maximum 250" invalid={Boolean(errors.errorEventsPerMinute)} onValueChange={(value) => validateField("errorEventsPerMinute", value)} /><FieldError message={errors.errorEventsPerMinute} /></label>
              <label><span className="mb-2 block text-xs font-semibold text-[#49362b]">Maximum event size<RequiredMark /></span><ThemedSelect name="maximumEventSizeKb" options={eventSizeOptions} defaultValue={initialConfiguration ? String(initialConfiguration.maximumEventSizeKb) : undefined} placeholder="Select" invalid={Boolean(errors.maximumEventSizeKb)} onValueChange={(value) => validateField("maximumEventSizeKb", value ?? "")} /><FieldError message={errors.maximumEventSizeKb} /></label>
              <label><span className="mb-2 block text-xs font-semibold text-[#49362b]">Events per batch<RequiredMark /></span><BoundedNumberInput name="eventsPerBatch" min={1} max={100} defaultValue={initialConfiguration?.eventsPerBatch} placeholder="Maximum 100" invalid={Boolean(errors.eventsPerBatch)} onValueChange={(value) => validateField("eventsPerBatch", value)} /><FieldError message={errors.eventsPerBatch} /></label>
            </div>
          </section>

          <section id="section-4" className="scroll-mt-24 rounded-2xl border border-[#e0d5c8] bg-[#fffdf9]">
            <div className="border-b border-[#ece3d9] px-5 py-4 sm:px-6">
              <h2 className="text-sm font-semibold text-[#392a21]">Privacy</h2>
              <p className="mt-1 text-[11px] text-[#927f72]">Choose what is removed before events reach storage.</p>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
              <SettingToggle name="redactAuthorization" title="Redact authorization data" description="Remove authorization headers and credentials." defaultChecked={initialConfiguration?.redactAuthorization ?? true} />
              <SettingToggle name="redactCookies" title="Redact cookies" description="Remove cookie values from incoming events." defaultChecked={initialConfiguration?.redactCookies ?? true} />
              <SettingToggle name="redactIpAddresses" title="Redact IP addresses" description="Remove client IP addresses before storage." defaultChecked={initialConfiguration?.redactIpAddresses} />
              <SettingToggle name="storeStackTraces" title="Store stack traces" description="Keep exception stack traces for debugging." defaultChecked={initialConfiguration?.storeStackTraces ?? true} />
            </div>
          </section>

          <div className="flex items-center justify-between gap-3 pt-1">
            <Link href={projectId ? "/logs/projects" : "/dashboard"} className="rounded-xl border border-[#d9ccbe] bg-white px-4 py-2.5 text-xs font-semibold text-[#745e50] transition hover:border-[#c6b19f] hover:bg-[#f3ece4]">Cancel</Link>
            <div className="flex flex-col items-end gap-2">
              {submissionError ? <p role="alert" className="text-xs text-[#b84f42]">{submissionError}</p> : null}
              <button type="submit" disabled={isSubmitting} className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#75452e] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#603722] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? (projectId ? "Saving changes..." : "Creating project...") : (projectId ? "Save changes" : "Launch project")} <ArrowRight className="size-3.5" /></button>
            </div>
          </div>
        </div>
        </div>
      </form>
    </div>
  );
}
