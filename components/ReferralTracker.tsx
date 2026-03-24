"use client";

import { useEffect } from "react";

export default function ReferralTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const ref = params.get("r");
    const affiliate = params.get("a");

    if (ref) {
      localStorage.setItem("referral_code", ref);
    }

    if (affiliate) {
      localStorage.setItem("affiliate_code", affiliate);
    }
  }, []);

  return null;
}