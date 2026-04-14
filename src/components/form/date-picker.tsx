import { useEffect, useMemo } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import { parseLocalYmd } from "../../utils/dateLocal";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

const DATE_PICKER_INPUT_CLASS =
  "h-11 w-full rounded-lg border appearance-none px-4 pr-10 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800 disabled:cursor-not-allowed disabled:opacity-60";

function normalizeDateOpt(
  value: DateOption | string | Date | undefined
): DateOption | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value === "string") {
    const s = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return parseLocalYmd(s);
    }
    if (s.includes("T")) {
      const ymd = s.split("T")[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
        return parseLocalYmd(ymd);
      }
    }
    return value;
  }
  if (value instanceof Date) {
    return new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate()
    );
  }
  return value;
}

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  maxDate?: string | Date;
  minDate?: string | Date;
  disabled?: boolean;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  maxDate,
  minDate,
  disabled,
}: PropsType) {
  const resolvedDefaultDate = useMemo(
    () => normalizeDateOpt(defaultDate),
    [defaultDate]
  );
  const resolvedMaxDate = useMemo(
    () => normalizeDateOpt(maxDate),
    [maxDate]
  );
  const resolvedMinDate = useMemo(
    () => normalizeDateOpt(minDate),
    [minDate]
  );

  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      locale: Spanish,
      monthSelectorType: "dropdown",
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "d/m/Y",
      altInputClass: DATE_PICKER_INPUT_CLASS,
      defaultDate: resolvedDefaultDate,
      onChange,
      maxDate: resolvedMaxDate,
      minDate: resolvedMinDate,
      clickOpens: !disabled,
      disableMobile: true,
      parseDate: (datestr, _format) => {
        if (datestr === undefined || datestr === null) {
          return new Date(NaN);
        }
        const raw = String(datestr).trim();
        if (raw === "") {
          return new Date(NaN);
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
          return parseLocalYmd(raw);
        }
        if (raw.includes("T")) {
          const ymd = raw.split("T")[0];
          if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
            return parseLocalYmd(ymd);
          }
        }
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
          const [da, mo, ye] = raw.split("/").map(Number);
          return new Date(ye, mo - 1, da);
        }
        const fallback = new Date(raw);
        if (Number.isNaN(fallback.getTime())) {
          return new Date(NaN);
        }
        return new Date(
          fallback.getFullYear(),
          fallback.getMonth(),
          fallback.getDate()
        );
      },
      formatDate: (date, format) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const da = String(date.getDate()).padStart(2, "0");
        if (format === "Y-m-d") {
          return `${y}-${m}-${da}`;
        }
        if (format === "d/m/Y") {
          return `${da}/${m}/${y}`;
        }
        return `${y}-${m}-${da}`;
      },
      onReady: (_dates, _dateStr, instance) => {
        if (instance.altInput) {
          if (placeholder) {
            instance.altInput.placeholder = placeholder;
          }
          instance.altInput.disabled = Boolean(disabled);
        }
      },
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [
    mode,
    onChange,
    id,
    resolvedDefaultDate,
    resolvedMaxDate,
    resolvedMinDate,
    disabled,
    placeholder,
  ]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          disabled={disabled}
          className={DATE_PICKER_INPUT_CLASS}
          readOnly
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
