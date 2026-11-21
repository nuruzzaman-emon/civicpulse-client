"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";

const passwordRules = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "One number", test: (v) => /\d/.test(v) },
  { label: "One special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const strengthMeta = [
  { label: "Too weak", bar: "bg-red-500", text: "text-red-600" },
  { label: "Weak", bar: "bg-red-500", text: "text-red-600" },
  { label: "Fair", bar: "bg-amber-500", text: "text-amber-600" },
  { label: "Good", bar: "bg-lime-500", text: "text-lime-600" },
  { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-600" },
  { label: "Excellent", bar: "bg-emerald-600", text: "text-emerald-600" },
];

const inputBase =
  "block w-full min-w-0 rounded-lg border bg-white py-2.5 pl-10 pr-3 text-base text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:ring-2 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 sm:text-sm";
const inputOk =
  "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/30 dark:border-slate-700";
const inputErr =
  "border-red-400 focus:border-red-500 focus:ring-red-500/30 dark:border-red-500";
const labelCls =
  "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";
const iconCls =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400";
const eyeBtnCls =
  "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      area: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const password = watch("password");
  const score = passwordRules.filter((r) => r.test(password || "")).length;
  const strength = strengthMeta[score];

  const handleRegister = async (data) => {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          area: data.area.trim(),
          password: data.password,
          
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 409) {
          setError("email", {
            type: "server",
            message: body.message || "An account with this email already exists",
          });
          return;
        }
        throw new Error(body.message || "Registration failed. Please try again.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/login?registered=1"), 1800);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Register as a citizen to start reporting issues.
        </p>
      </div>

      {success && (
        <div
          role="status"
          className="mb-5 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
        >
          <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>Account created successfully! Redirecting you to login…</p>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleRegister)} noValidate className="space-y-4">
        {/* Full name */}
        <div>
          <label htmlFor="fullName" className={labelCls}>
            Full name
          </label>
          <div className="relative">
            <FiUser className={iconCls} />
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              aria-invalid={!!errors.fullName}
              className={`${inputBase} ${errors.fullName ? inputErr : inputOk}`}
              {...register("fullName", {
                required: "Full name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters" },
                maxLength: { value: 60, message: "Name must be under 60 characters" },
                pattern: {
                  value: /^[\p{L}][\p{L}\s.'-]*$/u,
                  message: "Name contains invalid characters",
                },
              })}
            />
          </div>
          {errors.fullName && <FieldError message={errors.fullName.message} />}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelCls}>
            Email address
          </label>
          <div className="relative">
            <FiMail className={iconCls} />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
          </div>
          {errors.email && <FieldError message={errors.email.message} />}
        </div>

        {/* Phone + Area */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className={labelCls}>
              Phone number
            </label>
            <div className="relative">
              <FiPhone className={iconCls} />
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="01XXXXXXXXX"
                aria-invalid={!!errors.phone}
                className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\+?[0-9]{10,14}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
            </div>
            {errors.phone && <FieldError message={errors.phone.message} />}
          </div>

          <div>
            <label htmlFor="area" className={labelCls}>
              Area / Ward
            </label>
            <div className="relative">
              <FiMapPin className={iconCls} />
              <input
                id="area"
                type="text"
                placeholder="e.g. Ward 7"
                aria-invalid={!!errors.area}
                className={`${inputBase} ${errors.area ? inputErr : inputOk}`}
                {...register("area", {
                  required: "Area is required",
                  minLength: { value: 2, message: "Area is too short" },
                })}
              />
            </div>
            {errors.area && <FieldError message={errors.area.message} />}
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className={labelCls}>
            Password
          </label>
          <div className="relative">
            <FiLock className={iconCls} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a strong password"
              aria-invalid={!!errors.password}
              className={`${inputBase} pr-10 ${errors.password ? inputErr : inputOk}`}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
                validate: (v) =>
                  passwordRules.every((r) => r.test(v)) ||
                  "Password does not meet all requirements",
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className={eyeBtnCls}
            >
              {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <FieldError message={errors.password.message} />}

          {password && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex flex-1 gap-1" aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= score ? strength.bar : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-xs font-medium ${strength.text}`}>
                  {strength.label}
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {passwordRules.map((rule) => {
                  const ok = rule.test(password);
                  return (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-xs ${
                        ok
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <FiCheckCircle className={`h-3.5 w-3.5 ${ok ? "" : "opacity-40"}`} />
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirmPassword" className={labelCls}>
            Confirm password
          </label>
          <div className="relative">
            <FiLock className={iconCls} />
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              aria-invalid={!!errors.confirmPassword}
              className={`${inputBase} pr-10 ${errors.confirmPassword ? inputErr : inputOk}`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (v) => v === watch("password") || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className={eyeBtnCls}
            >
              {showConfirm ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <FieldError message={errors.confirmPassword.message} />}
        </div>

        {/* Terms */}
        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              {...register("terms", {
                required: "You must accept the terms to continue",
              })}
            />
            <span>
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.terms && <FieldError message={errors.terms.message} />}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || success}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900"
        >
          {isSubmitting ? (
            <>
              <FiLoader className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="mt-1.5 flex items-center gap-1 text-xs text-red-600 dark:text-red-400"
    >
      <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}
