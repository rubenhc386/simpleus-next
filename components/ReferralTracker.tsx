"use client";

import { useEffect } from "react";

export default function ReferralTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("r");

    if (ref) {
      localStorage.setItem("referral_code", ref);
    }
  }, []);

  return null;
}
